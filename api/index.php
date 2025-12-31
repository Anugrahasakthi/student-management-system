<?php
// error_reporting(0);
// ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/cors.php';
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
require_once __DIR__ . '/controllers/StaffController.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptDir = dirname($_SERVER['SCRIPT_NAME']);
$normalized = str_replace($scriptDir, '', $uri);


if ($normalized === '') $normalized = '/';

if ($method === 'POST' && $normalized === '/login') return loginController();
if ($method === 'POST' && $normalized === '/register') return registerController();


if ($method === 'GET' && $normalized === '/me/student') return myStudentProfile();
if ($method === 'PUT' && $normalized === '/student/update-profile') return studentUpdateProfile();
if ($method === 'GET' && $normalized === '/student/dashboard-summary') return studentDashboardSummary();
if ($method === 'GET' && $normalized === '/me/courses') {
    $auth = auth();
    return getMyCourses($auth['student_id']);
}



if ($method === 'GET' && $normalized === '/courses') return getAllCourses();

if ($method === 'POST' && $normalized === '/courses') return createCourse();

if ($method === 'PUT' && preg_match('#^/courses/([0-9]+)$#', $normalized, $m)) {
    return updateCourse((int)$m[1]);
}

if ($method === 'DELETE' && preg_match('#^/courses/([0-9]+)$#', $normalized, $m)) {
    return deleteCourse((int)$m[1]);
}



if ($method === 'POST' && $normalized === '/enroll') return enrollStudent();

if ($method === 'DELETE' && preg_match('#^/enroll/([0-9]+)$#', $normalized, $m)) {
    return deleteEnrollment((int)$m[1]);
}

if ($method === 'GET' && $normalized === '/enrollments') return getAllEnrollments();
if ($method === 'GET' && $normalized === '/dropped-enrollments') return getDroppedEnrollments();



if ($method === 'GET' && $normalized === '/students') return listStudents();
if ($method === 'GET' && $normalized === '/admin/stats') return adminStats();


if ($method === 'GET' && $normalized === '/staff/dashboard') {
    return staffDashboardController();
}
if ($method === 'GET' && $normalized === '/me/staff') {
    return getStaffProfile();
}
if ($method === 'PUT' && $normalized === '/staff/update-profile') {
    return updateStaffProfile();
}





response_json(404, "Route not found: $normalized");