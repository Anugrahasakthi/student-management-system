<?php

require_once __DIR__ . '/utils/Jwt.php';
require_once __DIR__ . '/utils/Response.php';

// AUTH MIDDLEWARE Decodes JWT and returns payload

function auth(): array {

   
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        
    } else {
        $headers = [];
    }

    $authHeader = null;

    foreach ($headers as $key => $value) {
        if (strtolower($key) === 'authorization') {
            $authHeader = $value;
            break;
        }
    }

    // No header → reject
    if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
        response_json(401, 'Missing or invalid Authorization header');
    }

    // Extract pure token
    $token = substr($authHeader, 7);

    try {
        // Decode token
        $payload = jwt_decode($token);

        // Token expiry check
        if (isset($payload['exp']) && time() >= $payload['exp']) {
            response_json(401, 'Token has expired');
        }

        
        return $payload;

    } catch (Exception $e) {
        response_json(401, 'Token invalid or expired');
    }
}


// function auth(): array {

//     $authHeader = null;

//     // 1️⃣ Most reliable (works in many cases)
//     if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
//         $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
//     }
//     // 2️⃣ Some Apache configs
//     elseif (isset($_SERVER['Authorization'])) {
//         $authHeader = $_SERVER['Authorization'];
//     }
//     // 3️⃣ Fallback (your original working logic)
//     elseif (function_exists('apache_request_headers')) {
//         $headers = apache_request_headers();
//         foreach ($headers as $key => $value) {
//             if (strtolower($key) === 'authorization') {
//                 $authHeader = $value;
//                 break;
//             }
//         }
//     }

//     if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
//         response_json(401, 'Missing or invalid Authorization header');
//     }

//     $token = substr($authHeader, 7);

//     try {
//         return jwt_decode($token);
//     } catch (Exception $e) {
//         response_json(401, 'Token invalid or expired');
//     }
// }




//ADMIN - access only
 
function require_admin(array $payload): array {
    if (($payload['role'] ?? null) !== 'admin') {
        response_json(403, 'Access denied: Admin only');
    }
    return $payload;
}

//STUDENT - access only
 
function require_student(array $payload): array {
    if (($payload['role'] ?? null) !== 'student') {
        response_json(403, 'Access denied: Student only');
    }
    return $payload;
}

            
function is_admin(array $payload): bool {
    return ($payload['role'] ?? null) === 'admin';
}

function is_student(array $payload): bool {
    return ($payload['role'] ?? null) === 'student';
}


// STAFF - access only
function require_staff(array $payload): array {
    if (($payload['role'] ?? null) !== 'staff') {
        response_json(403, 'Access denied: Staff only');
    }
    return $payload;
}
