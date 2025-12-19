<?php

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../middleware.php';
require_once __DIR__ . '/../utils/Response.php';

function listStudents() {
    $auth = auth();
    require_admin($auth);

    global $pdo;
    $sql = "
        SELECT s.id, s.name, s.phone, s.dob, u.email,
               GROUP_CONCAT(c.course_name) AS courses
        FROM students s
        JOIN users u ON u.id = s.user_id
        LEFT JOIN enrollments e ON e.student_id = s.id
        LEFT JOIN courses c ON c.id = e.course_id
        GROUP BY s.id
    ";    

    $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    response_json(200, 'Students and their details', $rows);
}

function myStudentProfile() {
  $auth = auth();
  require_student($auth);

  $student_id = $auth['student_id'] ?? null;

  global $pdo;

  $sql = "
    SELECT 
      s.id, 
      s.name, 
      s.phone, 
      s.dob, 
      s.address,
      s.education,
      s.hobbies,
      u.email,
      GROUP_CONCAT(c.course_name) AS courses
    FROM students s
    JOIN users u ON u.id = s.user_id
    LEFT JOIN enrollments e ON e.student_id = s.id
    LEFT JOIN courses c ON c.id = e.course_id
    WHERE s.id = ?
    GROUP BY s.id";

  $stmt = $pdo->prepare($sql);
  $stmt->execute([$student_id]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);

  response_json(200, "Student profile", $row);
}







function studentUpdateProfile() {
    $payload = auth();
    require_student($payload);

    global $pdo;

    $student_id = $payload['student_id'];

    $input = json_decode(file_get_contents("php://input"), true);

    $sql = "
        UPDATE students 
        SET 
            name = ?, 
            phone = ?, 
            dob = ?, 
            address = ?, 
            education = ?, 
            hobbies = ?
        WHERE id = ?
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $input["name"],
        $input["phone"],
        $input["dob"],
        $input["address"],
        $input["education"],
        $input["hobbies"],
        $student_id
    ]);

    response_json(200, "Profile updated successfully");
}

function getMyCourses($student_id) {
    global $pdo;

    $sql = "
        SELECT 
            c.id,
            c.course_name,
            c.course_description,
            c.duration,
            e.enrolled_at,
            e.end_date
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id
        WHERE e.student_id = ?
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$student_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    response_json(200, "My Courses", $rows);
}

function studentDashboardSummary() {
    $auth = auth();
    require_student($auth);
    $student_id = $auth["student_id"];
    global $pdo;

  
    $active = $pdo->prepare("SELECT COUNT(*) AS count FROM enrollments WHERE student_id = ?");
    $active->execute([$student_id]);
    $activeCount = $active->fetch(PDO::FETCH_ASSOC)['count'];

   
    $dropped = $pdo->prepare("SELECT COUNT(*) AS count FROM dropped_enrollments WHERE student_id = ?");
    $dropped->execute([$student_id]);
    $droppedCount = $dropped->fetch(PDO::FETCH_ASSOC)['count'];

  
    $total = $activeCount + $droppedCount;

    response_json(200, "Dashboard Summary", [
        "enrolled_total" => $total,
        "in_progress" => $activeCount,
        "dropped" => $droppedCount
    ]);
}





