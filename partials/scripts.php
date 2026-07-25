		<script src="https://code.jquery.com/jquery-3.5.1.js"></script>
		<script type="text/javascript" src="assets/js/app.js"></script>
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

