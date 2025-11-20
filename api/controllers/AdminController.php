<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../middleware.php';
require_once __DIR__ . '/../utils/Response.php';

function adminStats() {
    global $pdo;

    $auth = auth();
    require_admin($auth);
    
    $students = $pdo->query("SELECT COUNT(*) FROM students")->fetchColumn();
   
    $courses = $pdo->query("SELECT COUNT(*) FROM courses")->fetchColumn();
   
    $enrollments = $pdo->query("SELECT COUNT(*) FROM enrollments")->fetchColumn();

    response_json(200, "Admin dashboard stats", [
        "students" => $students,
        "courses" => $courses,
        "enrollments" => $enrollments
    ]);
}
