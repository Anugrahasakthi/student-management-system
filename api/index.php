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

// Dynamically detect project path
$scriptDir = dirname($_SERVER['SCRIPT_NAME']);
$normalized = str_replace($scriptDir, '', $uri);
if ($normalized === '' || $normalized === false) {
    $normalized = '/';
}

// Debug (optional)
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

// ================= COURSE ROUTES =================

// GET all courses
if ($method === 'GET' && $normalized === '/courses') {
    $user = auth();
    getAllCourses();
    exit;
}

// Decode URL once (CRITICAL FIX)
$decoded = rawurldecode($normalized);

// GET course by name (MUST come before ID route)
if ($method === 'GET' && preg_match('#^/courses/name/(.+)$#u', $decoded, $matches)) {
    $payload = auth();
    getCourseByName($matches[1]);
    exit;
}

// GET course by ID (match ONLY numbers)
if ($method === 'GET' && preg_match('#^/courses/([0-9]+)$#', $decoded, $matches)) {
    $user = auth();
    getCourse((int)$matches[1]);
    exit;
}

// CREATE course
if ($method === 'POST' && $normalized === '/courses') {
    $user = auth();
    createCourse();
    exit;
}

// UPDATE course
if ($method === 'PUT' && preg_match('#^/courses/([0-9]+)$#', $decoded, $matches)) {
    $user = auth();
    updateCourse((int)$matches[1]);
    exit;
}

// DELETE course
if ($method === 'DELETE' && preg_match('#^/courses/([0-9]+)$#', $decoded, $matches)) {
    $user = auth();
    deleteCourse((int)$matches[1]);
    exit;
}

// ================= DEFAULT: 404 =================
response_json(404, 'Route not found: ' . $normalized);
