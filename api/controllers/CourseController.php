<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../middleware.php';

// Get all courses (Public)
function getAllCourses() {
  global $pdo;
  try {
    $stmt = $pdo->query("SELECT * FROM courses ORDER BY course_id DESC");
    $courses = $stmt->fetchAll();
    Response::success($courses);
  } catch (Exception $e) {
    Response::error("Failed to fetch courses: " . $e->getMessage());
  }
}

// Get one course (Public)
function getCourse($id) {
  global $pdo;
  try {
    $stmt = $pdo->prepare("SELECT * FROM courses WHERE course_id = ?");
    $stmt->execute([$id]);
    $course = $stmt->fetch();
    if ($course) {
      Response::success($course);
    } else {
      Response::error("Course not found", 404);
    }
  } catch (Exception $e) {
    Response::error("Error: " . $e->getMessage());
  }
}

// Create a new course (Admin only)
function createCourse() {
  global $pdo;
  $payload = authenticate();
  requireAdmin($payload);

  $data = json_decode(file_get_contents("php://input"), true);
  $name = trim($data['course_name'] ?? '');
  $desc = trim($data['course_description'] ?? '');
  $duration = trim($data['duration'] ?? '');

  if (Validator::isEmpty($name)) {
    Response::error("Course name is required");
    return;
  }

  try {
    $stmt = $pdo->prepare("INSERT INTO courses (course_name, course_description, duration) VALUES (?, ?, ?)");
    $stmt->execute([$name, $desc, $duration]);
    Response::success(["message" => "Course created successfully"]);
  } catch (Exception $e) {
    Response::error("Failed to create course: " . $e->getMessage());
  }
}

// Update course (Admin only)
function updateCourse($id) {
  global $pdo;
  $payload = authenticate();
  requireAdmin($payload);

  $data = json_decode(file_get_contents("php://input"), true);
  $name = trim($data['course_name'] ?? '');
  $desc = trim($data['course_description'] ?? '');
  $duration = trim($data['duration'] ?? '');

  try {
    $stmt = $pdo->prepare("UPDATE courses SET course_name=?, course_description=?, duration=? WHERE course_id=?");
    $stmt->execute([$name, $desc, $duration, $id]);

    if ($stmt->rowCount() > 0) {
      Response::success(["message" => "Course updated successfully"]);
    } else {
      Response::error("Course not found or no changes made", 404);
    }
  } catch (Exception $e) {
    Response::error("Failed to update course: " . $e->getMessage());
  }
}

// Delete course (Admin only)
function deleteCourse($id) {
  global $pdo;
  $payload = authenticate();
  requireAdmin($payload);

  try {
    $stmt = $pdo->prepare("DELETE FROM courses WHERE course_id = ?");
    $stmt->execute([$id]);
    if ($stmt->rowCount() > 0) {
      Response::success(["message" => "Course deleted successfully"]);
    } else {
      Response::error("Course not found", 404);
    }
  } catch (Exception $e) {
    Response::error("Failed to delete course: " . $e->getMessage());
  }
}
