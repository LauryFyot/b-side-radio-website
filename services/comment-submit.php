<?php

function isHTML($string){
    return $string != strip_tags($string) ? true : false;
}

function redirectAfterPost(){
    $target = $_SERVER['REQUEST_URI'] ?? '/';
    if (!headers_sent()) {
        header('Location: ' . $target);
        exit;
    }

    echo '<script type="text/javascript">window.location.replace(window.location.pathname + window.location.search + window.location.hash );</script>';
    exit;
}

if (isset($_POST['Submit'])) {
    $Name = isset($_POST['Name']) ? trim($_POST['Name']) : '';
    $Comment = isset($_POST['Comment']) ? trim($_POST['Comment']) : '';
    $Website = isset($_POST['Website']) ? trim($_POST['Website']) : '';

    $words = array('http', '% off', '.com', 'buy now', 'telegram', 'crypto', '@cryptaxbot', 'robot');
    $badWordsPattern = '/(' . implode('|', array_map('preg_quote', $words)) . ')/i';
    $hasBadWord = preg_match($badWordsPattern, $Comment) === 1;

    if ($Website !== '') {
        redirectAfterPost();
    }

    if ($Name !== '' && strlen($Name) <= 80 && strlen($Comment) < 500 && !isHTML($Name) && !isHTML($Comment) && !$hasBadWord) {
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
        $ipHash = $ipAddress !== '' ? hash('sha256', $ipAddress) : null;
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

        $commentSaved = insertPendingComment($Name, $Comment, $ipHash, $userAgent);
        if (!$commentSaved) {
            redirectAfterPost();
        }
    }

    redirectAfterPost();
}
