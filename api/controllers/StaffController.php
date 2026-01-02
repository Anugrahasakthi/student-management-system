<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../middleware.php';
require_once __DIR__ . '/../utils/Response.php';

function staffDashboard() {
    global $pdo;

    $auth = auth();
    require_staff($auth);

    $staff_id = $auth["staff_id"];

    // Count assigned courses
    $coursesStmt = $pdo->prepare("
        SELECT COUNT(*) 
        FROM staff_courses 
        WHERE staff_id = ?
    ");
    $coursesStmt->execute([$staff_id]);
    $assignedCourses = $coursesStmt->fetchColumn();

    // Count students under staff
    $studentsStmt = $pdo->prepare("
        SELECT COUNT(DISTINCT e.student_id)
        FROM enrollments e
        JOIN staff_courses sc ON sc.course_id = e.course_id
        WHERE sc.staff_id = ?
    ");
    $studentsStmt->execute([$staff_id]);
    $studentsCount = $studentsStmt->fetchColumn();

    response_json(200, "Staff dashboard stats", [
        "assigned_courses" => (int)$assignedCourses,
        "students" => (int)$studentsCount
    ]);
}


function getStaffProfile() {
    global $pdo;

    $payload = auth();
    require_staff($payload);

    $stmt = $pdo->prepare("
        SELECT 
            s.id,
            s.name,
            s.email,
            s.phone,
            s.dob
        FROM staff s
        WHERE s.user_id = ?
    ");

    $stmt->execute([$payload['id']]);
    $staff = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$staff) {
        response_json(404, "Staff profile not found");
    }

    response_json(200, "Staff profile", $staff);
}

function updateStaffProfile() {
    global $pdo;

    $payload = auth();

    if (($payload['role'] ?? '') !== 'staff') {
        response_json(403, "Access denied");
    }

    $staff_id = $payload['staff_id'] ?? null;
    if (!$staff_id) {
        response_json(400, "Staff ID missing");
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $name  = trim($data['name'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $dob   = trim($data['dob'] ?? '');

    $stmt = $pdo->prepare("
        UPDATE staff
        SET name = ?, phone = ?, dob = ?
        WHERE id = ?
    ");

    $stmt->execute([$name, $phone, $dob, $staff_id]);

    response_json(200, "Staff profile updated successfully");
}

function getStaffCourses() {
    global $pdo;

    $auth = auth();
    require_staff($auth);

    $staff_id = $auth['staff_id'];

    $stmt = $pdo->prepare("
        SELECT 
            c.id as course_id,
            c.course_name,
            c.course_description,
            c.duration,
            sc.assigned_at
        FROM staff_courses sc
        JOIN courses c ON c.id = sc.course_id
        WHERE sc.staff_id = ?
    ");

    $stmt->execute([$staff_id]);
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    response_json(200, 'Assigned courses', $courses);
}

function getCoursesWithStudents() {
    global $pdo;

    $auth = auth();
    require_staff($auth);

    $stmt = $pdo->prepare("
        SELECT
            c.id AS course_id,
            c.course_name,
            s.id AS student_id,
            s.name AS student_name,
            u.email AS student_email
        FROM staff_courses sc
        JOIN courses c ON c.id = sc.course_id
        LEFT JOIN enrollments e ON e.course_id = c.id
        LEFT JOIN students s ON s.id = e.student_id
        LEFT JOIN users u ON u.id = s.user_id
        WHERE sc.staff_id = ?
        ORDER BY c.course_name
    ");

    $stmt->execute([$auth['staff_id']]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // group students by course
    $result = [];
    foreach ($rows as $row) {
        $cid = $row['course_id'];

        if (!isset($result[$cid])) {
            $result[$cid] = [
                "course_id" => $cid,
                "course_name" => $row['course_name'],
                "students" => []
            ];
        }

        if ($row['student_id']) {
            $result[$cid]['students'][] = [
                "id" => $row['student_id'],
                "name" => $row['student_name'],
                "email" => $row['student_email']
            ];
        }
    }

    response_json(200, "Courses with students", array_values($result));
}


