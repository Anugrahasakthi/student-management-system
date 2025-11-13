<?php
// sms/api/middleware.php

require_once __DIR__ . '/utils/Jwt.php';
require_once __DIR__ . '/utils/Response.php';

/**
 * Middleware: Verify token and return payload (id, email, role)
 * This function checks if a valid JWT is present in the Authorization header.
 * Example Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
function auth(): array {

  // Read headers sent to the server
  if (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
  } else {
    $headers = [];
  }

  // Find "Authorization" header (case insensitive)
  $auth = null;
  foreach ($headers as $key => $value) {
    if (strtolower($key) === 'authorization') {
      $auth = $value;
      break;
    }
  }

  // Header missing or malformed
  if (!$auth || !str_starts_with($auth, 'Bearer ')) {
    response_json(401, 'Missing or invalid Authorization header');
  }

  // Extract token from "Bearer xxxxx"
  $token = substr($auth, 7);

  try {
    // Decode and verify the token
    $payload = jwt_decode($token);

    // Optional: check token expiry manually (though jwt_decode likely already does this)
    if (isset($payload['exp']) && time() >= $payload['exp']) {
      response_json(401, 'Token has expired');
    }

    // Return the decoded payload (contains id, email, role, etc.)
    return $payload;

  } catch (Exception $e) {
    response_json(401, 'Token invalid or expired');
  }
}

/**
 * Middleware: Allow only admin users
 * Use this after auth() to block non-admin access.
 */
function require_admin(array $payload): void {
  $role = $payload['role'] ?? null;

  if ($role !== 'admin') {
    response_json(403, 'Access denied: Admin only');
  }
}

/**
 * Middleware: Allow only students
 * (Optional — can be used later if needed)
 */
function require_student(array $payload): void {
  $role = $payload['role'] ?? null;

  if ($role !== 'student') {
    response_json(403, 'Access denied: Student only');
  }
}
