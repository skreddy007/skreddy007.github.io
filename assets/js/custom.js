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

		// Clearance between the sticky nav and a section heading.
		var NAV_HEADING_GAP = 16;

		function closedNavHeight() {
			var $nav = $('nav.navbar.bootsnav');
			var $menu = $('#navbar-menu');
			// The open mobile panel stretches the fixed nav. Measure the bar only.
			if ($menu.hasClass('in')) {
				return $('.navbar-header').outerHeight() || 0;
			}
			return $nav.outerHeight() || 0;
		}

		function headingLead() {
			var $section = $('#about');
			var $heading = $section.children('.section-heading').first();
			if (!$section.length || !$heading.length) {
				return 0;
			}
			return Math.max(0, $heading.offset().top - $section.offset().top);
		}

		function scrollPadding() {
			return closedNavHeight() + NAV_HEADING_GAP;
		}

		function scrollToSection(href) {
			var $target = $(href);
			if (!$target.length) {
				return;
			}
			var $heading = $target.find('.section-heading').first();
			var anchorTop = ($heading.length ? $heading : $target).offset().top;
			var top = Math.max(0, Math.round(anchorTop - scrollPadding()));
			var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			$('html, body').stop().animate({
				scrollTop: top
			}, reduceMotion ? 0 : 1200, 'easeInOutExpo', function () {
				$('body').scrollspy('process');
			});
		}

		function syncScrollspy() {
			// Activate when the heading clears the nav. The extra pixels cover
			// subpixel rounding so the highlighted link matches that heading.
			var offset = Math.max(1, scrollPadding() - headingLead() + 4);
			var $body = $('body');
			var data = $body.data('bs.scrollspy');
			if (!data) {
				$body.scrollspy({
					target: '.navbar-collapse',
					offset: offset
				});
				return;
			}
			data.options.offset = offset;
			$body.scrollspy('refresh');
			$body.scrollspy('process');
		}

		$('li.smooth-menu a').on('click', function (event) {
			event.preventDefault();
			var href = $(this).attr('href');
			var $menu = $('#navbar-menu');

			if ($menu.hasClass('in')) {
				var started = false;
				function go() {
					if (started) {
						return;
					}
					started = true;
					scrollToSection(href);
				}
				$('.navbar-toggle .fa').removeClass('fa-times').addClass('fa-bars');
				$menu.one('hidden.bs.collapse', go);
				$menu.collapse('hide');
				window.setTimeout(go, 450);
				return;
			}

			scrollToSection(href);
		});

		syncScrollspy();
		$(window).on('load', syncScrollspy);
		var scrollspyResizeTimer;
		$(window).on('resize', function () {
			window.clearTimeout(scrollspyResizeTimer);
			scrollspyResizeTimer = window.setTimeout(syncScrollspy, 150);
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
	