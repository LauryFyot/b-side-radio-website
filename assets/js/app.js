// BANNER OVERLAY

$(document).ready(function(){
	$(window).scroll(function(){
		$('.banner-overlay').css("opacity", $(window).scrollTop() / 500)
	})
});


// $(document).ready(function(){
//     $(this).scrollTop(0);
// });


//---------------------------------------------

music_name = "http://91.134.242.174:8000/stream"
let play_btn = document.querySelector("#play");
let prev_btn = document.querySelector("#pre");
let next_btn = document.querySelector("#next");
let range = document.querySelector("#range");
let play_img = document.querySelector("#play_img")
let total_time = 0;
let currentTime = 0;
let isPlaying = false;
let song = new Audio();
window.onload = playSong;

function playSong(){
    song.src = music_name;
    console.log(song)
    
    
    play_btn.addEventListener('click',function(){
        if(!isPlaying){
            song.play();
            isPlaying = true;
            total_time = song.duration;
            range.max = total_time;
            play_img.src = "assets/images/pause.png";
        }else{
            song.pause();
            isPlaying = false;
            play_img.src = "assets/images/play.png";
        }
       song.addEventListener('ended',function(){
            song.currentTime = 0
            song.pause();
            isPlaying = false;
            range.value = 0;
            play_img.src = "assets/images/play.png";
        })
        // song.addEventListener('timeupdate',function(){
        //     range.value = song.currentTime;
        // })
        // range.addEventListener('change',function(){
        //     song.currentTime = range.value;
        // })
       
    })
}

$(function() {
  AOS.init();
});


// function open(){
//                     var hamburger = document.querySelector(".hamburger");
//                     var navbar = document.querySelector(".navbar");
//                     var links = document.querySelectorAll(".navbar a");

//                     hamburger.addEventListener("click", () => {
//                         navbar.classList.toggle("open");
//                     });


// function closeMenu(){
//     document.getElementById("checker").checked = true;
// }