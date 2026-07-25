			<div class="videos" id="videos">
			<h1 class="team-title" data-aos="fade-in" data-aos-duration="500" id="team">Pleasure</h1>
				<div class="videos-container">
					<?php
					$featuredVideos = fetchFeaturedVideos(3);
					if (!empty($featuredVideos)) {
						foreach ($featuredVideos as $video) {
							$embedUrl = toYoutubeEmbedUrl($video['youtube_url'] ?? '');
							if ($embedUrl === '') {
								continue;
							}

							echo '<div class="column-ytb">';
							echo '<iframe class="ytb" src="' . htmlspecialchars($embedUrl, ENT_QUOTES, 'UTF-8') . '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
							echo '</div>';
						}
					} else {
					?>
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
					<?php } ?>
				</div>
			</div>
