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

function fetchSupabaseRows($path){
    $response = supabaseRequest('GET', $path);
    if (!$response['ok'] || !is_array($response['data'])) {
        error_log('Unable to fetch Supabase rows: ' . $response['body']);
        return array();
    }

    return $response['data'];
}

function fetchSiteSetting($settingKey, $defaultValue = ''){
    $settingKey = trim((string)$settingKey);
    if ($settingKey === '') {
        return $defaultValue;
    }

    $path = '/rest/v1/site_settings?select=setting_value&setting_key=eq.' . rawurlencode($settingKey) . '&limit=1';
    $rows = fetchSupabaseRows($path);
    if (empty($rows) || !isset($rows[0]['setting_value'])) {
        return $defaultValue;
    }

    $value = (string)$rows[0]['setting_value'];
    return $value !== '' ? $value : $defaultValue;
}

function fetchApprovedComments($limit = 60){
    $limit = (int)$limit;
    if ($limit <= 0) {
        $limit = 60;
    }

    $path = '/rest/v1/comments?select=author_name,body,created_at,status&status=eq.approved&order=created_at.desc&limit=' . $limit;
    return fetchSupabaseRows($path);
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

function normalizeAssetPath($path){
    if (!$path) {
        return '';
    }

    if (preg_match('/^https?:\/\//i', $path)) {
        return $path;
    }

    return ltrim($path, '/');
}

function fetchProgramSlots($limit = 80){
    $limit = (int)$limit;
    if ($limit <= 0) {
        $limit = 80;
    }

    $path = '/rest/v1/show_slots?select=id,day_of_week,start_time,end_time,priority,show:shows!inner(id,name,description,cover_url,is_active)&is_active=eq.true&show.is_active=eq.true&order=day_of_week.asc&order=start_time.asc&order=priority.asc&limit=' . $limit;
    return fetchSupabaseRows($path);
}

function fetchFeaturedCovers($limit = 40){
    $limit = (int)$limit;
    if ($limit <= 0) {
        $limit = 40;
    }

    $path = '/rest/v1/featured_covers?select=id,image_url,title,is_active,sort_order&is_active=eq.true&order=sort_order.asc&order=id.asc&limit=' . $limit;
    return fetchSupabaseRows($path);
}

function fetchFavoriteTracks($limit = 20){
    $limit = (int)$limit;
    if ($limit <= 0) {
        $limit = 20;
    }

    $path = '/rest/v1/favorite_tracks?select=id,title,mp3_url,is_active,sort_order&is_active=eq.true&order=sort_order.asc&order=id.asc&limit=' . $limit;
    return fetchSupabaseRows($path);
}

function extractYoutubeId($url){
    if (!$url) {
        return '';
    }

    if (preg_match('/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i', $url, $matches)) {
        return $matches[1];
    }

    return '';
}

function toYoutubeEmbedUrl($url){
    $id = extractYoutubeId($url);
    if ($id === '') {
        return '';
    }

    return 'https://www.youtube.com/embed/' . $id;
}

function fetchFeaturedVideos($limit = 3){
    $limit = (int)$limit;
    if ($limit <= 0) {
        $limit = 3;
    }

    $path = '/rest/v1/featured_videos?select=id,slot,title,youtube_url,is_active&is_active=eq.true&order=slot.asc&order=id.asc&limit=' . $limit;
    return fetchSupabaseRows($path);
}

function formatHourRange($start, $end){
    $startHour = substr((string)$start, 0, 5);
    $endHour = substr((string)$end, 0, 5);
    return $startHour . ' / ' . $endHour;
}
