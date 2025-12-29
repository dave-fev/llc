<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test regular user
        $user = User::updateOrCreate(
            ['email' => 'user@test.com'],
            [
                'first_name' => 'Test',
                'last_name' => 'User',
                'phone' => '1234567890',
                'password' => Hash::make('password123'),
                'role' => 'customer',
                'is_active' => true,
            ]
        );

        echo "✓ Test user created: user@test.com / password123\n";

        // Create test admin user
        $admin = User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'first_name' => 'Admin',
                'last_name' => 'User',
                'phone' => '0987654321',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        echo "✓ Test admin created: admin@test.com / admin123\n";

        // Also ensure admin@swiftsfilling.com exists as admin
        User::updateOrCreate(
            ['email' => 'admin@swiftsfilling.com'],
            [
                'first_name' => 'Swift',
                'last_name' => 'Admin',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );
        echo "✓ Global admin created: admin@swiftsfilling.com / admin123\n";
    }
}
