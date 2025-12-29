<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'physical_registered_agent')) {
                $table->boolean('physical_registered_agent')->default(false);
            }
            if (!Schema::hasColumn('orders', 'physical_agent_address')) {
                $table->text('physical_agent_address')->nullable();
            }
            if (!Schema::hasColumn('orders', 'mailing_registered_agent')) {
                $table->boolean('mailing_registered_agent')->default(false);
            }
            if (!Schema::hasColumn('orders', 'mailing_agent_address')) {
                $table->text('mailing_agent_address')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'physical_registered_agent',
                'physical_agent_address',
                'mailing_registered_agent',
                'mailing_agent_address'
            ]);
        });
    }
};
