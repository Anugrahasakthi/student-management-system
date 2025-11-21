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
    GROUP BY s.id, s.name, s.phone, s.dob, u.email
  ";

  $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
  response_json(200, 'Sudents and their details', $rows);
}




function myStudentProfile() {

  $auth = auth();
  require_student($auth);

  // student_id from JWT 
  $student_id = $auth['student_id'] ?? null;

  if (!$student_id) {
    response_json(404, 'Student profile not found (student_id missing)');
  }

  global $pdo;

  $sql = "
    SELECT s.id, s.name, s.phone, s.dob, u.email,
           GROUP_CONCAT(c.course_name) AS courses
    FROM students s
    JOIN users u ON u.id = s.user_id
    LEFT JOIN enrollments e ON e.student_id = s.id
    LEFT JOIN courses c ON c.id = e.course_id
    WHERE s.id = ?
    GROUP BY s.id, s.name, s.phone, s.dob, u.email
  ";

  $stmt = $pdo->prepare($sql);
  $stmt->execute([$student_id]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$row) {
    response_json(404, 'Student not found');
  }

  response_json(200, 'Student profile', $row);
}

