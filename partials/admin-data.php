<?php

function loadAdminSupabaseConfig(){
    $config = loadSupabaseConfig();
    $config['service_role_key'] = getenv('SUPABASE_SERVICE_ROLE_KEY') ?: '';
    $config['storage_bucket'] = getenv('SUPABASE_STORAGE_BUCKET') ?: 'media';

    $localConfigPath = dirname(__DIR__) . '/supabase-config.php';
    if (is_file($localConfigPath)) {
        $localConfig = require $localConfigPath;
        if (is_array($localConfig)) {
            if (!empty($localConfig['service_role_key'])) {
                $config['service_role_key'] = $localConfig['service_role_key'];
            }

            if (!empty($localConfig['storage_bucket'])) {
                $config['storage_bucket'] = (string)$localConfig['storage_bucket'];
            }
        }
    }

    $config['admin_enabled'] = $config['url'] !== '' && $config['service_role_key'] !== '';
    return $config;
}

function adminSupabaseRequest($method, $path, $payload = null){
    $config = loadAdminSupabaseConfig();
    if (!$config['admin_enabled']) {
        return array('ok' => false, 'status' => 0, 'body' => 'Supabase admin config missing', 'data' => null);
    }

    $ch = curl_init($config['url'] . $path);
    if ($ch === false) {
        return array('ok' => false, 'status' => 0, 'body' => 'Unable to init cURL', 'data' => null);
    }

    $headers = array(
        'apikey: ' . $config['service_role_key'],
        'Authorization: Bearer ' . $config['service_role_key'],
        'Content-Type: application/json'
    );

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);

    if ($payload !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    }

    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($body === false) {
        return array('ok' => false, 'status' => $status, 'body' => curl_error($ch), 'data' => null);
    }

    $decoded = json_decode($body, true);
    return array('ok' => $status >= 200 && $status < 300, 'status' => $status, 'body' => $body, 'data' => $decoded);
}

function adminFetchRows($path){
    $response = adminSupabaseRequest('GET', $path);
    if (!$response['ok'] || !is_array($response['data'])) {
        return array();
    }

    return $response['data'];
}

function adminPatchById($table, $id, $payload){
    $table = rawurlencode($table);
    $path = '/rest/v1/' . $table . '?id=eq.' . urlencode((string)$id);
    return adminSupabaseRequest('PATCH', $path, $payload);
}

function adminDeleteById($table, $id){
    $table = rawurlencode($table);
    $path = '/rest/v1/' . $table . '?id=eq.' . urlencode((string)$id);
    return adminSupabaseRequest('DELETE', $path);
}

function adminInsertRow($table, $payload){
    $table = rawurlencode($table);
    $path = '/rest/v1/' . $table;
    return adminSupabaseRequest('POST', $path, $payload);
}

function adminUpsertSiteSetting($settingKey, $settingValue){
    $settingKey = trim((string)$settingKey);
    if ($settingKey === '') {
        return array('ok' => false, 'message' => 'Missing setting key.');
    }

    $existingRows = adminFetchRows('/rest/v1/site_settings?select=id,setting_key&setting_key=eq.' . rawurlencode($settingKey) . '&limit=1');
    $payload = array(
        'setting_key' => $settingKey,
        'setting_value' => (string)$settingValue
    );

    if (!empty($existingRows) && isset($existingRows[0]['id'])) {
        $response = adminPatchById('site_settings', (int)$existingRows[0]['id'], $payload);
        return array('ok' => (bool)$response['ok'], 'message' => $response['ok'] ? 'Setting updated.' : (string)$response['body']);
    }

    $response = adminInsertRow('site_settings', $payload);
    return array('ok' => (bool)$response['ok'], 'message' => $response['ok'] ? 'Setting created.' : (string)$response['body']);
}

function adminStorageBucketName(){
    $config = loadAdminSupabaseConfig();
    return trim((string)($config['storage_bucket'] ?? 'media')) ?: 'media';
}

function adminStorageRequest($method, $path, $payload = null, $contentType = null, $extraHeaders = array()){
    $config = loadAdminSupabaseConfig();
    if (!$config['admin_enabled']) {
        return array('ok' => false, 'status' => 0, 'body' => 'Supabase admin config missing', 'data' => null);
    }

    $ch = curl_init($config['url'] . $path);
    if ($ch === false) {
        return array('ok' => false, 'status' => 0, 'body' => 'Unable to init cURL', 'data' => null);
    }

    $headers = array(
        'apikey: ' . $config['service_role_key'],
        'Authorization: Bearer ' . $config['service_role_key']
    );

    if ($contentType !== null) {
        $headers[] = 'Content-Type: ' . $contentType;
    }

    foreach ($extraHeaders as $header) {
        $headers[] = $header;
    }

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 45);

    if ($payload !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    }

    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($body === false) {
        return array('ok' => false, 'status' => $status, 'body' => curl_error($ch), 'data' => null);
    }

    $decoded = json_decode($body, true);
    return array('ok' => $status >= 200 && $status < 300, 'status' => $status, 'body' => $body, 'data' => $decoded);
}

function adminEnsureStorageBucket(){
    $bucket = adminStorageBucketName();
    $payload = json_encode(array(
        'id' => $bucket,
        'name' => $bucket,
        'public' => true,
        'file_size_limit' => 15728640
    ));

    $response = adminStorageRequest('POST', '/storage/v1/bucket', $payload, 'application/json');
    if ($response['ok']) {
        return array('ok' => true, 'message' => 'Bucket ready');
    }

    if (in_array($response['status'], array(400, 409), true) && stripos((string)$response['body'], 'already') !== false) {
        return array('ok' => true, 'message' => 'Bucket already exists');
    }

    return array('ok' => false, 'message' => 'Unable to create storage bucket: ' . $response['body']);
}

function adminPublicStorageUrl($bucket, $path){
    $config = loadAdminSupabaseConfig();
    $segments = array_map('rawurlencode', explode('/', trim($path, '/')));
    return rtrim((string)$config['url'], '/') . '/storage/v1/object/public/' . rawurlencode($bucket) . '/' . implode('/', $segments);
}

function adminFileExtensionFromMime($mimeType, $originalName){
    $map = array(
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif',
        'audio/mpeg' => 'mp3',
        'audio/mp3' => 'mp3'
    );

    if (isset($map[$mimeType])) {
        return $map[$mimeType];
    }

    $extension = strtolower(pathinfo((string)$originalName, PATHINFO_EXTENSION));
    if ($extension !== '') {
        return preg_replace('/[^a-z0-9]+/', '', $extension);
    }

    return 'bin';
}

function adminUploadMediaFile($fieldName, $folder, $baseName, $kind){
    if (!isset($_FILES[$fieldName]) || !is_array($_FILES[$fieldName])) {
        return array('ok' => true, 'uploaded' => false, 'url' => '');
    }

    $file = $_FILES[$fieldName];
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return array('ok' => true, 'uploaded' => false, 'url' => '');
    }

    if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
        $errorCode = (int)($file['error'] ?? UPLOAD_ERR_OK);
        $message = 'Upload failed for ' . $fieldName . '.';

        if ($errorCode === UPLOAD_ERR_INI_SIZE || $errorCode === UPLOAD_ERR_FORM_SIZE) {
            $message = 'Uploaded file is too large for current PHP limits. Increase upload_max_filesize and post_max_size.';
        } elseif ($errorCode === UPLOAD_ERR_PARTIAL) {
            $message = 'Uploaded file was only partially received for ' . $fieldName . '.';
        }

        return array('ok' => false, 'uploaded' => false, 'url' => '', 'message' => $message);
    }

    $tmpName = (string)($file['tmp_name'] ?? '');
    if ($tmpName === '' || !is_uploaded_file($tmpName)) {
        return array('ok' => false, 'uploaded' => false, 'url' => '', 'message' => 'Invalid uploaded file for ' . $fieldName . '.');
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = $finfo ? (string)finfo_file($finfo, $tmpName) : '';
    if ($finfo) {
        finfo_close($finfo);
    }

    if ($kind === 'image') {
        $allowedTypes = array('image/jpeg', 'image/png', 'image/webp', 'image/gif');
        $maxBytes = 6 * 1024 * 1024;
    } else {
        $allowedTypes = array('audio/mpeg', 'audio/mp3');
        $maxBytes = 15 * 1024 * 1024;
    }

    $sizeBytes = (int)($file['size'] ?? 0);
    if ($sizeBytes <= 0 || $sizeBytes > $maxBytes) {
        return array('ok' => false, 'uploaded' => false, 'url' => '', 'message' => 'File too large for ' . $fieldName . '.');
    }

    if (!in_array($mimeType, $allowedTypes, true)) {
        return array('ok' => false, 'uploaded' => false, 'url' => '', 'message' => 'Unsupported file type for ' . $fieldName . ': ' . $mimeType);
    }

    $bucketResult = adminEnsureStorageBucket();
    if (!$bucketResult['ok']) {
        return array('ok' => false, 'uploaded' => false, 'url' => '', 'message' => $bucketResult['message']);
    }

    $safeFolder = trim(adminSlugify($folder), '-');
    $safeBaseName = trim(adminSlugify($baseName), '-');
    if ($safeBaseName === '') {
        $safeBaseName = $kind === 'image' ? 'media-image' : 'media-audio';
    }

    $extension = adminFileExtensionFromMime($mimeType, (string)($file['name'] ?? ''));
    $objectPath = $safeFolder . '/' . $safeBaseName . '-' . gmdate('YmdHis') . '-' . substr(bin2hex(random_bytes(4)), 0, 8) . '.' . $extension;
    $binary = file_get_contents($tmpName);

    if ($binary === false) {
        return array('ok' => false, 'uploaded' => false, 'url' => '', 'message' => 'Unable to read uploaded file for ' . $fieldName . '.');
    }

    $bucket = adminStorageBucketName();
    $uploadPath = '/storage/v1/object/' . rawurlencode($bucket) . '/' . implode('/', array_map('rawurlencode', explode('/', $objectPath)));
    $response = adminStorageRequest('POST', $uploadPath, $binary, $mimeType, array('x-upsert: true'));

    if (!$response['ok']) {
        return array('ok' => false, 'uploaded' => false, 'url' => '', 'message' => 'Storage upload failed for ' . $fieldName . ': ' . $response['body']);
    }

    return array(
        'ok' => true,
        'uploaded' => true,
        'url' => adminPublicStorageUrl($bucket, $objectPath),
        'message' => 'Upload complete'
    );
}

function adminSlugify($value){
    $value = strtolower(trim((string)$value));
    $value = preg_replace('/[^a-z0-9]+/', '-', $value);
    return trim($value, '-');
}

function adminLoadConfig(){
    $configPath = __DIR__ . '/../admin-config.php';
    if (!is_file($configPath)) {
        return array();
    }

    $config = require $configPath;
    if (!is_array($config)) {
        return array();
    }

    return $config;
}

function adminLoadConfigUsers(){
    $config = adminLoadConfig();
    if (empty($config)) {
        return array();
    }

    if (!isset($config['users']) || !is_array($config['users'])) {
        return array();
    }

    return $config['users'];
}

function adminSessionTimeoutMinutes(){
    $config = adminLoadConfig();
    $minutes = isset($config['session_timeout_minutes']) ? (int)$config['session_timeout_minutes'] : 30;

    if ($minutes < 5) {
        $minutes = 5;
    }
    if ($minutes > 720) {
        $minutes = 720;
    }

    return $minutes;
}

function adminAuthenticate($username, $password){
    $users = adminLoadConfigUsers();
    foreach ($users as $user) {
        if (!isset($user['username'], $user['password_hash'])) {
            continue;
        }

        if (hash_equals((string)$user['username'], (string)$username) && password_verify((string)$password, (string)$user['password_hash'])) {
            return array(
                'username' => (string)$user['username'],
                'display_name' => isset($user['display_name']) ? (string)$user['display_name'] : (string)$user['username']
            );
        }
    }

    return null;
}
