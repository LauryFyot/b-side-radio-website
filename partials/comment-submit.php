<?php
	
	function isHTML($string){
		return $string != strip_tags($string) ? true:false;
	}

	function loadSmtpConfig(){
		$config = array(
			'host' => getenv('SMTP_HOST') ?: '',
			'port' => getenv('SMTP_PORT') ?: '465',
			'secure' => getenv('SMTP_SECURE') ?: 'ssl',
			'username' => getenv('SMTP_USERNAME') ?: '',
			'password' => getenv('SMTP_PASSWORD') ?: '',
			'from_email' => getenv('SMTP_FROM_EMAIL') ?: '',
			'to_email' => getenv('SMTP_TO_EMAIL') ?: ''
		);

		$localConfigPath = dirname(__DIR__) . '/smtp-config.php';
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

		return $config;
	}

	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\SMTP;
	use PHPMailer\PHPMailer\Exception;

	function redirectAfterPost(){
		$target = $_SERVER['REQUEST_URI'] ?? '/';
		if (!headers_sent()) {
			header('Location: ' . $target);
			exit;
		}

		echo '<script type="text/javascript">window.location.replace(window.location.pathname + window.location.search + window.location.hash );</script>';
		exit;
	}

  if(isset($_POST['Submit'])){

	$Name = isset($_POST['Name']) ? trim($_POST['Name']) : '';
	$Comment = isset($_POST['Comment']) ? trim($_POST['Comment']) : '';
	$Website = isset($_POST['Website']) ? trim($_POST['Website']) : '';
    
    setlocale(LC_TIME, 'fr','fr_FR','fr_FR@euro','fr_FR.utf8','fr-FR','fra');
    $months_list = array('janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre');
	#To exclude
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

		require_once 'PHPMailer/src/PHPMailer.php';
		require_once 'PHPMailer/src/SMTP.php';
		require_once 'PHPMailer/src/Exception.php';


		$smtpConfig = loadSmtpConfig();
		$requiredSmtpKeys = array('host', 'port', 'secure', 'username', 'password', 'from_email', 'to_email');
		$canSendMail = true;
		foreach ($requiredSmtpKeys as $key) {
			if (empty($smtpConfig[$key])) {
				$canSendMail = false;
				break;
			}
		}

		if ($canSendMail) {
			try {
				$mail = new PHPMailer(true);
				$mail->SMTPDebug = SMTP::DEBUG_OFF;
				$mail->isSMTP();
				$mail->SMTPAuth = true;
				$mail->SMTPSecure = $smtpConfig['secure'];
				$mail->Host = $smtpConfig['host'];
				$mail->Port = (int)$smtpConfig['port'];
				$mail->isHTML(false);
				$mail->Username = $smtpConfig['username'];
				$mail->Password = $smtpConfig['password'];
				$mail->Subject = 'New comment on bsideradio\'s website !';
				$mail->Body = $Name . " said:\n" . $Comment;
				$mail->setFrom($smtpConfig['from_email']);
				$mail->addAddress($smtpConfig['to_email']);
				$mail->send();
			} catch (Exception $e) {
				error_log('Mail send failed: ' . $mail->ErrorInfo);
			}
		} else {
			error_log('SMTP configuration missing. Comment saved without email notification.');
		}
	}

	redirectAfterPost();
    
  }
?>