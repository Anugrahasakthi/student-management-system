<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/utils/Jwt.php';
require_once __DIR__ . '/middleware.php';
require_once __DIR__ . '/controllers/LoginController.php';
require_once __DIR__ . '/controllers/RegisterController.php';
require_once __DIR__ . '/controllers/StudentController.php';
require_once __DIR__ . '/controllers/CourseController.php';
require_once __DIR__ . '/controllers/EnrollmentController.php';
require_once __DIR__ . '/controllers/AdminController.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Normalize URI
$scriptDir = dirname($_SERVER['SCRIPT_NAME']);
$normalized = str_replace($scriptDir, '', $uri);
if ($normalized === '' || $normalized === false) $normalized = '/';

$errorLog = "DEBUG => METHOD: $method | URI: $normalized";
error_log($errorLog);


// ----------------------- ROUTES ----------------------------

// LOGIN
if ($method === 'POST' && $normalized === '/login') return loginController();

// REGISTER
if ($method === 'POST' && $normalized === '/register') return registerController();

// ADMIN → List all students
if ($method === 'GET' && $normalized === '/students') return listStudents();

// STUDENT → Own profile
if ($method === 'GET' && $normalized === '/me/student') return myStudentProfile();

// STUDENT → My courses
if ($method === 'GET' && $normalized === '/me/courses') {
    $auth = auth();
    return getMyCourses($auth['student_id']);
}

// Get all courses
if ($method === 'GET' && $normalized === '/courses') return getAllCourses();


// Get course by name
if ($method === 'GET' && preg_match('#^/courses/name/(.+)$#', $normalized, $m)) {
    return getCourseByName($m[1]);
}

// Get course by ID
if ($method === 'GET' && preg_match('#^/courses/([0-9]+)$#', $normalized, $m)) {
    return getCourse((int)$m[1]);
}


// CREATE course
if ($method === 'POST' && $normalized === '/courses') return createCourse();

// UPDATE course
if ($method === 'PUT' && preg_match('#^/courses/([0-9]+)$#', $normalized, $m)) {
    return updateCourse((int)$m[1]);
}

// DELETE course
if ($method === 'DELETE' && preg_match('#^/courses/([0-9]+)$#', $normalized, $m)) {
    return deleteCourse((int)$m[1]);
}


// ENROLL STUDENT
if ($method === 'POST' && $normalized === '/enroll') return enrollStudent();


// GET STUDENTS OF A COURSE
if ($method === 'GET' && preg_match('#^/course/([0-9]+)/students$#', $normalized, $m)) {
    return getCourseStudents((int)$m[1]);
}


// DELETE ENROLLMENT
if ($method === 'DELETE' && preg_match('#^/enroll/([0-9]+)$#', $normalized, $m)) {
    return deleteEnrollment((int)$m[1]);
}


// ADMIN → All enrollments
if ($method === 'GET' && $normalized === '/enrollments') return getAllEnrollments();

// ADMIN → Dropped enrollments
if ($method === 'GET' && $normalized === '/dropped-enrollments') return getDroppedEnrollments();

// ADMIN → Dashboard stats
if ($method === 'GET' && $normalized === '/admin/stats') return adminStats();


// 404 fallback
response_json(404, "Route not found: $normalized");

