<?php

require_once __DIR__ . '/../config.php';

function jwt_encode(array $payload): string {
    // issued-at + expiry
    $payload['iat'] = time();
    $payload['exp'] = time() + 2 * 60 * 60; // 2 hours expiry

    $header = ['alg' => 'HS256', 'typ' => 'JWT'];

    $segments = [];
    $segments[] = jwt_base64url_encode(json_encode($header));
    $segments[] = jwt_base64url_encode(json_encode($payload));

    $signing_input = implode('.', $segments);
    $signature = hash_hmac('sha256', $signing_input, JWT_SECRET, true);

    $segments[] = jwt_base64url_encode($signature);

    return implode('.', $segments);
}

function jwt_decode(string $token): array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        throw new Exception("Invalid token format");
    }

    [$h64, $p64, $s64] = $parts;

    $header  = json_decode(jwt_base64url_decode($h64), true);
    $payload = json_decode(jwt_base64url_decode($p64), true);
    $sig     = jwt_base64url_decode($s64);

    if (!is_array($header) || ($header['alg'] ?? '') !== 'HS256') {
        throw new Exception("Unsupported algorithm");
    }

    $check = hash_hmac('sha256', "$h64.$p64", JWT_SECRET, true);

    if (!hash_equals($check, $sig)) {
        throw new Exception("Signature mismatch");
    }

    if (isset($payload['exp']) && time() >= $payload['exp']) {
        throw new Exception("Token expired");
    }

    return $payload;
}

function jwt_base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function jwt_base64url_decode(string $data): string {
    $rem = strlen($data) % 4;
    if ($rem) {
        $data .= str_repeat('=', 4 - $rem);
    }
    return base64_decode(strtr($data, '-_', '+/')) ?: '';
}

?>
