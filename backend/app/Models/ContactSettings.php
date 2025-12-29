<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactSettings extends Model
{
    use HasFactory;

    protected $table = 'contact_settings';

    protected $fillable = [
        'phone_number',
        'phone_description',
        'email',
        'email_description',
        'address',
        'city',
        'state',
        'zip_code',
        'country',
    ];
}
