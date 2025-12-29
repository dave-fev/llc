<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class MailService
{
    /**
     * Send an email using Laravel's Mail facade.
     *
     * @param string $to Recipient email address
     * @param string $subject Email subject
     * @param string $body HTML body of the email
     * @param string|null $fromName Optional sender name
     * @return bool True if sent successfully, false otherwise
     */
    public static function send($to, $subject, $body, $fromName = null)
    {
        try {
            Mail::html($body, function ($message) use ($to, $subject, $fromName) {
                $message->to($to)
                        ->subject($subject);
                
                if ($fromName) {
                    $message->from(config('mail.from.address'), $fromName);
                }
            });

            return true;
        } catch (\Exception $e) {
            Log::error("MailService Error: " . $e->getMessage());
            return false;
        }
    }
}