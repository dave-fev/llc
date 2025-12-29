<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\MaintenanceMode;
use App\Models\ContactSettings;
use App\Models\Message;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'totalUsers' => User::count(),
            'totalOrders' => Order::count(),
            'totalCompanies' => \App\Models\Company::count(),
            'totalRevenue' => Order::where('status', 'completed')->sum('amount'),
            'completedOrders' => Order::where('status', 'completed')->count(),
            'activeUsers' => User::where('is_active', true)->count(),
        ]);
    }

    public function companies(Request $request)
    {
        $search = $request->query('search');
        
        $query = \App\Models\Company::join('orders', 'companies.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->select(
                'companies.*',
                'orders.order_number',
                'orders.status as order_status',
                'orders.amount',
                'orders.payment_method',
                'orders.state_fee',
                'orders.purpose',
                'orders.physical_address',
                'orders.mailing_address',
                'orders.same_as_physical',
                'orders.management_type',
                'orders.owners',
                'orders.managers',
                'orders.contact_email',
                'orders.contact_phone',
                'orders.account_email',
                'orders.additional_services',
                'orders.physical_registered_agent',
                'orders.physical_agent_address',
                'orders.mailing_registered_agent',
                'orders.mailing_agent_address',
                'users.email as user_email',
                'users.first_name as user_first_name',
                'users.last_name as user_last_name'
            );

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('companies.company_name', 'like', "%{$search}%")
                  ->orWhere('companies.state', 'like', "%{$search}%")
                  ->orWhere('orders.order_number', 'like', "%{$search}%")
                  ->orWhere('orders.contact_email', 'like', "%{$search}%")
                  ->orWhere('orders.account_email', 'like', "%{$search}%");
            });
        }

        $companies = $query->orderBy('companies.created_at', 'desc')->get()->map(function($company) {
            $company->user = $company->user_email ? [
                'email' => $company->user_email,
                'firstName' => $company->user_first_name,
                'lastName' => $company->user_last_name
            ] : null;
            return $company;
        });

        return response()->json(['companies' => $companies]);
    }


    public function orders()
    {
        $orders = Order::with('user')->orderBy('created_at', 'desc')->get()->map(function($order) {
            if ($order->user) {
                // Map snake_case to camelCase for frontend
                $order->user_info = [
                    'firstName' => $order->user->first_name,
                    'lastName' => $order->user->last_name,
                    'email' => $order->user->email,
                ];
            } else {
                // Try to find first name/last name from owners if possible
                $firstName = '';
                $lastName = '';
                try {
                    $owners = is_string($order->owners) ? json_decode($order->owners, true) : $order->owners;
                    if (!empty($owners) && is_array($owners)) {
                        $firstName = $owners[0]['firstName'] ?? ($owners[0]['first_name'] ?? '');
                        $lastName = $owners[0]['lastName'] ?? ($owners[0]['last_name'] ?? '');
                    }
                } catch (\Exception $e) {}

                $order->user_info = [
                    'firstName' => $firstName ?: 'Guest',
                    'lastName' => $lastName,
                    'email' => $order->contact_email ?: ($order->account_email ?: 'N/A'),
                ];
            }
            return $order;
        });

        return response()->json(['orders' => $orders]);
    }

    public function users()
    {
        $users = User::withCount('orders')->orderBy('created_at', 'desc')->get()->map(function($user) {
            $user->order_count = $user->orders_count;
            return $user;
        });

        return response()->json(['users' => $users]);
    }

    public function updateMaintenance(Request $request)
    {
        $settings = MaintenanceMode::firstOrNew();
        $settings->enabled = $request->isEnabled;
        $settings->message = $request->message;
        $settings->show_message = $request->showMessage ?? true;
        $settings->save();

        return response()->json(['success' => true, 'settings' => $settings]);
    }

    public function updateContactSettings(Request $request)
    {
        $settings = ContactSettings::firstOrNew();
        $settings->email = $request->contactEmail;
        $settings->phone_number = $request->contactPhone;
        $settings->address = $request->contactAddress;
        $settings->save();

        return response()->json(['success' => true, 'settings' => $settings]);
    }

    public function messages()
    {
        $messages = Message::with('user')->orderBy('created_at', 'desc')->get()->map(function($message) {
            $message->user_name = $message->user ? ($message->user->first_name . ' ' . $message->user->last_name) : 'N/A';
            $message->user_email = $message->user ? $message->user->email : 'N/A';
            return $message;
        });

        return response()->json(['messages' => $messages]);
    }

    public function sendDocument(Request $request)
    {
        $request->validate([
            'companyId' => 'required',
            'documentName' => 'required',
            'documentUrl' => 'required',
            'subject' => 'required',
            'message' => 'required',
        ]);

        $company = \App\Models\Company::findOrFail($request->companyId);
        $order = $company->order;
        
        if (!$order) {
            return response()->json(['error' => 'Order not found for this company'], 404);
        }

        $userId = $order->user_id;

        if (!$userId) {
            // Find user by email
            $email = $order->contact_email ?? $order->account_email;
            $user = User::where('email', $email)->first();
            if (!$user) {
                return response()->json(['error' => 'User account not found for ' . $email], 404);
            }
            $userId = $user->id;
        }

        $message = Message::create([
            'user_id' => $userId,
            'subject' => $request->subject,
            'content' => $request->message,
            'type' => 'document',
            'status' => 'unread',
            'document_url' => $request->documentUrl,
            'document_name' => $request->documentName,
            'document_type' => 'pdf',
        ]);

        return response()->json(['success' => true, 'message' => 'Document sent successfully']);
    }
}
