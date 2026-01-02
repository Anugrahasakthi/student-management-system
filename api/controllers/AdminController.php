<?php
/* 
FILE NAME:AdminController.php
DESCRIPTION:To show some stats like number of registered students and number of available courses
*/
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../middleware.php';
require_once __DIR__ . '/../utils/Response.php';

function adminStats() {
    global $pdo;

    $auth = auth();
    require_admin($auth);
    
    $students = $pdo->query("SELECT COUNT(*) FROM students")->fetchColumn();
   
    $courses = $pdo->query("SELECT COUNT(*) FROM courses")->fetchColumn();
   
    response_json(200, "Admin dashboard stats", [
        "students" => $students,
        "courses" => $courses
     
    ]);
}

function assignCourseToStaff() {
    global $pdo;

    $auth = auth();
    require_admin($auth);

    $data = json_decode(file_get_contents("php://input"), true);

    $staff_id  = $data["staff_id"] ?? null;
    $course_id = $data["course_id"] ?? null;

    if (!$staff_id || !$course_id) {
        response_json(400, "staff_id and course_id are required");
    }

    // prevent duplicate assignment
    $check = $pdo->prepare("
        SELECT id FROM staff_courses 
        WHERE staff_id = ? AND course_id = ?
    ");
    $check->execute([$staff_id, $course_id]);

    if ($check->fetch()) {
        response_json(409, "Course already assigned to this staff");
    }

    $stmt = $pdo->prepare("
        INSERT INTO staff_courses (staff_id, course_id)
        VALUES (?, ?)
    ");
    $stmt->execute([$staff_id, $course_id]);

    response_json(200, "Course assigned to staff successfully");
}

function getAllStaff() {
    global $pdo;

    $auth = auth();
    require_admin($auth);

    $stmt = $pdo->query("
        SELECT id, name, email
        FROM staff
        ORDER BY name
    ");

    $staff = $stmt->fetchAll(PDO::FETCH_ASSOC);
    response_json(200, "Staff list", $staff);
}
function getAvailableCoursesForStaffAssignment() {
    global $pdo;

    $auth = auth();
    require_admin($auth);

    $stmt = $pdo->query("
        SELECT c.id, c.course_name
        FROM courses c
        WHERE c.id NOT IN (
            SELECT course_id FROM staff_courses
        )
        ORDER BY c.course_name
    ");

    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    response_json(200, "Available courses", $courses);
}
