<!DOCTYPE html>

<html>
	<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-3SNWYSPZ5Z"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-3SNWYSPZ5Z');
</script>
		<title>BsideRadio</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1">
		<link rel="stylesheet" type="text/css" href="style.css?ver=<?php echo rand(111,999)?>">
		<link href="https://cdn.rawgit.com/michalsnik/aos/2.1.1/dist/aos.css" rel="stylesheet">
		<link rel="icon" type="image/png" href="IMAGES/bside_icon.png" />
		<script src="https://kit.fontawesome.com/7be63d8904.js" crossorigin="anonymous"></script>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/5.3.8/css/swiper.min.css">
		<style>

.swiper-container {
    	width: 90%;
    	padding-top: 50px;
    	padding-bottom: 50px;
		/* background-color: #000; */
		}

		.swiper-container2 {
    	width: 90%;
    	padding-top: 50px;
    	padding-bottom: 50px;
		/* background-color: #000; */
		}

		.swiper-slide {
    	background-position: center;
    	background-size: cover;
    	width: 300px;
    	height: 450px;
    	background: #000;
		}

		.swiper-slide2 {
    	background-position: center;
    	background-size: cover;
    	width: 250px;
    	height: 250px;
    	background: #000;
		}

		.swiper-button-next, .swiper-button-prev {
			height: 70px;
			width: 70px;
			color: #FCFCFC;
			background-color: #262626;
			border-radius: 70px;
		}
 		</style>
	</head>

	<body>
		<header>
			<div class="wrapper-header" id="home-anchor">
				<div class="logo">
					<a href="">BsideRadio</a>
				</div>

				<label for="checker" class="checkbtn">&#9776</label>
				<input type="checkbox" id="checker">

				<nav class="navbar">
					<a class="nav-item" href="#home-anchor" onclick="closeMenu()">Home</a>
					<a class="nav-item" href="#player-anchor" onclick="closeMenu()">Player</a>
					<a class="nav-item" href="#prog-anchor" onclick="closeMenu()">Programmation</a>
					<a class="nav-item" href="#replay-mix" onclick="closeMenu()">Replay</a>
					<a class="nav-item" href="#sessions-mix" onclick="closeMenu()">Mixes Session</a>
					<a class="nav-item" href="#socials" onclick="closeMenu()">Réseaux</a>
					<a class="nav-item" href="#comments" onclick="closeMenu()">CTKoi</a>
					<a class="nav-item" href="#videos" onclick="closeMenu()">Vidéos</a>
				</nav>
				<script type="text/javascript">
					function closeMenu(){
    					document.getElementById("checker").checked = false;
					}
				</script>
			</div>
		</header>

		<div class="banner-area">
			<div class="banner-overlay"></div>	
		</div>
		<div class="banner-content"  id="player-anchor">
				<img class="logo-img" src="IMAGES/bside_logo.png">
				<div class="welcome">
					<p class="p-title">Bienvenue sur</p>
					<h1 class="banner-title">B Side Radio.com</h1>
				</div>
			</div>
			<div class="onair">
				<div class="sliding" data-aos="fade-left" data-aos-duration="600">
					<div class="sliding-rtl">
						<p>Only mashups & remixes</p>
					</div>
				</div>
				<div class="onair2">
					<div class="container-onair">
						<div class="bars">
                            <div class="bar" style="background-color:white;"></div>
							<div class="bar" style="background-color:white;"></div>
							<div class="bar" style="background-color:white;"></div>
						</div>
						<p class="onair-title">OnAir</p>
					</div>
					<div class="marquee">
						<div class="marquee-rtl">
							<div>B Side Radio is LIVE !</div>
						</div>
					</div>
				</div>
			
		</div>

		<div class="content-area">



			<div class="player">
				<div class="right-player">
					<div class="container-player">
		        		<div class="wrapper-player">
					        <h1>BsidePlayer</h1>
					        <img src="IMAGES/bsidedesign.png" class="player-img">
					        <input id="range" class="level" type="range" value="0" min="0">
					           	<div class="buttons-player">
					               	<!-- <button id="pre"><img src="IMAGES/rewind.png"></button> -->
					               	<button id="play"><img id="play_img" src="IMAGES/play.png"></button>
					               	<!-- <button id="next"><img src="IMAGES/fast-forward.png"></button> -->
					           	</div>
	       		    	</div>
	       			</div>
       			</div>
       			<div class="player-announcement" data-aos="fade-in" data-aos-duration="1000">
       				<h1>Listen to BsideRadio.com</h1>
					<!-- <h2 class="fashion" style="font-size:20px;">The Fashion Mashup</h2> -->
					<img src="IMAGES/fashion_mashup.png" width="240" height="70" class="fashionmashup">
       				<h2>Vous écoutez B.Side.Radio.com tous les jours et sans publicités <strong>toute la journée</strong>.<br> Les meilleurs MashUps & remiXes des années 80 à aujourd’hui. <br> Mixes lives tous les vendredis et samedis soirs en mode Funky House & House.</h2>
       			</div>
			</div>
        
            <h1 class="this_week-title" data-aos="fade-in" data-aos-duration="700" id="sessions-mix">This week</h1>
            <div class="mix-session">
                <div class="swiper-container2 swiper-container" data-aos="fade-in" data-aos-duration="2000">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/7.jpg" width="250" height="250">
                        </div>
                        <div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/8.jpg" width="250" height="250">
                        </div>
                        <div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/9.jpg" width="250" height="250">
                        </div>
                        <div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/10.jpg" width="250" height="250">
                        </div>
                        <div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/1.jpg" width="250" height="250">
                        </div>
                        <div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/2.jpg" width="250" height="250">
                        </div>
                        <div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/3.jpg" width="250" height="250">
                        </div>
                        <div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/4.jpg" width="250" height="250">
                        </div>
                        <div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/5.jpg" width="250" height="250">
                        </div>
                        <div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/6.jpg" width="250" height="250">
                        </div>
                    </div>
                    <!-- <div class="swiper-pagination"></div> -->
                    <div class="swiper-button-next swiper-button-next2"></div>
                    <div class="swiper-button-prev swiper-button-prev2"></div>
                </div>
            </div>

			<div class="prog-wrapper" id="prog-anchor">
				<h1 class="prog-title" data-aos="fade-in" data-aos-duration="500">Programmation</h1>
				<div class="programmation">
					<div class="module" data-aos="fade-up" data-aos-duration="1000">
						<div class="imgBox">
							<img src="https://picsum.photos/300?random=1" width="250" height="250">
						</div>
						<div class="details">
							<h1>Wake-Up</h1>
							<h2>7h/9h</h2>
							<p>Les douceurs B side radio.com pour commencer une belle journée</p>
						</div>
					</div>
					<div class="module" data-aos="fade-up" data-aos-duration="600">
						<div class="imgBox">
							<img src="https://picsum.photos/300?random=2" width="250" height="250">
						</div>
						<div class="details">
							<h1>Tonik Time</h1>
							<h2>9h/10h</h2>
							<p>Les meilleurs titres & l'actu de B side radio.com</p>
						</div>
					</div>
					<div class="module" data-aos="fade-up" data-aos-duration="400">
						<div class="imgBox">
							<img src="https://picsum.photos/300?random=3" width="250" height="250">
						</div>
						<div class="details">
							<h1>Hello Time</h1>
							<h2>10h/16h</h2>
							<p>Tout B Side pour passer une bonne journée</p>
						</div>
					</div>
					<div class="module" data-aos="fade-up" data-aos-duration="1000">
						<div class="imgBox">
							<img src="https://picsum.photos/300?random=4" width="250" height="250">
						</div>
						<div class="details">
							<h1>Funky Zone</h1>
							<h2>16h/18h</h2>
							<p>Les grands standards de Funk en mode remix & mashups</p>
						</div>
					</div>
					<div class="module" data-aos="fade-up" data-aos-duration="1000">
						<div class="imgBox">
							<img src="https://picsum.photos/300?random=5" width="250" height="250">
						</div>
						<div class="details">
							<h1>Klub singles <span class="bywho">by Eddy</span></h1>
							<h2>18h/19h</h2>
							<p>Les meilleurs remixes et mashups de la semaine</p>
						</div>
					</div>
					<div class="module" data-aos="fade-up" data-aos-duration="400">
						<div class="imgBox">
							<img src="https://picsum.photos/300?random=6" width="250" height="250">
						</div>
						<div class="details">
							<h1>Klub singles <span class="bywho">by DjBart</span></h1>
							<h2>19h/20h</h2>
							<p>L'actu club de la semaine</p>
						</div>
					</div>
					<div class="module" data-aos="fade-up" data-aos-duration="600">
						<div class="imgBox">
							<img src="https://picsum.photos/300?random=7" width="250" height="250">
						</div>
						<div class="details">
							<h1>B Side Klub</span></h1>
							<h2>20h/7h sem.</h2>
							<h2>03h/7h we.</h2>
							<p>Le son klub by B Side Radio</p>
						</div>
					</div>
					<div class="module" data-aos="fade-up" data-aos-duration="1000">
						<div class="imgBox">
							<img src="https://picsum.photos/300?random=8" width="250" height="250">
						</div>
						<div class="details">
							<h1>24/7</span></h1>
							<h2></h2>
							<p>Du son toute la journée !</p>
						</div>
					</div>
				</div>
			</div>

			<h1 class="mix-session-title" data-aos="fade-in" data-aos-duration="700" id="replay-mix">Replay</h1>
			<div class="replay-container">
				<div class="replay-content">
					<div class="container-onair">
						<div class="bars replaybars">
							<div class="bar replaybar"></div>
							<div class="bar replaybar"></div>
							<div class="bar replaybar"></div>
						</div>
					</div>
					<p class="replay-text">Tous les dimanches de <strong>14h</strong> à <strong>20h</strong><br>Ecoutez le replay du samedi soir<br>6h de mix <strong>NON STOP</strong></p>
				</div>
			</div>
			<div id="trait_dessus"></div>

			<h1 class="mix-session-title" data-aos="fade-in" data-aos-duration="700" id="sessions-mix">Mixes Sessions</h1>
			<div class="mix-session">
				
				<div class="swiper-container" data-aos="fade-in" data-aos-duration="2000">
				    <div class="swiper-wrapper">
				        <div class="swiper-slide" style="background-image:url(https://picsum.photos/300/450?random=9)">
				        	<h1 class="session-title">Vendredi<br>19h/03h</h1>
				        	<p class="session-para">Tous les vendredis soirs de 19h à 3h du mat, Mix Live pendant 8h. 8 sets d’1h en mode Hits Mix , Funky House & House, mixés par ByEddy</p>
				        </div>
				        <div class="swiper-slide" style="background-image:url(https://picsum.photos/300/450?random=10)">
				      		<h1 class="session-title">Samedi<br>19h/03h</h1>
				        	<p class="session-para">Tous les samedis soirs dès 19h, retrouvez toutes les nouveautés Funky House & house de la semaine , mixées par DJ BART, ByEddy et DJ Le Cyr</p>
				        </div>
				        <div class="swiper-slide" style="background-image:url(https://picsum.photos/300/450?random=11)">
				      		<h1 class="session-title">Mardi<br>21h/22h</h1>
				        	<p class="session-para">Jackin hour ByEddy 1h en Mix Live. A écouter absolument !</p>
				        </div>
				    </div>
				    <!-- <div class="swiper-pagination"></div> -->
					<div class="swiper-button-next"></div>
					<div class="swiper-button-prev"></div>
				</div>

                <div class="audio-replay">
					<div class="audio-title">
						<p class="replay-title">Mix ByEddy</p> 
						<audio class="audio-class" controls src="http://byeddy.free.fr/MIXES/BSR_byeddy_1.mp3">Your browser does not support the<code>audio</code> element.</audio>
					</div>
					<div class="audio-title">
						<p class="replay-title">Mix ByEddy</p> 
						<audio class="audio-class" controls src="http://byeddy.free.fr/MIXES/BSR_byeddy_2.mp3">Your browser does not support the<code>audio</code> element.</audio>
					</div>
					<div class="audio-title">
						<p class="replay-title">Mix DJ Bart</p>
						<audio controls src="http://byeddy.free.fr/MIXES/BSR_djbart_1.mp3">Your browser does not support the<code>audio</code> element.</audio>
					</div>
					<div class="audio-title">
						<p class="replay-title">Mix DJ Bart</p>
						<audio controls src="http://byeddy.free.fr/MIXES/BSR_djbart_2.mp3">Your browser does not support the<code>audio</code> element.</audio>
					</div>
					
					<div class="audio-title">
						<p class="replay-title">Mix DJ LeCyr</p>
						<audio controls src="http://byeddy.free.fr/MIXES/BSR_djlecyr_1.mp3">Your browser does not support the<code>audio</code> element.</audio>
					</div>
					<div class="audio-title">
						<p class="replay-title">Mix DJ LeCyr</p>
						<audio controls src="http://byeddy.free.fr/MIXES/BSR_djlecyr_2.mp3">Your browser does not support the<code>audio</code> element.</audio>
					</div>
				</div>

			</div>

			<div class="team-background">
			<h1 class="team-title" data-aos="fade-in" data-aos-duration="500" id="team">Team</h1>
				<div class="team-wrapper" data-aos="fade-up" data-aos-duration="500">
					<div class="member">
						<div class="member-photo-wrapper">
							<div class="member-photo"><img src="IMAGES/BYEDDY_photo.png" width="170" height="170"></div>
						</div>
						<h1 class="member-name">ByEddy</h1>
						<p class="member-text">Jackin & Deep house Master</p>
						<div class="member-social-links">
							<a class="social-button"><span class="fa fa-twitter"></span></a>
							<a class="social-button"><span class="fa fa-facebook"></span></a>
							<a class="social-button"><span class="fab fa-instagram"></span></a>
						</div>
					</div>
					<div class="member">
						<div class="member-content">
							<div class="member-photo-wrapper">
								<div class="member-photo"><img src="IMAGES/BART_photo.png" width="170" height="170"></div>
							</div>
							<h1 class="member-name">DJ Bart</h1>
							<p class="member-text">L'âme de la funky house</p>
							<div class="member-social-links">
								<a class="social-button"><span class="fa fa-twitter"></span></a>
								<a class="social-button"><span class="fa fa-facebook"></span></a>
								<a class="social-button"><span class="fab fa-instagram"></span></a>
							</div>
						</div>	
					</div>
					<!-- <div class="member">
						<div class="member-photo-wrapper">
							<div class="member-photo"><img src="IMAGES/MKD_photo.png" width="170" height="170"></div>
						</div>
						<h1 class="member-name">MKD</h1>
						<p class="member-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
						<div class="member-social-links">
							<a class="social-button"><span class="fa fa-twitter"></span></a>
							<a class="social-button"><span class="fa fa-facebook"></span></a>
							<a class="social-button"><span class="fab fa-instagram"></span></a>
						</div>
					</div> -->
					<div class="member">
						<div class="member-photo-wrapper">
							<div class="member-photo"><img src="IMAGES/LECYR_photo.png" width="170" height="170"></div>
						</div>
						<h1 class="member-name">DJ Le Cyr</h1>
						<p class="member-text">The master of Vintage Dance House</p>
						<div class="member-social-links">
							<a class="social-button"><span class="fa fa-twitter"></span></a>
							<a class="social-button"><span class="fa fa-facebook"></span></a>
							<a class="social-button"><span class="fab fa-instagram"></span></a>
						</div>
					</div>
				</div>
			</div>
			<div class="comments-background">
				<h1 class="comments-title" data-aos="fade-in" data-aos-duration="500" id="comments">Commentaires</h1>
				<div class="comments-wrapper">
					<div class="header-comments">
						<h1 class="header-comments-title">Last comments :</h1>
					</div>
					<div class="comments-list">
						<div id="comments-inner">
				   			<?php include "comments.txt"?>
				   		</div>
				    </div>
				</div>
				<div class="form-wrapper">
				<form action="" method="POST">
					<div class="segment">
    					<h1>Laissez nous un commentaire !</h1><br><p style="font-size:17px;">Demandez nous un titre !</p>
  					</div>
					<label>
			    		<input type="text" name="Name" class="Input" required placeholder="Name"/>
			    	</label>
			   		<br><br>
			   		<label class="text-comment"><br>
			    		<textarea name="Comment" class="Input" required placeholder="Comment"></textarea>
			   		</label>
			   		<br><br>
			   		<input type="submit" name="Submit" value="Submit" class="Submit">
			   	</form>
			    </div>
			</div>
			<div id="trait_dessus"></div>
			<div class="socials" id="socials">
				<h1 class="socials-title" data-aos="fade-in" data-aos-duration="500" id="socials">Réseaux Sociaux</h1>
				<div class="socials-wrapper">
					<div class="fb socialcolumn">
					<img class="logo-social" src="IMAGES\fblogo.png">
						<div class="elementor-shortcode"><iframe class="facebook-widget" src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fb.side.radio.byeddy%2F&tabs=timeline&width=350&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" style="overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe></div>
					</div>
					<div class="insta-widget">
						<img class="logo-social" src="IMAGES\instalogo.svg">
						<!-- <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/CB0Y88ZDS99/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="12" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 50px; margin-top: 0px; margin-bottom: 0px; max-width:540px; min-width:200px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/CB0Y88ZDS99/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;"> Voir cette publication sur Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div></a> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/CB0Y88ZDS99/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">🇫🇷 Bienvenue sur le compte Instagram de BsideRadio ! Retrouvez sur b-side-radio.com ! Lien en bio 🇱🇷 Welcome to BsideRadio&#39;s Instagram account ! Find us on b-side-radio.com Link in bio !</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">Une publication partagée par @<a href="https://www.instagram.com/bsideradioparis/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px;" target="_blank"> bsideradioparis</a> le <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2020-06-24T12:55:24+00:00">24 Juin 2020 à 5 :55 PDT</time></p></div></blockquote> <script async src="//www.instagram.com/embed.js"></script> -->
						<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/COBlYzPqR2D/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="13" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/COBlYzPqR2D/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;"> Voir cette publication sur Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/COBlYzPqR2D/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">Une publication partagée par BsideRadio (@bside.radio)</a></p></div></blockquote> <script async src="//www.instagram.com/embed.js"></script>
					</div>

					<div class="twitter-widget">
						<img class="logo-social" src="IMAGES\twitterlogo.png">
						<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The new BSideRadio website is about to be launched!</p>&mdash; BsideRadio (@radio_bside) <a href="https://twitter.com/radio_bside/status/1384227169493164034?ref_src=twsrc%5Etfw">April 19, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
						<!-- <blockquote class="twitter-tweet" data-theme="light"><p lang="en" dir="ltr" style="margin-top: 0px;">I&#39;m trying to embed my tweet</p>&mdash; WhatTimeIsItBot (@whatimeisitbot) <a href="https://twitter.com/whatimeisitbot/status/1290221007026888705?ref_src=twsrc%5Etfw">August 3, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>					 -->
					</div>
				</div>
			</div>
			<div class="videos" id="videos">
			<h1 class="team-title" data-aos="fade-in" data-aos-duration="500" id="team">Pleasure</h1>
				<div class="videos-container">
					<div class="column-ytb">
						<iframe class="ytb" src="https://www.youtube.com/embed/FcQvsQstZEA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
					</div>
					<div class="column-ytb">
						<!-- <iframe class="ytb" src="https://www.youtube.com/embed/YVCvcRBmZAw" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
						<iframe class="ytb" src="https://www.youtube.com/embed/UuzImt46v2Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
					</div>
					<div class="column-ytb">
						<iframe class="ytb" src="https://www.youtube.com/embed/1-eYunUhSpo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
					</div>
				</div>
			</div>

			<!-- <footer>
				<div class="us-elements">
					<h1 class="follow-title">Follow us</h1>
					<a class="social-button-f"><span class="fa fa-twitter"></span></a>
					<a class="social-button-f"><span class="fa fa-facebook"></span></a>
					<a class="social-button-f"><span class="fab fa-instagram"></span></a>
					<h1 class="contact-title">Contact us</h1>
					<a class="btn_mail" href="mailto:bsideradiocontact@gmail.com">bsideradiocontact@gmail.com</a>
				</div>

				<div class="me-elements">
					<h1 class="me-one">Website made by <a class="oim" href="https://www.linkedin.com/in/laury-fyot-4539051b9/">Laury FYOT</a></h1>
					<h1 class="me-two">Copyright © BsideRadio - 2020 - Tous droits réservés</h1>
				</div>
			</footer> -->


			<!-- <footer>
				<div class="footer-container">
					<div class="footerinter">
						<div class="footer-main">
							<h1 class="footertitle bigtitle">BSide</h1>
							<p>Les meilleurs MashUps & remiXes des années 80 à aujourd’hui.<strong>Funky House & House</strong></p>
						</div>
						<div class="footer-small"></div>
					</div>
					<div></div>
					<div></div>
				</div>
			</footer> -->
			<footer class="footer">
    <nav class="footer__nav shuffle">
        <section class="footer__col footer__col--intro">
            <a class="footer__logo" href="/" data-footer-link="1">
                <!-- <svg width="90px" height="27px" viewBox="0 0 90 27" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="footer__logo-svg">
    <defs>
        <polygon id="envoy-logo-path-1" points="16.4473 0.613 0.9933 0.613 0.9933 26.9994 16.4473 26.9994 16.4473 0.613"></polygon>
    </defs>

    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(0.000000, -1.000000)">
            <polygon class="footer__logo-letter" points="84.5997 1.0004 81.9897 8.3624 79.3097 1.0004 74.0047 1.0004 79.5267 16.1634 79.5267 27.3874 84.5187 27.3874 84.5187 16.1524 89.8887 1.0004"></polygon>

            <polygon class="footer__logo-letter footer__logo-letter--e" points="0 1.0139 0 27.3879 13.674 27.3879 13.674 22.4559 4.991 22.4559 4.991 16.6669 10.96 16.6669 10.96 11.7349 4.991 11.7349 4.991 5.9459 13.674 5.9459 13.674 1.0139"></polygon>

            <polygon class="footer__logo-letter" points="28.7721 1.013 28.7721 14.13 23.4731 1.013 18.4631 1.013 18.4631 27.387 23.4561 27.387 23.4561 14.272 28.7541 27.387 33.7641 27.387 33.7641 1.013"></polygon>
            <g transform="translate(37.000000, 0.387500)">
                <path class="footer__logo-letter" d="M26.9531,26.9996 C22.7341,26.9996 19.3031,23.6086 19.3031,19.4406 L19.3031,8.1846 C19.3031,4.0166 22.7341,0.6256 26.9531,0.6256 C31.1711,0.6256 34.6031,4.0166 34.6031,8.1846 L34.6031,19.4406 C34.6031,23.6086 31.1711,26.9996 26.9531,26.9996 M26.9531,5.5586 C25.4871,5.5586 24.2941,6.7356 24.2941,8.1846 L24.2941,19.4406 C24.2941,20.8906 25.4871,22.0676 26.9531,22.0676 C28.4191,22.0676 29.6111,20.8906 29.6111,19.4406 L29.6111,8.1846 C29.6111,6.7356 28.4191,5.5586 26.9531,5.5586" id="Fill-4"></path>
                <g id="envoy-logo-Group-8">
                    <polygon class="footer__logo-letter" mask="url(#envoy-logo-mask-2)" points="11.3633 0.6124 8.7193 14.1384 6.0773 0.6124 0.9933 0.6124 6.1373 26.9994 11.3033 26.9994 16.4473 0.6124"></polygon>
                </g>
            </g>
        </g>
    </g>
</svg> -->
            </a>

            <p class="footer__slogan">
			Les meilleurs MashUps & remiXes des années 80 à aujourd’hui.
                <strong>Funky House & House</strong>
            </p>
        </section>

        <section class="footer__col">
            <div class="footer__col-wrap">
              <h4 class="footer__col-title">Explore</h4>

              <div class="footer__nav-list">
                <!-- <a href="#home" class="footer__link" data-footer-link="1">Home</a>
                <a href="/about" class="footer__link" data-footer-link="2">About</a>
                <a href="/capabilities" class="footer__link" data-footer-link="3">Capabilities</a>
                <a href="/careers" class="footer__link" data-footer-link="4">Careers</a> -->

					<a class="footer__link" href="#home-anchor">Home</a>
					<a class="footer__link" href="#player-anchor">Player</a>
					<a class="footer__link" href="#prog-anchor">Programmation</a>
					<a class="footer__link" href="#sessions-mix">Mixes Session</a>
					<a class="footer__link" href="#team">Team</a>
					<a class="footer__link" href="#socials">Réseaux</a>
					<a class="footer__link" href="#comments">CTKoi</a>
					<a class="footer__link" href="#videos">Vidéos</a>
              </div>
            </div>
        </section>

        <section class="footer__col">
            <div class="footer__col-wrap">
                <h4 class="footer__col-title">Visit</h4>

                <a class="footer__address" href="https://goo.gl/UJYasL" target="_blank">
                    <span class="footer__address-row">Paris, France</span>
					<span class="footer__address-row">Marseille, France</span>
                </a>

                <h4 class="footer__col-title footer__hide--small">Contact</h4>
                <a href="mailto:b.side.radio.com@gmail.com" class="footer__link footer__hide--small">b.side.radio.com@gmail.com</a>
                <a href="tel:9493333106" class="footer__link footer__hide--small">123.456.789</a>
            </div>
        </section>

        <section class="footer__col footer__col--mobile footer__hide--large">
            <div class="footer__col-wrap">
                <h4 class="footer__col-title">New Business</h4>
                <a href="mailto:b.side.radio.com@gmail.com" class="footer__link">Email us</a>
                <a href="tel:9493333106" class="footer__link">949.333.3106</a>
            </div>
        </section>

        <section class="footer__col">
            <div class="footer__col-wrap">
                <h4 class="footer__col-title">Follow</h4>
                <a href="#" target="_blank" class="footer__link no-barba">Facebook</a>
                <a href="#" target="_blank" class="footer__link no-barba">Twitter</a>
                <a href="#" target="_blank" class="footer__link no-barba">Instagram</a>
            </div>
        </section>

        <section class="footer__col">
            <div class="footer__col-wrap">
                <h4 class="footer__col-title">Legal</h4>
                <a href="#" class="footer__link">Terms</a>
                <a href="#" class="footer__link">Privacy</a>
            </div>
        </section>

        <section class="footer__col footer__col--next">
            <a href="#player-anchor" class="footer__btn" data-footer-link="2">
                <span>Go home ↑</span>

                <div class="footer__btn-line">
                    <div class="footer__btn-line-inner"></div>
                </div>
            </a>
        </section>

        <small class="footer__legal">&copy; 2021 BSideRadio. All Rights Reserved.</small>
    </nav>
  </footer>
			
		</div>

		

		<script src="https://code.jquery.com/jquery-3.5.1.js"></script>
		<script type="text/javascript" src="JAVASCRIPT/app.js"></script>
		<script src="https://cdn.rawgit.com/michalsnik/aos/2.1.1/dist/aos.js"></script>
		<script async defer crossorigin="anonymous" src="https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v7.0" nonce="V6jLDkf0"></script>
		<script type="text/javascript" src="path/to/instafeed.min.js"></script>
		<script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/5.3.8/js/swiper.min.js"></script>
		<script>
			function scrollTo(hash) {
				location.hash = "#" + hash;
			}
		</script>
	    <script>
		    var swiper = new Swiper('.swiper-container', {
		        effect: 'coverflow',
	            grabCursor: false,
	            speed: 800,
	            preventInteractionOnTransition: true,
	            centeredSlides: true,
	      		slidesPerView: 'auto',
				initialSlide: 1,
				keyboardControl: true,
				navigation: {
	      			nextEl: '.swiper-button-next',
	      			prevEl: '.swiper-button-prev',
	   			},
		        coverflowEffect: {
		        	rotate: 40,
		        	stretch: 0,
		        	depth: 100,
		        	modifier: 1,
		        	slideShadows: true,
		      	},
		        pagination: {
		        	el: '.swiper-pagination',
		        },
		        keyboard: {
				    enabled: true,
				    onlyInViewport: false,
	  			},
	  			slideToClickedSlide: true,
	  			fadeEffect: {
	    		crossFade: true
	  			},
		    });
	    </script>

        <script>
		    var swiper2 = new Swiper('.swiper-container2', {
		        effect: 'coverflow',
	            grabCursor: false,
	            speed: 800,
	            preventInteractionOnTransition: true,
	            centeredSlides: true,
	      		slidesPerView: 'auto',
				initialSlide: 4,
				keyboardControl: true,
				loop: true,
				navigation: {
	      			nextEl: '.swiper-button-next2',
	      			prevEl: '.swiper-button-prev2',
	   			},
		        coverflowEffect: {
		        	rotate: 40,
		        	stretch: 0,
		        	depth: 100,
		        	modifier: 1,
		        	slideShadows: true,
		      	},
		        keyboard: {
				    enabled: true,
				    onlyInViewport: false,
	  			},
	  			slideToClickedSlide: true,
	  			fadeEffect: {
	    		crossFade: true
	  			},
		    });
	    </script>
	</body>

	
</html>

<?php
	
	function isHTML($string){
		return $string != strip_tags($string) ? true:false;
	}

	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\SMTP;
	use PHPMailer\PHPMailer\Exception;

  if(isset($_POST['Submit'])){

    $Name = $_POST['Name'];
    $Comment = $_POST['Comment'];
    
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

    if (strlen($Comment) < 500 && !isHTML($Comment) && !preg_match('('.implode('|',$words).')', strtolower($Comment))) {

	    $handle = fopen("comments.txt","a");
	    fwrite($handle, "<div class=\"comments-content\"><div class=\"left\"><img src=\"IMAGES\Icon_user_".$r.".png\" class=\"icon-user\" width=\"70\" height=\"70\"></div><div class=\"right\"><h1 class=\"name-comments\">".$Name."</h1><p class=\"date-comments\">".$day." ".$months_list[$nb_month-1]." ".$year." à ".$hour."h".$minutes."</p><p class=\"comment-comments\">".$Comment."</p></div></div>\n\n\n\n");
	    fclose($handle);

		require_once 'PHPMailer/src/PHPMailer.php';
		require_once 'PHPMailer/src/SMTP.php';
		require_once 'PHPMailer/src/Exception.php';


	    $mail = new PHPMailer(true);
	    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
	    $mail ->isSMTP();
		$mail ->SMTPAuth = true;
		// $mail ->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
		$mail ->SMTPSecure = 'ssl';
		$mail ->Host = 'smtp.gmail.com';
		$mail ->Port = 465;
		$mail ->isHTML(true);
		$mail ->Username ='bsideradiocontact@gmail.com';
		$mail ->Password = 'B38side77radio';
		$mail ->Subject = 'New comment on bsideradio\'s website !';
		$mail ->Body = "$Name said : \r\n $Comment";
		$mail ->SetFrom('sefid@free.fr');
		$mail ->addAddress('bsideradiocontact@gmail.com');
		$mail ->send();

		echo '<script type="text/javascript">window.location.replace(window.location.pathname + window.location.search + window.location.hash );</script>';
	}
    
  }
?>