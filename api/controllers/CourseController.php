<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../middleware.php';


// GET all courses

function getAllCourses() {
  global $pdo;

  try {
    $stmt = $pdo->query("SELECT * FROM courses ORDER BY id DESC");
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    response_json(200, "Courses fetched successfully", $courses);

  } catch (Exception $e) {
    response_json(500, "Failed to fetch courses: " . $e->getMessage());
  }
}

//Get course by name

function getCourseByName($name) {
  global $pdo;

  try {

    
    $stmt = $pdo->prepare("
      SELECT * FROM courses 
      WHERE LOWER(REPLACE(course_name, ' ', '')) 
            LIKE LOWER(REPLACE(?, ' ', ''))
    ");
    
    $stmt->execute(["%$name%"]);

    $course = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($course) {
      response_json(200, "Course fetched successfully", $course);
    } else {
      response_json(404, "Course not found");
    }

  } catch (Exception $e) {
    response_json(500, "Failed to fetch course: " . $e->getMessage());
  }
}





// GET one course by id

function getCourse($id) {
  global $pdo;

  try {
    $stmt = $pdo->prepare("SELECT * FROM courses WHERE id = ?");
    $stmt->execute([$id]);

    $course = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($course) {
      response_json(200, "Course fetched successfully", $course);
    } else {
      response_json(404, "Course not found");
    }

  } catch (Exception $e) {
    response_json(500, "Error fetching course: " . $e->getMessage());
  }
}

//CREATE course.(ADMIN ONLY)

function createCourse() {
  global $pdo;

  $payload = auth();
  require_admin($payload);

  // Input
  $data = json_decode(file_get_contents("php://input"), true) ?? [];

  validate_required($data, ['course_name']);

  $name = trim($data['course_name']);
  $desc = trim($data['course_description'] ?? '');
  $duration = trim($data['duration'] ?? '');

  // Check duplicate before inserting
  try {
    $check = $pdo->prepare("SELECT id FROM courses WHERE course_name = ?");
    $check->execute([$name]);

    if ($check->rowCount() > 0) {
      response_json(409, "Course already exists");
    }
  } catch (Exception $e) {
    response_json(500, "Error checking duplicates: " . $e->getMessage());
  }

  // Insert new course
  try {
    $stmt = $pdo->prepare(
      "INSERT INTO courses (course_name, course_description, duration)
       VALUES (?, ?, ?)"
    );

    $stmt->execute([$name, $desc, $duration]);

    response_json(200, "Course created successfully");

  } catch (PDOException $e) {
    // Database-level duplicate protection
    if ($e->getCode() === "23000") {
      response_json(409, "Course already exists");
    }

    response_json(500, "Failed to create course: " . $e->getMessage());
  }
}


// UPDATE COURSE (ADMIN ONLY)
 
function updateCourse($id) {
  global $pdo;

  
  $payload = auth();
  require_admin($payload);

  $data = json_decode(file_get_contents("php://input"), true) ?? [];

  $name = trim($data['course_name'] ?? '');
  $desc = trim($data['course_description'] ?? '');
  $duration = trim($data['duration'] ?? '');

  // Prevent updating to an existing course name
  if (!empty($name)) {
    try {
      $chk = $pdo->prepare("SELECT id FROM courses WHERE course_name = ? AND id <> ?");
      $chk->execute([$name, $id]);

      if ($chk->rowCount() > 0) {
        response_json(409, "Another course with this name already exists");
      }

    } catch (Exception $e) {
      response_json(500, "Error checking duplicates during update: " . $e->getMessage());
    }
  }

  // Update course
  try {
    $stmt = $pdo->prepare(
      "UPDATE courses 
       SET course_name=?, course_description=?, duration=? 
       WHERE id=?"
    );

    $stmt->execute([$name, $desc, $duration, $id]);

    if ($stmt->rowCount() > 0) {
      response_json(200, "Course updated successfully");
    } else {
      response_json(404, "Course not found or no changes made");
    }

  } catch (Exception $e) {
    response_json(500, "Failed to update course: " . $e->getMessage());
  }
}


// DELETE course (ADMIN ONLY)

function deleteCourse($id) {
  global $pdo;

 
  $payload = auth();
  require_admin($payload);

  try {
    $stmt = $pdo->prepare("DELETE FROM courses WHERE id=?");
    $stmt->execute([$id]);

    if ($stmt->rowCount() > 0) {
      response_json(200, "Course deleted successfully");
    } else {
      response_json(404, "Course not found");
    }

  } catch (Exception $e) {
    response_json(500, "Failed to delete course: " . $e->getMessage());
  }
}
