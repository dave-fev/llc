<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Order;
use App\Models\Company;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function companies(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;
        $email = $user->email;

        $companies = Order::whereIn('orders.status', ['paid', 'processing', 'completed', 'pending'])
            ->where(function($query) use ($userId, $email) {
                $query->where('orders.user_id', $userId)
                    ->orWhere(function($q) use ($email) {
                        $q->whereNull('orders.user_id')
                          ->where(function($qq) use ($email) {
                              $qq->where('orders.contact_email', $email)
                                ->orWhere('orders.account_email', $email);
                          });
                    })
                    ->orWhereIn('orders.id', function($q) use ($userId) {
                        $q->select('order_id')
                          ->from('user_orders')
                          ->where('user_id', $userId);
                    });
            })
            ->join('companies', 'companies.order_id', '=', 'orders.id')
            ->select(
                'orders.*', 
                'companies.order_id', 
                'companies.company_name', 
                'companies.state', 
                'companies.expiry_date'
            )
            ->orderBy('orders.created_at', 'DESC')
            ->get();

        return response()->json(['companies' => $companies]);
    }

    public function inbox(Request $request)
    {
        $userId = $request->user()->id;
        $unreadOnly = $request->query('unread') === 'true';

        $query = Message::where('user_id', $userId);

        if ($unreadOnly) {
            $query->where('status', 'unread');
        }

        $messages = $query->orderBy('created_at', 'DESC')->get();

        $unreadCount = Message::where('user_id', $userId)->where('status', 'unread')->count();
        $documentsCount = Message::where('user_id', $userId)
            ->whereNotNull('document_url')
            ->where('document_url', '!=', '')
            ->count();

        return response()->json([
            'messages' => $messages,
            'unreadCount' => $unreadCount,
            'documentsCount' => $documentsCount,
        ]);
    }

    public function updateMessage(Request $request)
    {
        $userId = $request->user()->id;
        $messageId = $request->messageId;
        $status = $request->status;

        $message = Message::where('id', $messageId)->where('user_id', $userId)->firstOrFail();
        $message->update(['status' => $status]);

        return response()->json(['success' => true, 'message' => $message]);
    }

    public function deleteMessage(Request $request)
    {
        $userId = $request->user()->id;
        $messageId = $request->query('messageId');

        Message::where('id', $messageId)->where('user_id', $userId)->delete();

        return response()->json(['success' => true]);
    }
}
