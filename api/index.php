<?php
// sms/api/index.php

// ================== CORS FIX ==================
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");

// Stop preflight OPTIONS request from being blocked
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}
// ================== END CORS ==================

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/utils/Jwt.php';
require_once __DIR__ . '/middleware.php';

// Controllers
require_once __DIR__ . '/controllers/LoginController.php';
require_once __DIR__ . '/controllers/RegisterController.php';
require_once __DIR__ . '/controllers/StudentController.php';
require_once __DIR__ . '/controllers/CourseController.php';

// =================== ROUTER ===================
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// ✅ Dynamically detect project path (works in any folder)
$scriptDir = dirname($_SERVER['SCRIPT_NAME']);
$normalized = str_replace($scriptDir, '', $uri);
if ($normalized === '' || $normalized === false) $normalized = '/';

// Debug line (optional)
error_log("DEBUG ROUTE => method=$method, normalized=$normalized");

// =================== ROUTES ===================

// LOGIN
if ($method === 'POST' && $normalized === '/login') {
  loginController();
  exit;
}

// REGISTER
if ($method === 'POST' && $normalized === '/register') {
  registerController();
  exit;
}

// ================= STUDENT ROUTES =================

// ADMIN → all students
if ($method === 'GET' && $normalized === '/students') {
  listStudents();
  exit;
}

// STUDENT → own profile
if ($method === 'GET' && $normalized === '/me/student') {
  myStudentProfile();
  exit;
}

// ================= COURSE ROUTES (optional) =================

// Example: GET all courses
if ($method === 'GET' && $normalized === '/courses') {
  $user = auth(); // verify token
  getAllCourses();
  exit;
}

// Example: GET single course
if (preg_match('#^/course/(\d+)$#', $normalized, $matches) && $method === 'GET') {
  $user = auth();
  getCourse((int)$matches[1]);
  exit;
}

// ================= DEFAULT: Route not found =================
response_json(404, 'Route not found: ' . $normalized);
