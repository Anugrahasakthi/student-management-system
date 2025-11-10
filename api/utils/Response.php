<?php
function response_json(int $status, string $message, array $data = null): void {
  http_response_code($status);
  header('Content-Type: application/json');

  $out = [
    'status' => $status,
    'message' => $message,
  ];

  if ($data !== null) {
    $out['data'] = $data;
  }

  echo json_encode($out);
  exit;
}
