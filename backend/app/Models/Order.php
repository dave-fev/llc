<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'tx_ref',
        'user_id',
        'company_name',
        'state',
        'state_fee',
        'purpose',
        'physical_address',
        'mailing_address',
        'same_as_physical',
        'management_type',
        'owners',
        'managers',
        'contact_email',
        'contact_phone',
        'account_email',
        'additional_services',
        'amount',
        'status',
        'payment_method',
        'physical_registered_agent',
        'physical_agent_address',
        'mailing_registered_agent',
        'mailing_agent_address',
    ];

    protected $casts = [
        'owners' => 'json',
        'managers' => 'json',
        'additional_services' => 'json',
        'physical_address' => 'json',
        'mailing_address' => 'json',
        'same_as_physical' => 'boolean',
        'state_fee' => 'decimal:2',
        'amount' => 'decimal:2',
        'physical_registered_agent' => 'boolean',
        'mailing_registered_agent' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function company()
    {
        return $this->hasOne(Company::class);
    }
}
