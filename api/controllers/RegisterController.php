<?php

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../utils/Response.php';

function registerController() {

  $data = json_decode(file_get_contents("php://input"), true);
  // $data = $_POST;

  $email    = trim($data['email'] ?? '');
  $password = $data['password'] ?? '';
  $role     = strtolower($data['role'] ?? 'student'); 

  if ($email === '' || $password === '') {
    response_json(400, 'Email & Password required');
  }

  if (!in_array($role, ['admin','student'])) {
    response_json(400, 'Role must be admin or student only');
  }

  $hash = password_hash($password, PASSWORD_BCRYPT);

  global $pdo;

 
  $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
  $stmt->execute([$email]);
  if ($stmt->fetch()) {
    response_json(200, 'Email already registered');
  }

 
  $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)");
  $stmt->execute([$email, $hash, $role]);

  response_json(200, "User registered successfully", ["email"=>$email,"role"=>$role]);
}
