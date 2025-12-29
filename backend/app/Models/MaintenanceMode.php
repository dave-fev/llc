<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceMode extends Model
{
    use HasFactory;

    protected $table = 'maintenance_mode';

    protected $fillable = [
        'enabled',
        'message',
        'show_message',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'show_message' => 'boolean',
    ];
}
