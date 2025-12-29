<?php

/**
 * Backend API Endpoint Test Script
 * Tests all endpoints one by one
 */

$baseUrl = 'http://127.0.0.1:8000';
$testResults = [];

// Test colors for output
$green = "\033[32m";
$red = "\033[31m";
$yellow = "\033[33m";
$blue = "\033[34m";
$reset = "\033[0m";

function testEndpoint($method, $url, $data = null, $cookies = []) {
    global $baseUrl;
    
    $ch = curl_init($baseUrl . $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    $headers = ['Content-Type: application/json'];
    if (!empty($cookies)) {
        $cookieString = '';
        foreach ($cookies as $name => $value) {
            $cookieString .= "$name=$value; ";
        }
        curl_setopt($ch, CURLOPT_COOKIE, rtrim($cookieString, '; '));
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    curl_setopt($ch, CURLOPT_COOKIEJAR, '/tmp/cookies.txt');
    curl_setopt($ch, CURLOPT_COOKIEFILE, '/tmp/cookies.txt');
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'body' => json_decode($response, true),
        'raw' => $response
    ];
}

function printResult($testName, $result, $expectedCode = 200) {
    global $green, $red, $yellow, $blue, $reset;
    
    $status = $result['code'] === $expectedCode ? 'PASS' : 'FAIL';
    $color = $result['code'] === $expectedCode ? $green : $red;
    
    echo "{$color}[{$status}]{$reset} {$blue}{$testName}{$reset}\n";
    echo "   Status: {$result['code']} (Expected: {$expectedCode})\n";
    
    if ($result['code'] !== $expectedCode) {
        echo "   {$red}Response: " . substr($result['raw'], 0, 200) . "...{$reset}\n";
    } else {
        echo "   {$green}✓ Success{$reset}\n";
    }
    echo "\n";
}

echo "{$blue}========================================{$reset}\n";
echo "{$blue}  BACKEND API ENDPOINT TESTING{$reset}\n";
echo "{$blue}========================================{$reset}\n\n";

// 1. Test Connection
echo "{$yellow}1. Testing Connection...{$reset}\n";
$result = testEndpoint('GET', '/api/auth/test-connection');
printResult('Test Connection', $result, 200);

// 2. Test User Login (will fail without test user)
echo "{$yellow}2. Testing User Login...{$reset}\n";
$result = testEndpoint('POST', '/api/auth/login', [
    'email' => 'test@example.com',
    'password' => 'password123'
]);
printResult('User Login (Invalid Credentials)', $result, 401);

// 3. Test Admin Login (will fail without test admin)
echo "{$yellow}3. Testing Admin Login...{$reset}\n";
$result = testEndpoint('POST', '/api/auth/admin-login', [
    'email' => 'admin@example.com',
    'password' => 'admin123'
]);
printResult('Admin Login (Invalid Credentials)', $result, 401);

// 4. Test SEO Endpoint
echo "{$yellow}4. Testing SEO Endpoint...{$reset}\n";
$result = testEndpoint('GET', '/api/seo?pagePath=/');
printResult('SEO Settings', $result, 200);

// 5. Test Orders List (Public)
echo "{$yellow}5. Testing Orders List (Public)...{$reset}\n";
$result = testEndpoint('GET', '/api/orders/list');
printResult('Orders List', $result, 200);

// 6. Test Contact Form
echo "{$yellow}6. Testing Contact Form...{$reset}\n";
$result = testEndpoint('POST', '/api/contact', [
    'name' => 'Test User',
    'email' => 'test@example.com',
    'phone' => '1234567890',
    'subject' => 'Test Subject',
    'message' => 'Test Message'
]);
printResult('Contact Form', $result, 200);

echo "{$blue}========================================{$reset}\n";
echo "{$green}Basic endpoint tests completed!{$reset}\n";
echo "{$blue}========================================{$reset}\n\n";

echo "{$yellow}Note: To test authenticated endpoints, you need to:{$reset}\n";
echo "1. Create test users in the database\n";
echo "2. Login first to get session cookies\n";
echo "3. Then test protected endpoints\n\n";

