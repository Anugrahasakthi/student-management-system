<?php

function is_empty($value): bool {
    return (!isset($value) || trim((string)$value) === '');
}


function validate_required(array $data, array $fields): void {
    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim((string)$data[$field]) === '') {
            Response::error("Field '$field' is required", 422);
            
        }
    }
}
