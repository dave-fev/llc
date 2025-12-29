<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Services\MailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::orderBy('created_at', 'DESC')->get());
    }

    public function userOrders(Request $request)
    {
        $user = $request->user();
        $email = $user->email;

        // Get orders explicitly linked to this user ID
        // Also include orders that match the user's email but have NULL user_id
        // And check the user_orders table if it exists
        $orders = Order::where('user_id', $user->id)
            ->orWhere(function($query) use ($email) {
                $query->whereNull('user_id')
                      ->where(function($q) use ($email) {
                          $q->where('contact_email', $email)
                            ->orWhere('account_email', $email);
                      });
            })
            ->orWhereIn('id', function($query) use ($user) {
                $query->select('order_id')
                      ->from('user_orders')
                      ->where('user_id', $user->id);
            })
            ->orderBy('created_at', 'DESC')
            ->get();

        return response()->json(['orders' => $orders]);
    }

    public function store(Request $request)
    {
        // Try to handle both flat structure and "formData" nested structure
        $data = $request->all();
        if ($request->has('formData')) {
            $formData = $request->get('formData');
            $data = array_merge($data, $formData);
        }

        $validator = Validator::make($data, [
            'company_name' => 'required|string|max:255',
            'state' => 'required|string',
            'contact_email' => 'required|email',
            'amount' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        // Handle User Creation if requested
        $userId = null;
        if (isset($data['account_email']) && isset($data['password'])) {
            $user = User::where('email', $data['account_email'])->first();
            if (!$user) {
                $user = User::create([
                    'email' => $data['account_email'],
                    'password' => Hash::make($data['password']),
                    'first_name' => $data['owners'][0]['firstName'] ?? null,
                    'last_name' => $data['owners'][0]['lastName'] ?? null,
                    'phone' => $data['contact_phone'] ?? null,
                    'role' => 'customer',
                    'is_active' => true,
                ]);

                // Send welcome email
                $welcomeSubject = "Welcome to Swift Filling - Account Created";
                $welcomeBody = "<h2>Welcome!</h2><p>Your account has been created successfully.</p>";
                MailService::send($user->email, $welcomeSubject, $welcomeBody);
            }
            $userId = $user->id;
        }

        $orderNumber = 'ORD-' . strtoupper(Str::random(10));

        $order = Order::create([
            'order_number' => $orderNumber,
            'tx_ref' => $data['tx_ref'] ?? ($data['txRef'] ?? null),
            'user_id' => $userId ?? ($request->user() ? $request->user()->id : null),
            'company_name' => $data['company_name'],
            'state' => $data['state'],
            'state_fee' => $data['state_fee'] ?? 0,
            'purpose' => $data['purpose'] ?? '',
            'physical_address' => $data['physical_address'] ?? ($data['physicalAddress'] ?? null),
            'mailing_address' => $data['mailing_address'] ?? ($data['mailingAddress'] ?? null),
            'same_as_physical' => filter_var($data['same_as_physical'] ?? ($data['sameAsPhysical'] ?? false), FILTER_VALIDATE_BOOLEAN),
            'management_type' => $data['management_type'] ?? ($data['managementType'] ?? 'member-managed'),
            'owners' => $data['owners'] ?? null,
            'managers' => $data['managers'] ?? null,
            'contact_email' => $data['contact_email'] ?? ($data['contactEmail'] ?? ''),
            'contact_phone' => $data['contact_phone'] ?? ($data['contactPhone'] ?? ''),
            'account_email' => $data['account_email'] ?? ($data['accountEmail'] ?? ($data['contact_email'] ?? ($data['contactEmail'] ?? ''))),
            'additional_services' => $data['additional_services'] ?? ($data['additionalServices'] ?? null),
            'amount' => $data['amount'],
            'status' => $data['status'] ?? 'processing',
            'payment_method' => $data['payment_method'] ?? 'card',
            'physical_registered_agent' => filter_var($data['physical_registered_agent'] ?? ($data['physicalRegisteredAgent'] ?? false), FILTER_VALIDATE_BOOLEAN),
            'physical_agent_address' => $data['physical_agent_address'] ?? ($data['physicalAgentAddress'] ?? null),
            'mailing_registered_agent' => filter_var($data['mailing_registered_agent'] ?? ($data['mailingRegisteredAgent'] ?? false), FILTER_VALIDATE_BOOLEAN),
            'mailing_agent_address' => $data['mailing_agent_address'] ?? ($data['mailingAgentAddress'] ?? null),
        ]);

        // Send confirmation email
        $subject = "Order Confirmation - " . $orderNumber;
        $body = "<h2>Thank you for your order!</h2>";
        $body .= "<p>Order Number: <strong>{$orderNumber}</strong></p>";
        $body .= "<p>Company: {$order->company_name}</p>";
        $body .= "<p>Amount: ${$order->amount}</p>";
        
        try {
            MailService::send($order->contact_email, $subject, $body);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send order confirmation email: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'orderId' => $order->id,
            'orderNumber' => $order->order_number,
            'message' => 'Order saved successfully'
        ], 201);
    }

    public function saveFromPayment(Request $request)
    {
        $payload = $request->all();
        $data = $payload['formData'] ?? [];
        $txRef = $payload['txRef'] ?? null;
        $amount = $payload['amount'] ?? 0;
        $userId = $request->user() ? $request->user()->id : null;

        \Illuminate\Support\Facades\Log::info('saveFromPayment called', [
            'has_form_data' => !empty($data),
            'txRef' => $txRef,
            'userId' => $userId,
            'email' => $data['accountEmail'] ?? ($data['account_email'] ?? 'not found')
        ]);

        // If not logged in, try to find or create user
        if (!$userId) {
            $email = $data['accountEmail'] ?? ($data['account_email'] ?? ($data['contactEmail'] ?? ($data['contact_email'] ?? null)));
            $password = $data['password'] ?? null;

            if ($email) {
                $user = User::where('email', $email)->first();
                if (!$user && $password) {
                    // Try to extract name from owners
                    $firstName = '';
                    $lastName = '';
                    if (!empty($data['owners']) && is_array($data['owners'])) {
                        $firstName = $data['owners'][0]['firstName'] ?? ($data['owners'][0]['first_name'] ?? '');
                        $lastName = $data['owners'][0]['lastName'] ?? ($data['owners'][0]['last_name'] ?? '');
                    }

                    $user = User::create([
                        'email' => $email,
                        'password' => \Illuminate\Support\Facades\Hash::make($password),
                        'first_name' => $firstName,
                        'last_name' => $lastName,
                        'role' => 'customer',
                        'is_active' => true,
                    ]);
                }
                if ($user) {
                    $userId = $user->id;
                }
            }
        }

        $orderNumber = 'ORD-' . strtoupper(Str::random(10));

        $order = Order::create([
            'order_number' => $orderNumber,
            'tx_ref' => $txRef,
            'user_id' => $userId,
            'company_name' => $data['companyName'] ?? ($data['company_name'] ?? 'N/A'),
            'state' => $data['state'] ?? 'N/A',
            'state_fee' => $data['stateFee'] ?? ($data['state_fee'] ?? 0),
            'purpose' => $data['purpose'] ?? '',
            'physical_address' => $data['physicalAddress'] ?? ($data['physical_address'] ?? null),
            'mailing_address' => $data['mailingAddress'] ?? ($data['mailing_address'] ?? null),
            'same_as_physical' => filter_var($data['sameAsPhysical'] ?? ($data['same_as_physical'] ?? false), FILTER_VALIDATE_BOOLEAN),
            'management_type' => $data['managementType'] ?? ($data['management_type'] ?? 'member-managed'),
            'owners' => $data['owners'] ?? null,
            'managers' => $data['managers'] ?? null,
            'contact_email' => $data['contactEmail'] ?? ($data['contact_email'] ?? ''),
            'contact_phone' => $data['contactPhone'] ?? ($data['contact_phone'] ?? ''),
            'account_email' => $data['accountEmail'] ?? ($data['account_email'] ?? ($data['contactEmail'] ?? ($data['contact_email'] ?? ''))),
            'additional_services' => $data['additionalServices'] ?? ($data['additional_services'] ?? null),
            'amount' => $amount,
            'status' => 'pending',
            'payment_method' => 'card',
            'physical_registered_agent' => filter_var($data['physicalRegisteredAgent'] ?? ($data['physical_registered_agent'] ?? false), FILTER_VALIDATE_BOOLEAN),
            'physical_agent_address' => $data['physicalAgentAddress'] ?? ($data['physical_agent_address'] ?? null),
            'mailing_registered_agent' => filter_var($data['mailingRegisteredAgent'] ?? ($data['mailing_registered_agent'] ?? false), FILTER_VALIDATE_BOOLEAN),
            'mailing_agent_address' => $data['mailingAgentAddress'] ?? ($data['mailing_agent_address'] ?? null),
        ]);

        if (!($payload['suppressEmails'] ?? false)) {
            // Send email if not suppressed
            $subject = "Order Confirmation - " . $orderNumber;
            $body = "<h2>Thank you for your order!</h2>";
            $body .= "<p>Order Number: <strong>{$orderNumber}</strong></p>";
            try {
                MailService::send($order->contact_email, $subject, $body);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to send order confirmation email from payment: ' . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'orderId' => $order->id,
            'orderNumber' => $order->order_number,
        ], 201);
    }

    public function show($id)
    {
        $order = Order::findOrFail($id);
        return response()->json($order);
    }

    public function showByOrderId(Request $request)
    {
        $orderId = $request->query('orderId');
        $order = Order::findOrFail($orderId);
        $user = $request->user();

        // Security check: Only allow if it's the user's order or email matches
        if ($user) {
            $isOwner = $order->user_id == $user->id;
            $emailMatches = ($order->contact_email == $user->email || $order->account_email == $user->email);
            
            // Check user_orders table associations
            $isAssociated = \Illuminate\Support\Facades\DB::table('user_orders')
                ->where('user_id', $user->id)
                ->where('order_id', $order->id)
                ->exists();

            if (!$isOwner && !$emailMatches && !$isAssociated) {
                // If it's not the owner, also check if it's an admin (optional, but good)
                if ($user->role !== 'admin') {
                    return response()->json(['error' => 'Unauthorized'], 403);
                }
            }
        } else {
            // If No authenticated user, only public logic (rarely hits because of middleware)
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        return response()->json(['order' => $order]);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update($request->all());
        return response()->json($order);
    }
}
