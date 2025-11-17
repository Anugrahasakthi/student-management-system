<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../middleware.php';
require_once __DIR__ . '/../utils/Response.php';

function enrollStudent() {
    global $pdo;

    $payload = auth();
    $data = json_decode(file_get_contents("php://input"), true);

    $course_id = $data['course_id'] ?? null;

    if (!$course_id) {
        response_json(400, "course_id is required");
    }

    // Student enrollment FIX
    if ($payload['role'] === 'student') {
        $student_id = $payload['student_id'];
    } else {
        $student_id = $data['student_id'] ?? null;
    }

    if (!$student_id) {
        response_json(400, "student_id missing");
    }

    // Check student exists
    $chkStu = $pdo->prepare("SELECT id FROM students WHERE id = ?");
    $chkStu->execute([$student_id]);
    if ($chkStu->rowCount() === 0) {
        response_json(404, "Student not found");
    }

    // Check course exists
    $chkCourse = $pdo->prepare("SELECT id FROM courses WHERE id = ?");
    $chkCourse->execute([$course_id]);
    if ($chkCourse->rowCount() === 0) {
        response_json(404, "Course not found");
    }

    // Check duplicate
    $chk = $pdo->prepare("SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?");
    $chk->execute([$student_id, $course_id]);
    if ($chk->rowCount() > 0) {
        response_json(409, "Already enrolled");
    }

    // Insert
    $stmt = $pdo->prepare("INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)");
    $stmt->execute([$student_id, $course_id]);

    response_json(200, "Enrollment successful");
}

function getStudentCourses($student_id) {
    global $pdo;

    $payload = auth();

    if ($payload['role'] === 'student' && $payload['student_id'] != $student_id) {
        response_json(403, "Students can view only their own courses");
    }

    $stmt = $pdo->prepare("
        SELECT c.*
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.student_id = ?
    ");
    $stmt->execute([$student_id]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    response_json(200, "Courses loaded", $data);
}
