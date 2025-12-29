<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('chapa_settings')) {
            Schema::create('chapa_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(true);
            $table->string('secret_key')->nullable();
            $table->string('currency')->default('USD');
            $table->string('callback_url')->nullable();
            $table->string('return_url')->nullable();
            $table->string('payment_title')->nullable();
            $table->text('payment_description')->nullable();
            $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('chapa_settings');
    }
};
