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
					<?php
					$favoriteTracks = fetchFavoriteTracks(6);
					if (!empty($favoriteTracks)) {
						foreach ($favoriteTracks as $track) {
							$title = htmlspecialchars($track['title'] ?? 'Track', ENT_QUOTES, 'UTF-8');
							$mp3Url = htmlspecialchars($track['mp3_url'] ?? '', ENT_QUOTES, 'UTF-8');

							echo '<div class="audio-title">';
							echo '<p class="replay-title">' . $title . '</p>';
							echo '<audio class="audio-class" controls src="' . $mp3Url . '">Your browser does not support the<code>audio</code> element.</audio>';
							echo '</div>';
						}
					} else {
					?>
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
					<?php } ?>
				</div>

			</div>

