<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $name = $request->name;
        $email = $request->email;
        $phone = $request->phone;
        $subject = $request->subject;
        $message = $request->message;

        // Templates - Admin Notification
        $adminEmail = env('ADMIN_EMAIL', 'support@swiftsfilling.com');
        $supportEmailHtml = "
          <!DOCTYPE html>
          <html>
          <head><meta charset='utf-8'></head>
          <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
              <div style='background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
                <h1 style='margin: 0;'>Swift Filling</h1>
                <p style='margin: 10px 0 0 0;'>New Contact Form Submission</p>
              </div>
              <div style='background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;'>
                <h2>New Contact Form Message</h2>
                <div style='background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1a1a1a;'>
                  <strong>From:</strong> {$name}<br>
                  <strong>Email:</strong> <a href='mailto:{$email}'>{$email}</a><br>
                  " . ($phone ? "<strong>Phone:</strong> <a href='tel:{$phone}'>{$phone}</a><br>" : "") . "
                  <strong>Subject:</strong> {$subject}
                </div>
                <div style='background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;'>
                  <strong>Message:</strong>
                  <p style='margin-top: 10px; white-space: pre-wrap;'>{$message}</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        ";

        // Template - User Confirmation
        $userConfirmationHtml = "
          <!DOCTYPE html>
          <html>
          <head><meta charset='utf-8'></head>
          <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
              <div style='background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
                <h1 style='margin: 0;'>Swift Filling</h1>
                <p style='margin: 10px 0 0 0;'>Thank You for Contacting Us</p>
              </div>
              <div style='background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;'>
                <h2>Message Received!</h2>
                <div style='background: #10b981; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0;'>✓ We Got Your Message</div>
                <p>Dear {$name},</p>
                <p>Thank you for contacting Swift Filling. We have received your message and will get back to you within 24 hours.</p>
                <div style='background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1a1a1a;'>
                  <strong>Your Message:</strong><br>
                  <strong>Subject:</strong> {$subject}<br>
                  <p style='margin-top: 10px; white-space: pre-wrap;'>{$message}</p>
                </div>
                <p>Best regards,<br>The Swift Filling Team</p>
              </div>
            </div>
          </body>
          </html>
        ";

        MailService::send($adminEmail, "Contact Form: {$subject}", $supportEmailHtml, $name);
        MailService::send($email, "Thank You for Contacting Swift Filling - {$subject}", $userConfirmationHtml);

        return response()->json([
            'success' => true,
            'message' => 'Your message has been sent successfully.'
        ]);
    }
}
