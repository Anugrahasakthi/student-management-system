<?php
// sms/api/index.php

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/controllers/LoginController.php';
require_once __DIR__ . '/controllers/RegisterController.php';
require_once __DIR__ . '/utils/Response.php';


// (Optional but helpful) CORS for local Vite
// if (defined('ALLOW_ORIGIN')) {
//   header('Access-Control-Allow-Origin: ' . ALLOW_ORIGIN);
//   header('Access-Control-Allow-Credentials: true');
// }
// header('Access-Control-Allow-Headers: Content-Type, Authorization');
// header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//   http_response_code(204);
//   exit;
// }

// Simple router
$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$normalized = $uri;

// removing index.php if exists in URL
$normalized = str_replace('/sms/api/index.php', '', $normalized);

// remove folder path
$normalized = str_replace('/sms/api', '', $normalized);

// if empty, set to root
if ($normalized === '') $normalized = '/';


// ROUTES

// LOGIN route
if ($method === 'POST' && $normalized === '/login') {
  loginController();
}

// REGISTER route  
if ($method === 'POST' && $normalized === '/register') {
  registerController();
}

// Fallback for unknown routes
response_json(404, 'Route not found: ' . $normalized);
