<?php

require_once __DIR__ . '/../config.php';

function jwt_encode(array $payload): string {
  // add issued-at and (optional) expiry if not present
  if (!isset($payload['iat'])) $payload['iat'] = time();
  // setting expiry time = 2 hours
  if (!isset($payload['exp'])) $payload['exp'] = time() + 2 * 60 * 60; 

  $header   = ['alg' => 'HS256', 'typ' => 'JWT'];
  $segments = [];
  $segments[] = jwt_base64url_encode(json_encode($header));
  $segments[] = jwt_base64url_encode(json_encode($payload));
  $signing_input = implode('.', $segments);
  $signature = hash_hmac('sha256', $signing_input, JWT_SECRET, true);
  $segments[] = jwt_base64url_encode($signature);
  return implode('.', $segments);
}


function jwt_base64url_encode(string $data): string {
  return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
?>