/* Theme toggle — persist in localStorage, follow OS when unset */
(function () {
	var STORAGE_KEY = "theme";
	var root = document.documentElement;

	function getPreferredTheme() {
		try {
			var stored = localStorage.getItem(STORAGE_KEY);
			if (stored === "light" || stored === "dark") {
				return stored;
			}
		} catch (err) {}
		return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}

	function syncToggles(theme) {
		var isDark = theme === "dark";
		var buttons = document.querySelectorAll(".theme-toggle");
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].setAttribute("aria-pressed", isDark ? "true" : "false");
			buttons[i].setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
		}
	}

	function applyTheme(theme, persist) {
		root.setAttribute("data-theme", theme);
		if (persist) {
			try {
				localStorage.setItem(STORAGE_KEY, theme);
			} catch (err) {}
		}
		syncToggles(theme);
	}

	function toggleTheme() {
		var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
		applyTheme(next, true);
	}

	applyTheme(getPreferredTheme(), false);

	function bindToggles() {
		var buttons = document.querySelectorAll(".theme-toggle");
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].addEventListener("click", toggleTheme);
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bindToggles);
	} else {
		bindToggles();
	}

	if (window.matchMedia) {
		var media = window.matchMedia("(prefers-color-scheme: dark)");
		var onChange = function (event) {
			try {
				if (localStorage.getItem(STORAGE_KEY)) {
					return;
				}
			} catch (err) {}
			applyTheme(event.matches ? "dark" : "light", false);
		};
		if (media.addEventListener) {
			media.addEventListener("change", onChange);
		} else if (media.addListener) {
			media.addListener(onChange);
		}
	}
})();

$(document).ready(function(){
	"use strict";
    
        /*==================================
* Author        : "ThemeSine"
* Template Name : Khanas HTML Template
* Version       : 1.0
==================================== */



/*=========== TABLE OF CONTENTS ===========
1. Scroll To Top 
2. Smooth Scroll spy
3. Progress-bar
4. owl carousel
5. welcome animation support
======================================*/

    // 1. Scroll To Top 
		$(window).on('scroll',function () {
			if ($(this).scrollTop() > 600) {
				$('.return-to-top').fadeIn();
			} else {
				$('.return-to-top').fadeOut();
			}
		});
		$('.return-to-top').on('click',function(){
				$('html, body').animate({
				scrollTop: 0
			}, 1500);
			return false;
		});
	
	
	
	// 2. Smooth Scroll spy
		
		$('.header-area').sticky({
           topSpacing:0
        });
		
		//=============

		$('li.smooth-menu a').bind("click", function(event) {
			event.preventDefault();
			var anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $(anchor.attr('href')).offset().top - 0
			}, 1200,'easeInOutExpo');
		});
		
		$('body').scrollspy({
			target:'.navbar-collapse',
			offset:0
		});

	// 3. Progress-bar
	
		var dataToggleTooTip = $('[data-toggle="tooltip"]');
		var progressBar = $(".progress-bar");
		if (progressBar.length) {
			progressBar.appear(function () {
				dataToggleTooTip.tooltip({
					trigger: 'manual'
				}).tooltip('show');
				progressBar.each(function () {
					var each_bar_width = $(this).attr('aria-valuenow');
					$(this).width(each_bar_width + '%');
				});
			});
		}
	
	// 4. owl carousel
	
		// i. client (carousel)
		
			$('#client').owlCarousel({
				items:7,
				loop:true,
				smartSpeed: 1000,
				autoplay:true,
				dots:false,
				autoplayHoverPause:true,
				responsive:{
						0:{
							items:2
						},
						415:{
							items:2
						},
						600:{
							items:4

						},
						1199:{
							items:4
						},
						1200:{
							items:7
						}
					}
				});
				
				
				$('.play').on('click',function(){
					owl.trigger('play.owl.autoplay',[1000])
				})
				$('.stop').on('click',function(){
					owl.trigger('stop.owl.autoplay')
				})


    // 5. welcome animation support

        var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduceMotion) {
            $(window).load(function(){
                $(".header-text h2,.header-text p").removeClass("animated fadeInUp").css({'opacity':'0'});
                $(".header-text a").removeClass("animated fadeInDown").css({'opacity':'0'});
            });

            $(window).load(function(){
                $(".header-text h2,.header-text p").addClass("animated fadeInUp").css({'opacity':'0'});
                $(".header-text a").addClass("animated fadeInDown").css({'opacity':'0'});
            });
        }

});	
	