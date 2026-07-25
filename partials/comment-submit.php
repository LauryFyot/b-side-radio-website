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

		$localConfigPath = __DIR__ . '/smtp-config.php';
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

  if(isset($_POST['Submit'])){

	$Name = isset($_POST['Name']) ? trim($_POST['Name']) : '';
	$Comment = isset($_POST['Comment']) ? trim($_POST['Comment']) : '';
    
    setlocale(LC_TIME, 'fr','fr_FR','fr_FR@euro','fr_FR.utf8','fr-FR','fra');
    $months_list = array('janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre');
    $day = strftime("%d"); 
    $nb_month = date("n");
    $year = strftime("%Y");
    $hour = date("G");
    $minutes = date("i");
    $r=rand(1,4);

	#To exclude
	$words = array('http', '% off', '.com', 'buy now', 'telegram', 'crypto', '@cryptaxbot', 'robot');
	$badWordsPattern = '/(' . implode('|', array_map('preg_quote', $words)) . ')/i';
	$hasBadWord = preg_match($badWordsPattern, $Comment) === 1;

	if ($Name !== '' && strlen($Name) <= 80 && strlen($Comment) < 500 && !isHTML($Name) && !isHTML($Comment) && !$hasBadWord) {

		$safeName = htmlspecialchars($Name, ENT_QUOTES, 'UTF-8');
		$safeComment = nl2br(htmlspecialchars($Comment, ENT_QUOTES, 'UTF-8'), false);

	    $handle = fopen("comments.txt","a");
	    fwrite($handle, "<div class=\"comments-content\"><div class=\"left\"><img src=\"assets/images/Icon_user_".$r.".png\" class=\"icon-user\" width=\"70\" height=\"70\"></div><div class=\"right\"><h1 class=\"name-comments\">".$safeName."</h1><p class=\"date-comments\">".$day." ".$months_list[$nb_month-1]." ".$year." à ".$hour."h".$minutes."</p><p class=\"comment-comments\">".$safeComment."</p></div></div>\n\n\n\n");
	    fclose($handle);

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

		echo '<script type="text/javascript">window.location.replace(window.location.pathname + window.location.search + window.location.hash );</script>';
	}
    
  }
?>