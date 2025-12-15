<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../middleware.php';
require_once __DIR__ . '/../utils/Response.php';


function enrollStudent() {
    global $pdo;

    $payload = auth();
    $data = json_decode(file_get_contents("php://input"), true);

    $course_id = $data['course_id'] ?? null;
    if (!$course_id) response_json(400, "course_id is required");

    // Determine student_id
    $student_id = ($payload['role'] === 'student')
        ? $payload['student_id']
        : ($data['student_id'] ?? null);

    if (!$student_id) response_json(400, "student_id is required");

    // Check student presence
    $chkStu = $pdo->prepare("SELECT id FROM students WHERE id = ?");
    $chkStu->execute([$student_id]);
    if (!$chkStu->fetch()) response_json(404, "Student not found");

    // Check course presence
    $chkCourse = $pdo->prepare("SELECT duration FROM courses WHERE id = ?");
    $chkCourse->execute([$course_id]);
    $courseRow = $chkCourse->fetch(PDO::FETCH_ASSOC);
    if (!$courseRow) response_json(404, "Course not found");

    preg_match('/(\d+)/', $courseRow['duration'], $m);
    $months = intval($m[1]);
    $days = $months * 30;

    // Check duplicate
    $chk = $pdo->prepare("SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?");
    $chk->execute([$student_id, $course_id]);
    if ($chk->fetch()) response_json(409, "Already enrolled");

    $start = date("Y-m-d");
    $end = date("Y-m-d", strtotime("+$days days"));

    $stmt = $pdo->prepare("
        INSERT INTO enrollments (student_id, course_id, enrolled_at, end_date)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$student_id, $course_id, $start, $end]);

    response_json(200, "Enrollment successful");
}

function getAllEnrollments() {
    global $pdo;

    $payload = auth();
    require_admin($payload);

    $sql = "
        SELECT 
            e.id,
            s.id AS student_id,
            s.name AS student_name,
            u.email AS student_email,
            c.course_name,
            c.duration,
            e.enrolled_at,
            e.end_date,
            DATEDIFF(e.end_date, CURDATE()) AS days_left
        FROM enrollments e
        JOIN students s ON s.id = e.student_id
        JOIN users u ON u.id = s.user_id
        JOIN courses c ON c.id = e.course_id
        ORDER BY e.enrolled_at DESC
    ";

    $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rows as &$row) {
        if ($row["days_left"] < 0) {
            $row["days_left"] = "Expired";
        }
    }

    response_json(200, "All enrollments", $rows);
}


function deleteEnrollment($id) {
    global $pdo;

    $payload = auth();

    // Fetch enrollment row
    $stmt = $pdo->prepare("SELECT * FROM enrollments WHERE id = ?");
    $stmt->execute([$id]);
    $enrollment = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$enrollment) response_json(404, "Enrollment not found");

    // Proper DELETE JSON reading
    $raw = file_get_contents("php://input");
    $body = json_decode($raw, true);
    

    $reason = $body["reason"] ?? "No reason provided";
    $dropped_by = ($payload["role"] === "admin") ? "admin" : "student";

    // Insert record
    $insert = $pdo->prepare("
        INSERT INTO dropped_enrollments
        (enrollment_id, student_id, course_id, dropped_by, reason, dropped_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    $insert->execute([
        $enrollment["id"],
        $enrollment["student_id"],
        $enrollment["course_id"],
        $dropped_by,
        $reason
    ]);

    // Delete original enrollment
    $del = $pdo->prepare("DELETE FROM enrollments WHERE id = ?");
    $del->execute([$id]);

    response_json(200, "Enrollment removed successfully");
}


function getDroppedEnrollments() {
    global $pdo;

    $payload = auth();
    require_admin($payload);

    $sql = "
        SELECT 
            d.*, 
            s.name AS student_name, 
            c.course_name
        FROM dropped_enrollments d
        LEFT JOIN students s ON s.id = d.student_id
        LEFT JOIN courses c ON c.id = d.course_id
        ORDER BY d.id DESC
    ";

    $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    response_json(200, "Dropped enrollments", $rows);
}
