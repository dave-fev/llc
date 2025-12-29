<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChapaSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChapaController extends Controller
{
    private const CHAPA_API_URL = 'https://api.chapa.co/v1/transaction/initialize';

    public function initialize(Request $request)
    {
        $settings = ChapaSettings::orderBy('id', 'desc')->first();
        $secretKey = $settings ? $settings->secret_key : env('CHAPA_SECRET_KEY', '');
        $isActive = $settings ? $settings->is_active : true;

        if (!$secretKey) {
            return response()->json([
                'error' => 'Chapa secret key is not configured.',
                'message' => 'The payment gateway is not properly set up. Please contact support.'
            ], 500);
        }

        if (!$isActive) {
            return response()->json(['error' => 'Chapa payments are currently disabled.'], 503);
        }

        $baseUrl = env('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');
        
        // Chapa requires title to be max 16 characters
        $paymentTitle = $settings->payment_title ?? 'Swift Filling';
        if (strlen($paymentTitle) > 16) {
            $paymentTitle = substr($paymentTitle, 0, 16);
        }
        
        $chapaRequest = [
            'amount' => (string) $request->amount,
            'currency' => $settings->currency ?? 'ETB',
            'email' => $request->email,
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'tx_ref' => $request->txRef,
            'callback_url' => $request->callbackUrl ?? ($settings->callback_url ?? "{$baseUrl}/api/chapa/callback"),
            'return_url' => $request->returnUrl ?? ($settings->return_url ?? "{$baseUrl}/payment/success"),
            'customization' => [
                'title' => $paymentTitle,
                'description' => $settings->payment_description ?? 'Complete your LLC registration payment',
            ],
        ];

        try {
            Log::info('Chapa Initialization Request', ['url' => self::CHAPA_API_URL, 'payload' => $chapaRequest]);
            $response = Http::withToken($secretKey)
                ->when(app()->environment('local'), function ($http) {
                    return $http->withoutVerifying();
                })
                ->post(self::CHAPA_API_URL, $chapaRequest);

            Log::info('Chapa Initialization Response', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->failed()) {
                Log::error('Chapa API Error', ['status' => $response->status(), 'body' => $response->json()]);
                
                $errorData = $response->json();
                $errorMessage = $errorData['message'] ?? 'Payment initialization failed.';
                
                // Extract more specific error if available
                if (isset($errorData['errors'])) {
                    $errors = $errorData['errors'];
                    if (is_array($errors)) {
                        $errorMessage = implode(', ', array_map(function($key, $value) {
                            return is_array($value) ? implode(', ', $value) : $value;
                        }, array_keys($errors), $errors));
                    }
                }
                
                return response()->json([
                    'error' => $errorMessage,
                    'details' => $errorData
                ], $response->status());
            }

            $data = $response->json();
            
            if (isset($data['data']['checkout_url'])) {
                return response()->json([
                    'checkout_url' => $data['data']['checkout_url'],
                    'tx_ref' => $request->txRef,
                ]);
            }

            Log::error('Chapa checkout_url missing', ['response' => $data]);
            return response()->json([
                'error' => 'No checkout URL received from payment gateway.',
                'details' => $data
            ], 500);

        } catch (\Exception $e) {
            Log::error('Chapa initialization exception', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function verify(Request $request, $txRef)
    {
        $settings = ChapaSettings::orderBy('id', 'desc')->first();
        $secretKey = $settings->secret_key ?? env('CHAPA_SECRET_KEY', '');

        try {
            $response = Http::withToken($secretKey)
                ->when(app()->environment('local'), function ($http) {
                    return $http->withoutVerifying();
                })
                ->get("https://api.chapa.co/v1/transaction/verify/{$txRef}");

            if ($response->failed()) {
                return response()->json(['success' => false, 'message' => 'Verification failed'], 400);
            }

            $data = $response->json();
            if ($data['status'] === 'success') {
                // Update Order and Create Company
                $order = \App\Models\Order::where('tx_ref', $txRef)->first();
                if ($order && $order->status !== 'paid' && $order->status !== 'completed') {
                    $order->update(['status' => 'paid']);

                    // Create Company record
                    \App\Models\Company::create([
                        'order_id' => $order->id,
                        'company_name' => $order->company_name,
                        'state' => $order->state,
                        'expiry_date' => now()->addYear(),
                    ]);
                }
                return response()->json(['success' => true, 'data' => $data]);
            }

            return response()->json(['success' => false, 'message' => 'Payment not successful'], 400);

        } catch (\Exception $e) {
            Log::error('Chapa verification exception', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function callback(Request $request)
    {
        // Handle Chapa webhook/callback logic here if needed
        Log::info('Chapa Callback received', $request->all());
        return response()->json(['status' => 'success']);
    }
}
