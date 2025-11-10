<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../utils/Jwt.php';
require_once __DIR__ . '/../utils/Response.php';

function loginController(): void {
  $body = file_get_contents('php://input');
  $data = json_decode($body, true);

  $email = trim($data['email'] ?? '');
  $password = ($data['password'] ?? '');

  if ($email === '' || $password === '') {
    response_json(400, 'Email & Password are required');
  }

  // Finding user by email
  global $pdo;
  $query = $pdo->prepare("SELECT * FROM users WHERE email = ?");
  $query->execute([$email]);
  $user = $query->fetch();

  // Checking email or password is valid
  if (!$user || !password_verify($password, $user['password_hash'])) {
    response_json(401, 'Invalid email or password');
  }

  // To generate token payload
  $payload = [
    'id'    => $user['id'],
    'email' => $user['email'],
    'role'  => $user['role'],
    ];

  $token = jwt_encode($payload);

  response_json(200, 'Login successful', [
    'token' => $token,
    'role'  => $user['role'],
    'user'  => [
      'id'    => $user['id'],
      'email' => $user['email']      
    ],
  ]);
}
