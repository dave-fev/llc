<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SEOController;
use App\Http\Controllers\Api\ChapaController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\AdminController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/admin-login', [AuthController::class, 'adminLogin']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/profile', [AuthController::class, 'profile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user/orders', [OrderController::class, 'userOrders']);
    
    // User specific data
    Route::get('/user/companies', [UserController::class, 'companies']);
    Route::get('/user/inbox', [UserController::class, 'inbox']);
    Route::patch('/user/inbox', [UserController::class, 'updateMessage']);
    Route::delete('/user/inbox', [UserController::class, 'deleteMessage']);
    Route::get('/orders/get', [OrderController::class, 'showByOrderId']);

    // Admin routes (should ideally have admin middleware here)
    Route::get('/admin/stats', [AdminController::class, 'stats']);
    Route::get('/admin/orders', [AdminController::class, 'orders']);
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::post('/admin/maintenance', [AdminController::class, 'updateMaintenance']);
    Route::get('/admin/messages', [AdminController::class, 'messages']);
    Route::get('/admin/companies', [AdminController::class, 'companies']);
    Route::post('/admin/companies/send-document', [AdminController::class, 'sendDocument']);
});

Route::get('/services', [ServiceController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);
Route::post('/orders', [OrderController::class, 'store']);

Route::get('/seo', [SEOController::class, 'show']);

Route::post('/chapa/initialize', [ChapaController::class, 'initialize']);
Route::get('/chapa/verify/{txRef}', [ChapaController::class, 'verify']);
Route::post('/chapa/callback', [ChapaController::class, 'callback']);

Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::post('/orders/save-from-payment', [OrderController::class, 'saveFromPayment']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::patch('/orders/{id}', [OrderController::class, 'update']);

// Public Settings
Route::get('/admin/maintenance', [SettingsController::class, 'getMaintenance']);
Route::get('/contact-settings', [SettingsController::class, 'getContactSettings']);
