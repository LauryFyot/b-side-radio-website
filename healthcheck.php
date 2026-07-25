<?php
header('Content-Type: text/plain; charset=UTF-8');

$flags = array(
    'php_version' => PHP_VERSION,
    'sapi' => PHP_SAPI,
    'curl_extension' => function_exists('curl_init') ? 'enabled' : 'missing',
    'allow_url_fopen' => ini_get('allow_url_fopen') ? 'enabled' : 'disabled',
    'supabase_config_present' => is_file(__DIR__ . '/supabase-config.php') ? 'yes' : 'no',
    'smtp_config_present' => is_file(__DIR__ . '/smtp-config.php') ? 'yes' : 'no',
    'admin_config_present' => is_file(__DIR__ . '/admin-config.php') ? 'yes' : 'no',
    'index_present' => is_file(__DIR__ . '/index.php') ? 'yes' : 'no',
    'comments_data_present' => is_file(__DIR__ . '/partials/comments-data.php') ? 'yes' : 'no'
);

echo "B-Side healthcheck\n";
foreach ($flags as $key => $value) {
    echo $key . '=' . $value . "\n";
}
