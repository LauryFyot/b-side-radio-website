            <h1 class="this_week-title" data-aos="fade-in" data-aos-duration="700" id="sessions-mix">This week</h1>
            <div class="mix-session">
                <div class="swiper-container2 swiper-container" data-aos="fade-in" data-aos-duration="2000">
                    <div class="swiper-wrapper">
                        <?php
                        $majorCovers = fetchFeaturedCovers(40);
                        if (!empty($majorCovers)) {
                            foreach ($majorCovers as $cover) {
                                $imageUrl = normalizeAssetPath($cover['image_url'] ?? '');
                                if ($imageUrl === '') {
                                    continue;
                                }

                                $title = htmlspecialchars($cover['title'] ?? 'cover', ENT_QUOTES, 'UTF-8');
                                echo '<div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">';
                                echo '<img src="' . htmlspecialchars($imageUrl, ENT_QUOTES, 'UTF-8') . '" width="250" height="250" alt="' . $title . '">';
                                echo '</div>';
                            }
                        } else {
                        ?>
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
                            <img src="http://byeddy.free.fr/POCHETTES/10.jpg" width="250" height="250">
                        </div>
						<div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/11.jpg" width="250" height="250">
                        </div>
						<div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/12.jpg" width="250" height="250">
                        </div>
						<div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/13.jpg" width="250" height="250">
                        </div>
						<div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/14.jpg" width="250" height="250">
                        </div>
						<div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/15.jpg" width="250" height="250">
                        </div>
						<div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/16.jpg" width="250" height="250">
                        </div>
						<div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/17.jpg" width="250" height="250">
                        </div>
						<div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/18.jpg" width="250" height="250">
                        </div>
						<div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/19.jpg" width="250" height="250">
                        </div>
						<div class="swiper-slide swiper-slide2" style="height:250px;width:250px;">
                            <img src="http://byeddy.free.fr/POCHETTES/20.jpg" width="250" height="250">
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
                        <?php } ?>
                    </div>
                    <!-- <div class="swiper-pagination"></div> -->
                    <div class="swiper-button-next swiper-button-next2"></div>
                    <div class="swiper-button-prev swiper-button-prev2"></div>
                </div>
            </div>

