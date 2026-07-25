<?php

function loadSupabaseConfig(){
    $config = array(
        'url' => rtrim(getenv('SUPABASE_URL') ?: '', '/'),
        'anon_key' => getenv('SUPABASE_ANON_KEY') ?: ''
    );

    $localConfigPath = dirname(__DIR__) . '/supabase-config.php';
    if (is_file($localConfigPath)) {
        $localConfig = require $localConfigPath;
        if (is_array($localConfig)) {
            foreach ($localConfig as $key => $value) {
                if ($value !== '' && $value !== null) {
                    $config[$key] = $value;
                }
            }
        }
    }

    $config['enabled'] = $config['url'] !== '' && $config['anon_key'] !== '';
    return $config;
}

function supabaseRequest($method, $path, $payload = null){
    $config = loadSupabaseConfig();
    if (!$config['enabled']) {
        return array('ok' => false, 'status' => 0, 'body' => 'Supabase config missing', 'data' => null);
    }

    $ch = curl_init($config['url'] . $path);
    if ($ch === false) {
        return array('ok' => false, 'status' => 0, 'body' => 'Unable to init cURL', 'data' => null);
    }

    $headers = array(
        'apikey: ' . $config['anon_key'],
        'Authorization: Bearer ' . $config['anon_key'],
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
        $error = curl_error($ch);
        return array('ok' => false, 'status' => $status, 'body' => $error, 'data' => null);
    }

    $decoded = json_decode($body, true);
    $ok = $status >= 200 && $status < 300;

    return array('ok' => $ok, 'status' => $status, 'body' => $body, 'data' => $decoded);
}

function fetchApprovedComments($limit = 60){
    $limit = (int)$limit;
    if ($limit <= 0) {
        $limit = 60;
    }

    $path = '/rest/v1/comments?select=author_name,body,created_at,status&status=eq.approved&order=created_at.desc&limit=' . $limit;
    $response = supabaseRequest('GET', $path);

    if (!$response['ok'] || !is_array($response['data'])) {
        error_log('Unable to fetch comments from Supabase: ' . $response['body']);
        return array();
    }

    return $response['data'];
}

function insertPendingComment($authorName, $body, $ipHash, $userAgent){
    $payload = array(
        'author_name' => $authorName,
        'body' => $body,
        'ip_hash' => $ipHash,
        'user_agent' => $userAgent
    );

    $response = supabaseRequest('POST', '/rest/v1/comments', $payload);
    if (!$response['ok']) {
        error_log('Unable to insert comment into Supabase: ' . $response['body']);
    }

    return $response['ok'];
}

function formatCommentDate($isoDate){
    if (!$isoDate) {
        return '';
    }

    try {
        $date = new DateTime($isoDate);
        return $date->format('d/m/Y a H\\hi');
    } catch (Exception $e) {
        return '';
    }
}
