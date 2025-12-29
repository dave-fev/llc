<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ChapaSettings;

class ChapaSettingsSeeder extends Seeder
{
    public function run(): void
    {
        ChapaSettings::updateOrCreate(
            ['id' => 1],
            [
                'is_active' => true,
                'secret_key' => env('CHAPA_SECRET_KEY', 'CHASECK_TEST-ZOP3A4kXGgkiVeBD2icnhLtjm4OziWQ8'),
                'currency' => 'ETB',
                'callback_url' => env('CHAPA_CALLBACK_URL', 'https://swiftsfilling.com/api/chapa/callback'),
                'return_url' => env('CHAPA_RETURN_URL', 'https://swiftsfilling.com/payment/success'),
                'payment_title' => 'LLC Formation Payment',
                'payment_description' => 'Payment for LLC Formation Service',
            ]
        );
    }
}
