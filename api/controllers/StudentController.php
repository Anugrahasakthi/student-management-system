<?php

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../middleware.php';
require_once __DIR__ . '/../utils/Response.php';

/**
 * ADMIN → show all students with courses
 */
function listStudents() {

  $auth = auth(); // verify token

  $auth = require_admin($auth);
  // if ($auth['role'] !== 'admin') {
  //   response_json(403, 'Only admin can view all students');
  // }

  global $pdo;
  $sql = "
    SELECT s.id, s.name, s.phone, s.dob, u.email,
           GROUP_CONCAT(c.course_name) AS courses
    FROM students s
    JOIN users u ON u.id = s.user_id
    LEFT JOIN enrollments e ON e.student_id = s.id
    LEFT JOIN courses c ON c.id = e.course_id
    GROUP BY s.id, s.name, s.phone, s.dob, u.email;
  ";

  $rows = $pdo->query($sql)->fetchAll();
  response_json(200, 'All students with courses', $rows);
}

/**
 * STUDENT → show own detail + courses
 */
function myStudentProfile() {

  $auth = auth(); // verify token

  $auth = require_student($auth);

    // TEMP: check what payload looks like
  // response_json(200, 'Payload test', $auth);
  // if ($auth['role'] !== 'student') {
  //   response_json(403, 'Only student can view this');
  // }

  $userId = $auth['id'];

  global $pdo;
  $sql = "
    SELECT s.id, s.name, s.phone, s.dob, u.email,
           GROUP_CONCAT(c.course_name) AS courses
    FROM students s
    JOIN users u ON u.id = s.user_id
    LEFT JOIN enrollments e ON e.student_id = s.id
    LEFT JOIN courses c ON c.id = e.course_id
    WHERE s.user_id = ?
    GROUP BY s.id, s.name, s.phone, s.dob, u.email;
  ";

  $stmt = $pdo->prepare($sql);
  $stmt->execute([$userId]);
  $row = $stmt->fetch();

  response_json(200, 'Student profile', $row);
}
