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

  // =========================
  // Student ID (existing)
  // =========================
  $student_id = null;
  if ($user['role'] === 'student') {
    $stmt = $pdo->prepare("SELECT id FROM students WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $stu = $stmt->fetch();
    $student_id = $stu['id'] ?? null;
  }

  // =========================
  // Staff ID (NEW)
  // =========================
  $staff_id = null;
  if ($user['role'] === 'staff') {
    $stmt = $pdo->prepare("SELECT id FROM staff WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $stf = $stmt->fetch();
    $staff_id = $stf['id'] ?? null;
  }

  // =========================
  // JWT Payload
  // =========================
  $payload = [
    'id'         => $user['id'],
    'role'       => $user['role'],
    'email'      => $user['email'],
    'student_id' => $student_id,
    'staff_id'   => $staff_id,
  ];

  $token = jwt_encode($payload);

  // =========================
  // Response
  // =========================
  response_json(200, 'Login successful', [
    'token' => $token,
    'role'  => $user['role'],
    'user'  => [
      'id'         => $user['id'],
      'email'      => $user['email'],
      'student_id' => $student_id,
      'staff_id'   => $staff_id,
    ],
  ]);
}
