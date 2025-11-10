<?php
require_once __DIR__ . '/utils/Jwt.php';
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/config.php';

/**
 * Middleware to protect routes
 */
function auth(): array {

  $headers = apache_request_headers() ?: [];

  $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

  if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
    response_json(401, 'Missing token');
  }

  $token = substr($authHeader, 7);

  try {
    $payload = jwt_decode($token); // verify token
    return $payload; // id, email, role from token
  } catch (Exception $e) {
    response_json(401, 'Invalid or expired token');
  }
}
