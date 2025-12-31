<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../middleware.php';
require_once __DIR__ . '/../utils/Response.php';

function staffDashboardController() {
    $payload = auth();
    require_staff($payload);

    response_json(200, "Staff dashboard", [
        "email" => $payload['email'],
        "staff_id" => $payload['staff_id'] ?? null
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
