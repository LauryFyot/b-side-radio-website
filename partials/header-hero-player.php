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
