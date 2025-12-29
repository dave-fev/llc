<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceMode;
use App\Models\ContactSettings;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function getMaintenance()
    {
        $settings = MaintenanceMode::first();
        return response()->json([
            'isEnabled' => $settings->enabled ?? false,
            'message' => $settings->message ?? 'We are currently performing maintenance. Please check back later.',
            'showMessage' => $settings->show_message ?? false
        ]);
    }

    public function getContactSettings()
    {
        $settings = ContactSettings::orderBy('id', 'desc')->first();
        if (!$settings) {
            return response()->json([
                'contactEmail' => 'support@swiftsfilling.com',
                'contactPhone' => '1-800-SWIFT-FILL',
                'contactAddress' => '123 Business Ave, Suite 100, City, ST 12345',
                'workingHours' => 'Mon-Fri: 9am - 5pm EST'
            ]);
        }

        return response()->json([
            'contactEmail' => $settings->email,
            'emailDescription' => $settings->email_description,
            'contactPhone' => $settings->phone_number,
            'phoneDescription' => $settings->phone_description,
            'contactAddress' => $settings->address,
            'city' => $settings->city,
            'state' => $settings->state,
            'zipCode' => $settings->zip_code,
            'country' => $settings->country,
            // Fallback for combined address if frontend needs it
            'fullAddress' => "{$settings->address}, {$settings->city}, {$settings->state} {$settings->zip_code}"
        ]);
    }
}
