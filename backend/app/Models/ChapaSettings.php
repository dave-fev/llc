<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChapaSettings extends Model
{
    use HasFactory;

    protected $table = 'chapa_settings';

    protected $fillable = [
        'is_active',
        'secret_key',
        'currency',
        'callback_url',
        'return_url',
        'payment_title',
        'payment_description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
