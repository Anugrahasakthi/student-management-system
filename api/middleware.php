<?php


require_once __DIR__ . '/utils/Jwt.php';
require_once __DIR__ . '/utils/Response.php';


function auth(): array {
 
  if (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
  } else {
    $headers = [];
  }

  
  $auth = null;
  foreach ($headers as $key => $value) {
    if (strtolower($key) === 'authorization') {
      $auth = $value;
      break;
    }
  }

  
  if (!$auth || !str_starts_with($auth, 'Bearer ')) {
    response_json(401, 'Missing or invalid Authorization header');
  }

  
  $token = substr($auth, 7);

  try {
    
    $payload = jwt_decode($token);

    
    if (isset($payload['exp']) && time() >= $payload['exp']) {
      response_json(401, 'Token has expired');
    }

    
    return $payload;

  } catch (Exception $e) {
    response_json(401, 'Token invalid or expired');
  }
}


//to allow admin alone
function require_admin(array $payload): array {
  $role = $payload['role'] ?? null;

  if ($role !== 'admin') {
    response_json(403, 'Access denied: Admin only');
  }
  return $payload;
}

//to allow students alone
function require_student(array $payload): array {
  $role = $payload['role'] ?? null;

  if ($role !== 'student') {
    response_json(403, 'Access denied: Student only');
  }
  return $payload;
}
