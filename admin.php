<?php
session_start();

require __DIR__ . '/services/comments-data.php';
require __DIR__ . '/services/admin-data.php';

function ensureCsrfToken(){
  if (empty($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
  }

  return $_SESSION['csrf_token'];
}

function isValidCsrfToken($token){
  return is_string($token) && hash_equals(ensureCsrfToken(), $token);
}

function renderCsrfField(){
  echo '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(ensureCsrfToken(), ENT_QUOTES, 'UTF-8') . '">';
}

function iniSizeToBytes($value){
  $value = trim((string)$value);
  if ($value === '') {
    return 0;
  }

  $unit = strtolower(substr($value, -1));
  $number = (float)$value;

  switch ($unit) {
    case 'g':
      return (int)($number * 1024 * 1024 * 1024);
    case 'm':
      return (int)($number * 1024 * 1024);
    case 'k':
      return (int)($number * 1024);
    default:
      return (int)$number;
  }
}

function isRenderableMediaUrl($url){
  $url = trim((string)$url);
  if ($url === '') {
    return false;
  }

  return (bool)preg_match('/^(https?:\/\/|\/|assets\/)/i', $url);
}

function renderImagePreview($url, $alt = 'Image preview'){
  if (!isRenderableMediaUrl($url)) {
    return;
  }

  $safeUrl = htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
  $safeAlt = htmlspecialchars($alt, ENT_QUOTES, 'UTF-8');
  echo '<div class="preview-panel"><span class="preview-label">Current image</span><img class="preview-thumb" src="' . $safeUrl . '" alt="' . $safeAlt . '"></div>';
}

function renderAudioPreview($url){
  if (!isRenderableMediaUrl($url)) {
    return;
  }

  $safeUrl = htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
  echo '<div class="preview-panel"><span class="preview-label">Current audio</span><audio class="preview-audio" controls preload="none" src="' . $safeUrl . '"></audio><a class="preview-link" href="' . $safeUrl . '" target="_blank" rel="noopener">Open file</a></div>';
}

$adminUser = $_SESSION['admin_user'] ?? null;
$loginError = '';
$notice = '';
$sessionTimeoutMinutes = adminSessionTimeoutMinutes();
$sessionTimeoutSeconds = $sessionTimeoutMinutes * 60;

$csrfError = 'Invalid session. Refresh the page and try again.';
$isPost = ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
$contentLength = isset($_SERVER['CONTENT_LENGTH']) ? (int)$_SERVER['CONTENT_LENGTH'] : 0;
$postMaxBytes = iniSizeToBytes(ini_get('post_max_size'));

if ($isPost && $contentLength > 0 && $postMaxBytes > 0 && $contentLength > $postMaxBytes) {
  $notice = 'Upload too large for current PHP limits. Increase upload_max_filesize and post_max_size.';
  if ($adminUser) {
    header('Location: admin.php?notice=' . urlencode($notice));
    exit;
  }
  $loginError = $notice;
}

if ($adminUser) {
  $lastActivity = isset($_SESSION['admin_last_activity']) ? (int)$_SESSION['admin_last_activity'] : 0;
  if ($lastActivity > 0 && (time() - $lastActivity) > $sessionTimeoutSeconds) {
    $_SESSION = array();
    if (ini_get('session.use_cookies')) {
      $params = session_get_cookie_params();
      setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    session_start();
    header('Location: admin.php?notice=' . urlencode('Admin session expired (inactivity).'));
    exit;
  }

  $_SESSION['admin_last_activity'] = time();
}

if ($isPost && !isValidCsrfToken($_POST['csrf_token'] ?? null)) {
  if ($adminUser) {
    header('Location: admin.php?notice=' . urlencode($csrfError));
    exit;
  }

  $loginError = $csrfError;
}

if ($isPost && isset($_POST['action']) && $_POST['action'] === 'logout' && $loginError === '') {
  $_SESSION = array();
    session_destroy();
    header('Location: admin.php');
    exit;
}

if (!$adminUser && isset($_POST['login_submit']) && $loginError === '') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    $authUser = adminAuthenticate($username, $password);
    if ($authUser !== null) {
      session_regenerate_id(true);
        $_SESSION['admin_user'] = $authUser;
      $_SESSION['admin_last_activity'] = time();
        header('Location: admin.php');
        exit;
    }

    $loginError = 'Invalid credentials.';
}

$adminUser = $_SESSION['admin_user'] ?? null;

if ($adminUser && isset($_POST['action']) && $_POST['action'] !== 'logout' && $loginError === '') {
    $action = (string)$_POST['action'];

    if ($action === 'comment_update') {
        $id = (int)($_POST['id'] ?? 0);
        $status = (string)($_POST['status'] ?? 'approved');
        $allowed = array('approved', 'rejected', 'spam', 'pending');
        if ($id > 0 && in_array($status, $allowed, true)) {
            adminPatchById('comments', $id, array('status' => $status, 'reviewed_at' => gmdate('c')));
            $notice = 'Comment updated.';
        }
    }

    if ($action === 'comment_delete') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            adminDeleteById('comments', $id);
            $notice = 'Comment deleted.';
        }
    }

    if ($action === 'hero_message_update') {
      $message = trim($_POST['hero_sliding_message'] ?? '');
      $result = adminUpsertSiteSetting('hero_sliding_message', $message);
      $notice = $result['ok'] ? 'Hero message updated.' : ('Unable to save hero message: ' . $result['message']);
    }

    if ($action === 'show_upsert') {
        $id = (int)($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $coverUrl = trim($_POST['cover_url'] ?? '');
        $isActive = isset($_POST['is_active']) ? true : false;
        $slug = adminSlugify(trim($_POST['slug'] ?? ''));
        if ($slug === '') {
            $slug = adminSlugify($name);
        }

        if ($name !== '') {
          $uploadResult = adminUploadMediaFile('cover_file', 'shows', $slug !== '' ? $slug : $name, 'image');
          if (!$uploadResult['ok']) {
            $notice = $uploadResult['message'];
          }
          if (!empty($uploadResult['uploaded'])) {
            $coverUrl = $uploadResult['url'];
          }

            $payload = array(
                'name' => $name,
                'slug' => $slug,
                'description' => $description,
                'cover_url' => $coverUrl,
                'is_active' => $isActive
            );

          if ($notice === '') {
            if ($id > 0) {
                adminPatchById('shows', $id, $payload);
                $notice = 'Show updated.';
            } else {
                adminInsertRow('shows', $payload);
                $notice = 'Show added.';
            }
            }
        }
    }

    if ($action === 'show_delete') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            adminDeleteById('shows', $id);
            $notice = 'Show deleted.';
        }
    }

    if ($action === 'slot_upsert') {
        $id = (int)($_POST['id'] ?? 0);
        $showId = (int)($_POST['show_id'] ?? 0);
        $day = (int)($_POST['day_of_week'] ?? 1);
        $start = trim($_POST['start_time'] ?? '08:00:00');
        $end = trim($_POST['end_time'] ?? '09:00:00');
        $priority = (int)($_POST['priority'] ?? 0);
        $isActive = isset($_POST['is_active']) ? true : false;

        if ($showId > 0 && $day >= 1 && $day <= 7) {
            $payload = array(
                'show_id' => $showId,
                'day_of_week' => $day,
                'start_time' => $start,
                'end_time' => $end,
                'priority' => $priority,
                'is_active' => $isActive
            );

            if ($id > 0) {
                adminPatchById('show_slots', $id, $payload);
                $notice = 'Schedule slot updated.';
            } else {
                adminInsertRow('show_slots', $payload);
                $notice = 'Schedule slot added.';
            }
        }
    }

    if ($action === 'slot_delete') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            adminDeleteById('show_slots', $id);
            $notice = 'Schedule slot deleted.';
        }
    }

    if ($action === 'cover_upsert') {
        $id = (int)($_POST['id'] ?? 0);
        $imageUrl = trim($_POST['image_url'] ?? '');
        $title = trim($_POST['title'] ?? '');
        $sortOrder = (int)($_POST['sort_order'] ?? 0);
        $isActive = isset($_POST['is_active']) ? true : false;

      $uploadResult = adminUploadMediaFile('image_file', 'covers', $title !== '' ? $title : 'cover', 'image');
      if (!$uploadResult['ok']) {
        $notice = $uploadResult['message'];
      }
      if (!empty($uploadResult['uploaded'])) {
        $imageUrl = $uploadResult['url'];
      }

        if ($imageUrl !== '') {
            $payload = array(
                'image_url' => $imageUrl,
                'title' => $title,
                'sort_order' => $sortOrder,
                'is_active' => $isActive
            );

        if ($notice === '') {
          if ($id > 0) {
                adminPatchById('featured_covers', $id, $payload);
                $notice = 'Featured cover updated.';
          } else {
                adminInsertRow('featured_covers', $payload);
                $notice = 'Featured cover added.';
          }
            }
        }
    }

    if ($action === 'cover_delete') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            adminDeleteById('featured_covers', $id);
            $notice = 'Featured cover deleted.';
        }
    }

    if ($action === 'track_upsert') {
        $id = (int)($_POST['id'] ?? 0);
        $title = trim($_POST['title'] ?? '');
        $mp3Url = trim($_POST['mp3_url'] ?? '');
        $sortOrder = (int)($_POST['sort_order'] ?? 0);
        $isActive = isset($_POST['is_active']) ? true : false;

      $mp3UploadResult = adminUploadMediaFile('track_mp3_file', 'tracks/audio', $title !== '' ? $title : 'track-audio', 'audio');
      if (!$mp3UploadResult['ok']) {
        $notice = $mp3UploadResult['message'];
      }
      if (!empty($mp3UploadResult['uploaded'])) {
        $mp3Url = $mp3UploadResult['url'];
      }

        if ($title !== '' && $mp3Url !== '') {
            $payload = array(
                'title' => $title,
                'mp3_url' => $mp3Url,
                'sort_order' => $sortOrder,
                'is_active' => $isActive
            );

        if ($notice === '') {
          if ($id > 0) {
                adminPatchById('favorite_tracks', $id, $payload);
                $notice = 'Favorite track updated.';
          } else {
                adminInsertRow('favorite_tracks', $payload);
                $notice = 'Favorite track added.';
          }
            }
        }
    }

    if ($action === 'track_delete') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            adminDeleteById('favorite_tracks', $id);
            $notice = 'Favorite track deleted.';
        }
    }

    if ($action === 'video_upsert') {
        $id = (int)($_POST['id'] ?? 0);
        $slot = (int)($_POST['slot'] ?? 1);
        $title = trim($_POST['title'] ?? '');
        $youtubeUrl = trim($_POST['youtube_url'] ?? '');
        $isActive = isset($_POST['is_active']) ? true : false;

        if ($slot >= 1 && $slot <= 3 && $youtubeUrl !== '') {
            $payload = array(
                'slot' => $slot,
                'title' => $title,
                'youtube_url' => $youtubeUrl,
                'is_active' => $isActive
            );

            if ($id > 0) {
                adminPatchById('featured_videos', $id, $payload);
                $notice = 'Featured video updated.';
            } else {
                adminInsertRow('featured_videos', $payload);
                $notice = 'Featured video added.';
            }
        }
    }

    if ($action === 'video_delete') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            adminDeleteById('featured_videos', $id);
            $notice = 'Featured video deleted.';
        }
    }

    header('Location: admin.php?notice=' . urlencode($notice));
    exit;
}

if (isset($_GET['notice'])) {
    $notice = trim((string)$_GET['notice']);
}

if (!$adminUser) {
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>BSideRadio Admin Login</title>
  <style>
    body { font-family: Arial, sans-serif; background: #1f1f1f; color: #fff; margin: 0; }
    .box { max-width: 420px; margin: 80px auto; background: #2b2b2b; padding: 24px; border-radius: 10px; }
    input { width: 100%; padding: 10px; margin: 8px 0; border-radius: 6px; border: 1px solid #555; }
    button { background: #e53935; color: #fff; border: 0; padding: 10px 14px; border-radius: 6px; cursor: pointer; }
    .err { color: #ff8a80; }
  </style>
</head>
<body>
  <div class="box">
    <h1>BSideRadio Admin Login</h1>
    <p>Sign in to manage website content.</p>
    <?php if ($loginError !== '') { echo '<p class="err">' . htmlspecialchars($loginError, ENT_QUOTES, 'UTF-8') . '</p>'; } ?>
    <form method="post" action="admin.php">
      <?php renderCsrfField(); ?>
      <label>Username</label>
      <input type="text" name="username" required>
      <label>Password</label>
      <input type="password" name="password" required>
      <button type="submit" name="login_submit" value="1">Sign in</button>
    </form>
  </div>
</body>
</html>
<?php
    exit;
}

$comments = adminFetchRows('/rest/v1/comments?select=id,author_name,body,status,created_at&order=created_at.desc&limit=120');
$shows = adminFetchRows('/rest/v1/shows?select=id,slug,name,description,cover_url,is_active&order=id.asc');
$slots = adminFetchRows('/rest/v1/show_slots?select=id,show_id,day_of_week,start_time,end_time,priority,is_active&order=day_of_week.asc&order=start_time.asc');
$covers = adminFetchRows('/rest/v1/featured_covers?select=id,image_url,title,sort_order,is_active&order=sort_order.asc&order=id.asc');
$tracks = adminFetchRows('/rest/v1/favorite_tracks?select=id,title,mp3_url,sort_order,is_active&order=sort_order.asc&order=id.asc');
$videos = adminFetchRows('/rest/v1/featured_videos?select=id,slot,title,youtube_url,is_active&order=slot.asc');
$heroSlidingMessage = fetchSiteSetting('hero_sliding_message', 'Only mashups & remixes');

$stats = array(
  'comments' => count($comments),
  'shows' => count($shows),
  'slots' => count($slots),
  'covers' => count($covers),
  'tracks' => count($tracks),
  'videos' => count($videos)
);

$dayLabels = array(1 => 'Monday', 2 => 'Tuesday', 3 => 'Wednesday', 4 => 'Thursday', 5 => 'Friday', 6 => 'Saturday', 7 => 'Sunday');
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>BSideRadio Admin Panel</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: radial-gradient(circle at top right, #1d2333 0%, #10141e 44%, #0b0f17 100%); color: #e8eaf0; }
    header { background: rgba(16, 20, 30, 0.92); backdrop-filter: blur(8px); color: #fff; padding: 16px; position: sticky; top: 0; border-bottom: 1px solid #2a3142; box-shadow: 0 8px 30px rgba(0,0,0,.3); }
    .container { max-width: 1240px; margin: 20px auto; padding: 0 14px 20px; }
    .card { background: linear-gradient(180deg, #1a2030 0%, #161c2b 100%); border: 1px solid #2f3a53; border-radius: 14px; padding: 16px; margin-bottom: 16px; box-shadow: 0 10px 26px rgba(0,0,0,.3); }
    .grid { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
    input, textarea, select { width: 100%; box-sizing: border-box; padding: 9px 10px; border: 1px solid #3a4966; border-radius: 8px; background: #101726; color: #edf2ff; }
    input:focus, textarea:focus, select:focus { outline: none; border-color: #5a74a5; box-shadow: 0 0 0 3px rgba(90,116,165,.2); }
    textarea { min-height: 80px; }
    .row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    button { border: 0; border-radius: 8px; padding: 8px 12px; cursor: pointer; font-weight: 600; }
    .btn-save { background: #2f8f63; color: #fff; }
    .btn-delete { background: #c04a57; color: #fff; }
    .btn-muted { background: #3e4a62; color: #fff; }
    .btn-logout { background: transparent; color: #fff; border: 1px solid #fff; padding: 6px 10px; }
    .notice { background: #18351f; border: 1px solid #2f8f63; color: #d5ffe6; padding: 10px; border-radius: 6px; }
    .small { font-size: 12px; color: #a8b2c6; }
    .logout-form { display: inline-block; margin-left: 8px; }
    .session-note { font-size: 12px; color: #d2dae8; margin-left: 8px; }
    .hint { color: #a8b2c6; margin-top: 0; }
    .stats-grid { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(145px, 1fr)); }
    .stat { border: 1px solid #2f3b55; border-radius: 10px; padding: 10px; background: #12192a; }
    .stat-label { display: block; font-size: 12px; color: #8ea0c5; text-transform: uppercase; letter-spacing: .6px; }
    .stat-value { display: block; font-size: 26px; font-weight: 700; color: #f0f4ff; margin-top: 4px; }
    .preview-panel { display: inline-flex; align-items: center; gap: 10px; margin-top: 10px; border: 1px solid #354563; border-radius: 10px; padding: 8px 10px; background: #101828; }
    .preview-label { font-size: 12px; color: #9ab0d8; text-transform: uppercase; letter-spacing: .5px; }
    .preview-thumb { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; border: 1px solid #405175; background: #0a0f1a; }
    .preview-audio { width: 260px; max-width: 100%; }
    .preview-link { color: #9ad1ff; text-decoration: none; font-size: 13px; }
    .preview-link:hover { text-decoration: underline; }
    h2 { margin-top: 0; }
  </style>
  <link rel="icon" type="image/png" href="assets/images/bsidedesign.png" />
</head>
<body>
<header>
  <div class="row" style="justify-content:space-between;">
    <strong>B-Side Admin Panel</strong>
    <div>
      Signed in: <?php echo htmlspecialchars($adminUser['display_name'] ?? $adminUser['username'] ?? 'admin', ENT_QUOTES, 'UTF-8'); ?>
      <form method="post" action="admin.php" class="logout-form">
        <?php renderCsrfField(); ?>
        <button class="btn-logout" type="submit" name="action" value="logout">Sign out</button>
      </form>
      <span class="session-note">Session timeout: <?php echo (int)$sessionTimeoutMinutes; ?> min</span>
    </div>
  </div>
</header>
<div class="container">
  <?php if ($notice !== '') { echo '<p class="notice">' . htmlspecialchars($notice, ENT_QUOTES, 'UTF-8') . '</p>'; } ?>

  <section class="card">
    <h2>Dashboard overview</h2>
    <div class="stats-grid">
      <div class="stat"><span class="stat-label">Comments</span><span class="stat-value"><?php echo (int)$stats['comments']; ?></span></div>
      <div class="stat"><span class="stat-label">Shows</span><span class="stat-value"><?php echo (int)$stats['shows']; ?></span></div>
      <div class="stat"><span class="stat-label">Slots</span><span class="stat-value"><?php echo (int)$stats['slots']; ?></span></div>
      <div class="stat"><span class="stat-label">Covers</span><span class="stat-value"><?php echo (int)$stats['covers']; ?></span></div>
      <div class="stat"><span class="stat-label">Tracks</span><span class="stat-value"><?php echo (int)$stats['tracks']; ?></span></div>
      <div class="stat"><span class="stat-label">Videos</span><span class="stat-value"><?php echo (int)$stats['videos']; ?></span></div>
    </div>
  </section>

  <section class="card">
    <h2>Homepage sliding message</h2>
    <p class="hint">This controls the short moving text above the player on the homepage.</p>
    <form method="post" class="card" style="margin:10px 0;">
      <?php renderCsrfField(); ?>
      <div class="grid">
        <input type="text" name="hero_sliding_message" value="<?php echo htmlspecialchars($heroSlidingMessage, ENT_QUOTES, 'UTF-8'); ?>" placeholder="Only mashups & remixes" required>
      </div>
      <div class="row">
        <button class="btn-save" type="submit" name="action" value="hero_message_update">Save</button>
      </div>
    </form>
  </section>

  <section class="card">
    <h2>Comments</h2>
    <?php foreach ($comments as $comment) { ?>
      <form method="post" class="card" style="margin:10px 0;">
        <?php renderCsrfField(); ?>
        <input type="hidden" name="id" value="<?php echo (int)$comment['id']; ?>">
        <p><strong><?php echo htmlspecialchars($comment['author_name'] ?? '', ENT_QUOTES, 'UTF-8'); ?></strong> <span class="small">#<?php echo (int)$comment['id']; ?> - <?php echo htmlspecialchars($comment['created_at'] ?? '', ENT_QUOTES, 'UTF-8'); ?></span></p>
        <textarea readonly><?php echo htmlspecialchars($comment['body'] ?? '', ENT_QUOTES, 'UTF-8'); ?></textarea>
        <div class="row">
          <select name="status">
            <?php foreach (array('approved','rejected','spam','pending') as $status) { ?>
              <option value="<?php echo $status; ?>"<?php echo (($comment['status'] ?? '') === $status) ? ' selected' : ''; ?>><?php echo $status; ?></option>
            <?php } ?>
          </select>
          <button class="btn-save" type="submit" name="action" value="comment_update">Save</button>
          <button class="btn-delete" type="submit" name="action" value="comment_delete" onclick="return confirm('Delete this comment?');">Delete</button>
        </div>
      </form>
    <?php } ?>
  </section>

  <section class="card">
    <h2>Shows (name, description, thumbnail)</h2>
    <p class="hint">These fields are used in Program section cards. You can paste an image URL or upload a new image directly to Supabase Storage.</p>
    <?php foreach ($shows as $show) { ?>
      <form method="post" enctype="multipart/form-data" class="card" style="margin:10px 0;">
        <?php renderCsrfField(); ?>
        <input type="hidden" name="id" value="<?php echo (int)$show['id']; ?>">
        <div class="grid">
          <input type="text" name="name" value="<?php echo htmlspecialchars($show['name'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" placeholder="Name" required>
          <input type="text" name="slug" value="<?php echo htmlspecialchars($show['slug'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" placeholder="slug">
          <input type="text" name="cover_url" value="<?php echo htmlspecialchars($show['cover_url'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" placeholder="Image URL">
          <input type="file" name="cover_file" accept="image/jpeg,image/png,image/webp,image/gif">
          <label><input type="checkbox" name="is_active" value="1"<?php echo !empty($show['is_active']) ? ' checked' : ''; ?>> active</label>
        </div>
        <?php renderImagePreview($show['cover_url'] ?? '', ($show['name'] ?? 'Show') . ' thumbnail'); ?>
        <textarea name="description" placeholder="Description"><?php echo htmlspecialchars($show['description'] ?? '', ENT_QUOTES, 'UTF-8'); ?></textarea>
        <div class="row">
          <button class="btn-save" type="submit" name="action" value="show_upsert">Save</button>
          <button class="btn-delete" type="submit" name="action" value="show_delete" onclick="return confirm('Delete this show?');">Delete</button>
        </div>
      </form>
    <?php } ?>

    <h3>Add show</h3>
    <form method="post" enctype="multipart/form-data" class="card" style="margin:10px 0;">
      <?php renderCsrfField(); ?>
      <div class="grid">
        <input type="text" name="name" placeholder="Name" required>
        <input type="text" name="slug" placeholder="slug">
        <input type="text" name="cover_url" placeholder="Image URL">
        <input type="file" name="cover_file" accept="image/jpeg,image/png,image/webp,image/gif">
        <label><input type="checkbox" name="is_active" value="1" checked> active</label>
      </div>
      <textarea name="description" placeholder="Description"></textarea>
      <button class="btn-save" type="submit" name="action" value="show_upsert">Add</button>
    </form>
  </section>

  <section class="card">
    <h2>Show schedule</h2>
    <p class="hint">These rows drive Program section time slots.</p>
    <?php foreach ($slots as $slot) { ?>
      <form method="post" class="card" style="margin:10px 0;">
        <?php renderCsrfField(); ?>
        <input type="hidden" name="id" value="<?php echo (int)$slot['id']; ?>">
        <div class="grid">
          <select name="show_id" required>
            <?php foreach ($shows as $show) { ?>
              <option value="<?php echo (int)$show['id']; ?>"<?php echo ((int)$slot['show_id'] === (int)$show['id']) ? ' selected' : ''; ?>><?php echo htmlspecialchars($show['name'] ?? '', ENT_QUOTES, 'UTF-8'); ?></option>
            <?php } ?>
          </select>
          <select name="day_of_week">
            <?php foreach ($dayLabels as $day => $label) { ?>
              <option value="<?php echo $day; ?>"<?php echo ((int)$slot['day_of_week'] === $day) ? ' selected' : ''; ?>><?php echo $label; ?></option>
            <?php } ?>
          </select>
          <input type="time" name="start_time" value="<?php echo htmlspecialchars(substr((string)$slot['start_time'], 0, 5), ENT_QUOTES, 'UTF-8'); ?>" required>
          <input type="time" name="end_time" value="<?php echo htmlspecialchars(substr((string)$slot['end_time'], 0, 5), ENT_QUOTES, 'UTF-8'); ?>" required>
          <input type="number" name="priority" value="<?php echo (int)($slot['priority'] ?? 0); ?>" placeholder="priority">
          <label><input type="checkbox" name="is_active" value="1"<?php echo !empty($slot['is_active']) ? ' checked' : ''; ?>> active</label>
        </div>
        <div class="row">
          <button class="btn-save" type="submit" name="action" value="slot_upsert">Save</button>
          <button class="btn-delete" type="submit" name="action" value="slot_delete" onclick="return confirm('Delete this schedule slot?');">Delete</button>
        </div>
      </form>
    <?php } ?>

    <h3>Add schedule slot</h3>
    <form method="post" class="card" style="margin:10px 0;">
      <?php renderCsrfField(); ?>
      <div class="grid">
        <select name="show_id" required>
          <?php foreach ($shows as $show) { ?>
            <option value="<?php echo (int)$show['id']; ?>"><?php echo htmlspecialchars($show['name'] ?? '', ENT_QUOTES, 'UTF-8'); ?></option>
          <?php } ?>
        </select>
        <select name="day_of_week">
          <?php foreach ($dayLabels as $day => $label) { ?>
            <option value="<?php echo $day; ?>"><?php echo $label; ?></option>
          <?php } ?>
        </select>
        <input type="time" name="start_time" value="08:00" required>
        <input type="time" name="end_time" value="09:00" required>
        <input type="number" name="priority" value="0" placeholder="priority">
        <label><input type="checkbox" name="is_active" value="1" checked> active</label>
      </div>
      <button class="btn-save" type="submit" name="action" value="slot_upsert">Add</button>
    </form>
  </section>

  <section class="card">
    <h2>This Week carousel covers</h2>
    <p class="hint">These images are used in This Week slider. Uploading a file will automatically generate a public Storage URL.</p>
    <?php foreach ($covers as $cover) { ?>
      <form method="post" enctype="multipart/form-data" class="card" style="margin:10px 0;">
        <?php renderCsrfField(); ?>
        <input type="hidden" name="id" value="<?php echo (int)$cover['id']; ?>">
        <div class="grid">
          <input type="text" name="image_url" value="<?php echo htmlspecialchars($cover['image_url'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" placeholder="Image URL" required>
          <input type="text" name="title" value="<?php echo htmlspecialchars($cover['title'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" placeholder="Title">
          <input type="number" name="sort_order" value="<?php echo (int)($cover['sort_order'] ?? 0); ?>" placeholder="order">
          <input type="file" name="image_file" accept="image/jpeg,image/png,image/webp,image/gif">
          <label><input type="checkbox" name="is_active" value="1"<?php echo !empty($cover['is_active']) ? ' checked' : ''; ?>> active</label>
        </div>
        <?php renderImagePreview($cover['image_url'] ?? '', $cover['title'] ?? 'Cover image'); ?>
        <div class="row">
          <button class="btn-save" type="submit" name="action" value="cover_upsert">Save</button>
          <button class="btn-delete" type="submit" name="action" value="cover_delete" onclick="return confirm('Delete this cover?');">Delete</button>
        </div>
      </form>
    <?php } ?>

    <h3>Add cover</h3>
    <form method="post" enctype="multipart/form-data" class="card" style="margin:10px 0;">
      <?php renderCsrfField(); ?>
      <div class="grid">
        <input type="text" name="image_url" placeholder="Image URL" required>
        <input type="text" name="title" placeholder="Title">
        <input type="number" name="sort_order" value="0" placeholder="order">
        <input type="file" name="image_file" accept="image/jpeg,image/png,image/webp,image/gif">
        <label><input type="checkbox" name="is_active" value="1" checked> active</label>
      </div>
      <button class="btn-save" type="submit" name="action" value="cover_upsert">Add</button>
    </form>
  </section>

  <section class="card">
    <h2>Replay Session: 6 favorite MP3 tracks</h2>
    <p class="hint">These items feed Replay section tracks. Frontend shows first 6 active rows by order. You can paste an MP3 URL or upload an MP3 file directly to Supabase Storage.</p>
    <?php foreach ($tracks as $track) { ?>
      <form method="post" enctype="multipart/form-data" class="card" style="margin:10px 0;">
        <?php renderCsrfField(); ?>
        <input type="hidden" name="id" value="<?php echo (int)$track['id']; ?>">
        <div class="grid">
          <input type="text" name="title" value="<?php echo htmlspecialchars($track['title'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" placeholder="Track title" required>
          <input type="text" name="mp3_url" value="<?php echo htmlspecialchars($track['mp3_url'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" placeholder="MP3 URL" required>
          <input type="number" name="sort_order" value="<?php echo (int)($track['sort_order'] ?? 0); ?>" placeholder="order">
          <input type="file" name="track_mp3_file" accept="audio/mpeg,.mp3">
          <label><input type="checkbox" name="is_active" value="1"<?php echo !empty($track['is_active']) ? ' checked' : ''; ?>> active</label>
        </div>
        <?php renderAudioPreview($track['mp3_url'] ?? ''); ?>
        <div class="row">
          <button class="btn-save" type="submit" name="action" value="track_upsert">Save</button>
          <button class="btn-delete" type="submit" name="action" value="track_delete" onclick="return confirm('Delete this track?');">Delete</button>
        </div>
      </form>
    <?php } ?>

    <h3>Add favorite track</h3>
    <form method="post" enctype="multipart/form-data" class="card" style="margin:10px 0;">
      <?php renderCsrfField(); ?>
      <div class="grid">
        <input type="text" name="title" placeholder="Track title" required>
        <input type="text" name="mp3_url" placeholder="MP3 URL" required>
        <input type="number" name="sort_order" value="0" placeholder="order">
        <input type="file" name="track_mp3_file" accept="audio/mpeg,.mp3">
        <label><input type="checkbox" name="is_active" value="1" checked> active</label>
      </div>
      <button class="btn-save" type="submit" name="action" value="track_upsert">Add</button>
    </form>
  </section>

  <section class="card">
    <h2>3 featured YouTube videos</h2>
    <?php foreach ($videos as $video) { ?>
      <form method="post" class="card" style="margin:10px 0;">
        <?php renderCsrfField(); ?>
        <input type="hidden" name="id" value="<?php echo (int)$video['id']; ?>">
        <div class="grid">
          <select name="slot">
            <option value="1"<?php echo ((int)$video['slot'] === 1) ? ' selected' : ''; ?>>Slot 1</option>
            <option value="2"<?php echo ((int)$video['slot'] === 2) ? ' selected' : ''; ?>>Slot 2</option>
            <option value="3"<?php echo ((int)$video['slot'] === 3) ? ' selected' : ''; ?>>Slot 3</option>
          </select>
          <input type="text" name="title" value="<?php echo htmlspecialchars($video['title'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" placeholder="Title">
          <input type="text" name="youtube_url" value="<?php echo htmlspecialchars($video['youtube_url'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" placeholder="YouTube URL" required>
          <label><input type="checkbox" name="is_active" value="1"<?php echo !empty($video['is_active']) ? ' checked' : ''; ?>> active</label>
        </div>
        <div class="row">
          <button class="btn-save" type="submit" name="action" value="video_upsert">Save</button>
          <button class="btn-delete" type="submit" name="action" value="video_delete" onclick="return confirm('Delete this video?');">Delete</button>
        </div>
      </form>
    <?php } ?>

    <h3>Add video</h3>
    <form method="post" class="card" style="margin:10px 0;">
      <?php renderCsrfField(); ?>
      <div class="grid">
        <select name="slot">
          <option value="1">Slot 1</option>
          <option value="2">Slot 2</option>
          <option value="3">Slot 3</option>
        </select>
        <input type="text" name="title" placeholder="Title">
        <input type="text" name="youtube_url" placeholder="YouTube URL" required>
        <label><input type="checkbox" name="is_active" value="1" checked> active</label>
      </div>
      <button class="btn-save" type="submit" name="action" value="video_upsert">Add</button>
    </form>
  </section>
</div>
</body>
</html>
