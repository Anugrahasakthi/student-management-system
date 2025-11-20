<?php

// ================== CORS ==================
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");

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
require_once __DIR__ . '/controllers/EnrollmentController.php';
require_once __DIR__ . '/controllers/AdminController.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Detect project base folder
$scriptDir = dirname($_SERVER['SCRIPT_NAME']);
$normalized = str_replace($scriptDir, '', $uri);
if ($normalized === '' || $normalized === false) {
    $normalized = '/';
}

error_log("DEBUG ROUTE => method=$method, normalized=$normalized");


// ================== AUTH ROUTES ==================

if ($method === 'POST' && $normalized === '/login') {
  loginController();
  exit;
}

if ($method === 'POST' && $normalized === '/register') {
  registerController();
  exit;
}


// ================== STUDENT ROUTES ==================

// ADMIN → View all students
if ($method === 'GET' && $normalized === '/students') {
  listStudents();
  exit;
}

// STUDENT → View own profile
if ($method === 'GET' && $normalized === '/me/student') {
  myStudentProfile();
  exit;
}


// ================== COURSE ROUTES ==================

if ($method === 'GET' && $normalized === '/courses') {
    $user = auth();
    getAllCourses();
    exit;
}

$decoded = rawurldecode($normalized);

// Search by name
if ($method === 'GET' && preg_match('#^/courses/name/(.+)$#u', $decoded, $matches)) {
    $payload = auth();
    getCourseByName($matches[1]);
    exit;
}

// Course by ID
if ($method === 'GET' && preg_match('#^/courses/([0-9]+)$#', $decoded, $matches)) {
    $user = auth();
    getCourse((int)$matches[1]);
    exit;
}

if ($method === 'POST' && $normalized === '/courses') {
    $user = auth();
    createCourse();
    exit;
}

if ($method === 'PUT' && preg_match('#^/courses/([0-9]+)$#', $decoded, $matches)) {
    $user = auth();
    updateCourse((int)$matches[1]);
    exit;
}

if ($method === 'DELETE' && preg_match('#^/courses/([0-9]+)$#', $decoded, $matches)) {
    $user = auth();
    deleteCourse((int)$matches[1]);
    exit;
}


// ================== ENROLLMENT ROUTES ==================

// Student/Admin → Enroll student
if ($method === 'POST' && $normalized === '/enroll') {
    enrollStudent();
    exit;
}

// Student → own courses
if ($method === 'GET' && preg_match('#^/student/([0-9]+)/courses$#', $normalized, $m)) {
    getStudentCourses((int)$m[1]);
    exit;
}

// Admin → all students in a course
if ($method === 'GET' && preg_match('#^/course/([0-9]+)/students$#', $normalized, $m)) {
    getCourseStudents((int)$m[1]);
    exit;
}

// Admin → delete enrollment
if ($method === 'DELETE' && preg_match('#^/enroll/([0-9]+)$#', $normalized, $m)) {
    deleteEnrollment((int)$m[1]);
    exit;
}


// ================== NEW ADMIN ENROLLMENT ROUTES ==================

// Admin → list all enrollments (FULL TABLE FOR ADMIN PAGE)
if ($method === 'GET' && $normalized === '/admin/enrollments') {
    adminListEnrollments();
    exit;
}

// Admin → remove enrollment WITH REASON
if ($method === 'POST' && $normalized === '/admin/enroll/remove') {
    adminRemoveEnrollment();
    exit;
}


// ================== ADMIN DASHBOARD ==================
if ($method === 'GET' && $normalized === '/admin/stats') {
    adminStats();
    exit;
}


// ================== DEFAULT ==================
response_json(404, 'Route not found: ' . $normalized);

