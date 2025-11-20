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

    
    if ($payload['role'] === 'student') {
        $student_id = $payload['student_id'];
    } else {
        $student_id = $data['student_id'] ?? null;
    }

    if (!$student_id) {
        response_json(400, "student_id is required");
    }

    
    $chkStu = $pdo->prepare("SELECT id FROM students WHERE id = ?");
    $chkStu->execute([$student_id]);
    if ($chkStu->rowCount() === 0) {
        response_json(404, "Student not found");
    }

    
    $chkCourse = $pdo->prepare("SELECT duration FROM courses WHERE id = ?");
    $chkCourse->execute([$course_id]);
    $courseRow = $chkCourse->fetch(PDO::FETCH_ASSOC);

    if (!$courseRow) {
        response_json(404, "Course not found");
    }

   
    preg_match('/(\d+)/', $courseRow['duration'], $match);
    $months = intval($match[1]);
    $days = $months * 30;

   
    $chk = $pdo->prepare("SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?");
    $chk->execute([$student_id, $course_id]);
    if ($chk->rowCount() > 0) {
        response_json(409, "Already enrolled");
    }

    
    $startDate = date("Y-m-d");
    $endDate = date("Y-m-d", strtotime("+$days days"));

   
    $stmt = $pdo->prepare("
        INSERT INTO enrollments (student_id, course_id, enrolled_at, end_date)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$student_id, $course_id, $startDate, $endDate]);

    response_json(200, "Enrollment successful", [
        "start_date" => $startDate,
        "end_date"   => $endDate,
        "duration_days" => $days
    ]);
}



function getAllEnrollments() {
    global $pdo;

    $auth = auth();
    require_admin($auth);

    $sql = "
        SELECT 
            e.id AS enrollment_id,
            s.name AS student_name,
            u.email AS student_email,
            c.course_name,
            c.duration,
            e.enrolled_at,
            e.end_date
        FROM enrollments e
        JOIN students s ON s.id = e.student_id
        JOIN users u ON u.id = s.user_id
        JOIN courses c ON c.id = e.course_id
        ORDER BY e.enrolled_at DESC
    ";

    $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    
    foreach ($rows as &$row) {
        $today = new DateTime();
        $end = new DateTime($row['end_date']);

        $daysLeft = $today->diff($end)->format("%r%a");

        $row['days_left'] = $daysLeft;
    }

    response_json(200, "All enrollments", $rows);
}


function getStudentCourses($student_id) {
    global $pdo;
    $payload = auth();

    if ($payload['role'] === 'student' && $payload['student_id'] != $student_id) {
        response_json(403, "Students can view only their own courses");
    }

    $stmt = $pdo->prepare("
        SELECT c.*, e.enrolled_at, e.end_date
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.student_id = ?
    ");
    $stmt->execute([$student_id]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    response_json(200, "Courses loaded", $data);
}
