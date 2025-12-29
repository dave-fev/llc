<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('tx_ref')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('company_name');
            $table->string('state');
            $table->decimal('state_fee', 10, 2)->default(0);
            $table->text('purpose')->nullable();
            $table->json('physical_address')->nullable();
            $table->json('mailing_address')->nullable();
            $table->boolean('same_as_physical')->default(false);
            $table->string('management_type')->default('member-managed');
            $table->json('owners')->nullable();
            $table->json('managers')->nullable();
            $table->string('contact_email');
            $table->string('contact_phone')->nullable();
            $table->string('account_email')->nullable();
            $table->json('additional_services')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('status')->default('pending');
            $table->string('payment_method')->default('card');
            $table->boolean('physical_registered_agent')->default(false);
            $table->text('physical_agent_address')->nullable();
            $table->boolean('mailing_registered_agent')->default(false);
            $table->text('mailing_agent_address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
