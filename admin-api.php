<?php
session_start();

require __DIR__ . '/services/comments-data.php';
require __DIR__ . '/services/admin-data.php';

function sendJson($status, $payload){
    http_response_code((int)$status);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($payload);
    exit;
}

function readJsonBody(){
    $raw = file_get_contents('php://input');
    if (!is_string($raw) || trim($raw) === '') {
        return array();
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : array();
}

function clearAdminSession(){
    $_SESSION = array();
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
}

function getAuthenticatedUser(){
    $adminUser = $_SESSION['admin_user'] ?? null;
    if (!is_array($adminUser)) {
        return null;
    }

    $timeoutMinutes = adminSessionTimeoutMinutes();
    $timeoutSeconds = $timeoutMinutes * 60;
    $lastActivity = isset($_SESSION['admin_last_activity']) ? (int)$_SESSION['admin_last_activity'] : 0;

    if ($lastActivity > 0 && (time() - $lastActivity) > $timeoutSeconds) {
        clearAdminSession();
        return null;
    }

    $_SESSION['admin_last_activity'] = time();
    return $adminUser;
}

function requireAdminUser(){
    $user = getAuthenticatedUser();
    if ($user === null) {
        sendJson(401, array('ok' => false, 'message' => 'Authentication required.'));
    }

    return $user;
}

function toBool($value){
    return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) === true;
}

function ensureList($value){
    return is_array($value) ? array_values($value) : array();
}

function ensureInt($value, $default = 0){
    return is_numeric($value) ? (int)$value : (int)$default;
}

function normalizeTimeValue($value, $fallback){
    $time = trim((string)$value);
    if ($time === '') {
        return $fallback;
    }

    if (preg_match('/^\d{2}:\d{2}$/', $time)) {
        return $time . ':00';
    }

    if (preg_match('/^\d{2}:\d{2}:\d{2}$/', $time)) {
        return $time;
    }

    return $fallback;
}

function setCorsHeaders(){
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowedOrigins = array(
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:4173',
        'http://127.0.0.1:4173'
    );

    if (in_array($origin, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    }
}

function updateOrInsertRow($table, $rowId, $payload){
    if ($rowId > 0) {
        return adminPatchById($table, $rowId, $payload);
    }

    return adminInsertRow($table, $payload);
}

function publishShows($shows){
    $shows = ensureList($shows);
    foreach ($shows as $show) {
        if (!is_array($show)) {
            continue;
        }

        $name = trim((string)($show['name'] ?? ''));
        if ($name === '') {
            continue;
        }

        $slugSource = trim((string)($show['slug'] ?? $name));
        $payload = array(
            'name' => $name,
            'slug' => adminSlugify($slugSource),
            'description' => trim((string)($show['description'] ?? '')),
            'cover_url' => trim((string)($show['cover_url'] ?? '')),
            'is_active' => toBool($show['is_active'] ?? true)
        );

        $id = ensureInt($show['id'] ?? 0);
        updateOrInsertRow('shows', $id, $payload);
    }
}

function publishSlots($slots){
    $slots = ensureList($slots);
    foreach ($slots as $slot) {
        if (!is_array($slot)) {
            continue;
        }

        $showId = ensureInt($slot['show_id'] ?? 0);
        if ($showId <= 0) {
            continue;
        }

        $payload = array(
            'show_id' => $showId,
            'day_of_week' => max(1, min(7, ensureInt($slot['day_of_week'] ?? 1))),
            'start_time' => normalizeTimeValue($slot['start_time'] ?? '', '08:00:00'),
            'end_time' => normalizeTimeValue($slot['end_time'] ?? '', '09:00:00'),
            'priority' => ensureInt($slot['priority'] ?? 0),
            'is_active' => toBool($slot['is_active'] ?? true)
        );

        $id = ensureInt($slot['id'] ?? 0);
        updateOrInsertRow('show_slots', $id, $payload);
    }
}

function publishCovers($covers){
    $covers = ensureList($covers);
    foreach ($covers as $index => $cover) {
        if (!is_array($cover)) {
            continue;
        }

        $imageUrl = trim((string)($cover['image_url'] ?? ''));
        if ($imageUrl === '') {
            continue;
        }

        $payload = array(
            'image_url' => $imageUrl,
            'title' => trim((string)($cover['title'] ?? '')),
            'sort_order' => ensureInt($cover['sort_order'] ?? $index),
            'is_active' => toBool($cover['is_active'] ?? true)
        );

        $id = ensureInt($cover['id'] ?? 0);
        updateOrInsertRow('featured_covers', $id, $payload);
    }
}

function publishTracks($tracks){
    $tracks = ensureList($tracks);
    foreach ($tracks as $index => $track) {
        if (!is_array($track)) {
            continue;
        }

        $title = trim((string)($track['title'] ?? ''));
        $mp3Url = trim((string)($track['mp3_url'] ?? ''));
        if ($title === '' || $mp3Url === '') {
            continue;
        }

        $payload = array(
            'title' => $title,
            'cover_url' => trim((string)($track['cover_url'] ?? '')),
            'mp3_url' => $mp3Url,
            'sort_order' => ensureInt($track['sort_order'] ?? $index),
            'is_active' => toBool($track['is_active'] ?? true)
        );

        $id = ensureInt($track['id'] ?? 0);
        updateOrInsertRow('favorite_tracks', $id, $payload);
    }
}

function publishVideos($videos){
    $videos = ensureList($videos);
    foreach ($videos as $index => $video) {
        if (!is_array($video)) {
            continue;
        }

        $youtubeUrl = trim((string)($video['youtube_url'] ?? ''));
        if ($youtubeUrl === '') {
            continue;
        }

        $payload = array(
            'slot' => max(1, min(3, ensureInt($video['slot'] ?? ($index + 1)))),
            'title' => trim((string)($video['title'] ?? '')),
            'youtube_url' => $youtubeUrl,
            'is_active' => toBool($video['is_active'] ?? true)
        );

        $id = ensureInt($video['id'] ?? 0);
        updateOrInsertRow('featured_videos', $id, $payload);
    }
}

function publishComments($comments){
    $comments = ensureList($comments);
    $allowedStatus = array('pending', 'approved', 'rejected', 'spam', 'removed');

    foreach ($comments as $comment) {
        if (!is_array($comment)) {
            continue;
        }

        $id = ensureInt($comment['id'] ?? 0);
        if ($id <= 0) {
            continue;
        }

        $status = trim((string)($comment['status'] ?? 'pending'));
        if (!in_array($status, $allowedStatus, true)) {
            $status = 'pending';
        }

        if ($status === 'removed') {
            adminDeleteById('comments', $id);
            continue;
        }

        adminPatchById('comments', $id, array(
            'status' => $status,
            'reviewed_at' => gmdate('c')
        ));
    }
}

function deleteRowsByIds($table, $ids){
    $ids = ensureList($ids);
    foreach ($ids as $id) {
        $intId = ensureInt($id);
        if ($intId > 0) {
            adminDeleteById($table, $intId);
        }
    }
}

function loadAdminBootstrapData(){
    $shows = adminFetchRows('/rest/v1/shows?select=id,name,slug,description,cover_url,is_active&order=id.asc');
    $slots = adminFetchRows('/rest/v1/show_slots?select=id,show_id,day_of_week,start_time,end_time,priority,is_active&order=day_of_week.asc&order=start_time.asc&order=id.asc');
    $covers = adminFetchRows('/rest/v1/featured_covers?select=id,image_url,title,sort_order,is_active&order=sort_order.asc&order=id.asc');
    $tracks = adminFetchRows('/rest/v1/favorite_tracks?select=id,title,cover_url,mp3_url,sort_order,is_active&order=sort_order.asc&order=id.asc');
    $videos = adminFetchRows('/rest/v1/featured_videos?select=id,slot,title,youtube_url,is_active&order=slot.asc&order=id.asc');
    $comments = adminFetchRows('/rest/v1/comments?select=id,author_name,body,status,created_at&order=created_at.desc&limit=200');

    return array(
        'shows' => $shows,
        'slots' => $slots,
        'covers' => $covers,
        'tracks' => $tracks,
        'videos' => $videos,
        'comments' => $comments
    );
}

setCorsHeaders();
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));
$body = readJsonBody();
$action = trim((string)($_GET['action'] ?? ($body['action'] ?? '')));

if ($action === '') {
    sendJson(400, array('ok' => false, 'message' => 'Missing action.'));
}

if ($action === 'login') {
    if ($method !== 'POST') {
        sendJson(405, array('ok' => false, 'message' => 'Method not allowed.'));
    }

    $username = trim((string)($body['username'] ?? ''));
    $password = (string)($body['password'] ?? '');
    $authUser = adminAuthenticate($username, $password);

    if ($authUser === null) {
        sendJson(401, array('ok' => false, 'message' => 'Invalid credentials.'));
    }

    session_regenerate_id(true);
    $_SESSION['admin_user'] = $authUser;
    $_SESSION['admin_last_activity'] = time();

    sendJson(200, array('ok' => true, 'user' => $authUser));
}

if ($action === 'logout') {
    if ($method !== 'POST') {
        sendJson(405, array('ok' => false, 'message' => 'Method not allowed.'));
    }

    clearAdminSession();
    session_start();
    sendJson(200, array('ok' => true));
}

if ($action === 'session') {
    $user = getAuthenticatedUser();
    sendJson(200, array(
        'ok' => true,
        'authenticated' => $user !== null,
        'user' => $user
    ));
}

if ($action === 'bootstrap') {
    requireAdminUser();
    sendJson(200, array('ok' => true, 'data' => loadAdminBootstrapData()));
}

if ($action === 'publish') {
    if ($method !== 'POST') {
        sendJson(405, array('ok' => false, 'message' => 'Method not allowed.'));
    }

    requireAdminUser();

    $data = is_array($body['data'] ?? null) ? $body['data'] : array();
    publishShows($data['shows'] ?? array());
    publishSlots($data['slots'] ?? array());
    publishCovers($data['covers'] ?? array());
    publishTracks($data['tracks'] ?? array());
    publishVideos($data['videos'] ?? array());
    publishComments($data['comments'] ?? array());

    $deleted = is_array($body['deleted'] ?? null) ? $body['deleted'] : array();
    deleteRowsByIds('show_slots', $deleted['slots'] ?? array());
    deleteRowsByIds('shows', $deleted['shows'] ?? array());
    deleteRowsByIds('featured_covers', $deleted['covers'] ?? array());
    deleteRowsByIds('favorite_tracks', $deleted['tracks'] ?? array());
    deleteRowsByIds('featured_videos', $deleted['videos'] ?? array());

    sendJson(200, array(
        'ok' => true,
        'message' => 'Changes published.',
        'data' => loadAdminBootstrapData()
    ));
}

sendJson(404, array('ok' => false, 'message' => 'Unknown action.'));
