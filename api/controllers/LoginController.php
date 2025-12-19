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

  global $pdo;
  $query = $pdo->prepare("SELECT * FROM users WHERE email = ?");
  $query->execute([$email]);
  $user = $query->fetch();

  if (!$user || !password_verify($password, $user['password_hash'])) {
    response_json(401, 'Invalid email or password');
  }


  $student_id = null;
  if ($user['role'] === 'student') {
      $stmt = $pdo->prepare("SELECT id FROM students WHERE user_id = ?");
      $stmt->execute([$user['id']]);
      $stu = $stmt->fetch();
      $student_id = $stu['id'] ?? null;
  }


  $payload = [
    'id'          => $user['id'],       
    'student_id'  => $student_id,       
    'role'        => $user['role'],
    'email'       => $user['email'],
  ];


 

  $token = jwt_encode($payload);

  response_json(200, 'Login successful', [
    'token' => $token,
    'role'  => $user['role'],
    'user'  => [
      'id'          => $user['id'],
      'student_id'  => $student_id,
      'email'       => $user['email'],
    ],
  ]);
}
