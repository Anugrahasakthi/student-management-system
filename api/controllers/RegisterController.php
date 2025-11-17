<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../utils/Response.php';

function registerController() {
  $data = json_decode(file_get_contents("php://input"), true);

  // Basic fields (common for both roles)
  $email = trim($data['email'] ?? '');
  $password = trim($data['password'] ?? '');
  $role = trim($data['role'] ?? '');

  // Profile details
  $name = trim($data['name'] ?? '');
  $phone = trim($data['phone'] ?? '');
  $dob = trim($data['dob'] ?? '');

  // Validate input
  if ($email === '' || $password === '' || $role === '' || $name === '') {
    response_json(400, 'Email, password, name, and role are required');
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    response_json(400, 'Invalid email format');
  }

  if (!in_array($role, ['admin', 'student'])) {
    response_json(400, 'Role must be either admin or student');
  }

  global $pdo;

  // Check for duplicate email
  $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
  $stmt->execute([$email]);
  if ($stmt->fetch()) {
    response_json(409, 'Email already registered');
  }

  // Insert into users table
  $hash = password_hash($password, PASSWORD_BCRYPT);
  $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)");
  $stmt->execute([$email, $hash, $role]);
  $userId = $pdo->lastInsertId();

  // Insert into role-specific table
  if ($role === 'student') {
    $stmt = $pdo->prepare("
      INSERT INTO students (user_id, email, name, phone, dob)
      VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$userId, $email, $name, $phone, $dob]);
  } elseif ($role === 'admin') {
    $stmt = $pdo->prepare("
      INSERT INTO admin (user_id, email, name, phone, dob)
      VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$userId, $email, $name, $phone, $dob]);
  }

  // Success response
  response_json(201, 'User registered successfully', [
    'email' => $email,
    'role' => $role
  ]);
}
