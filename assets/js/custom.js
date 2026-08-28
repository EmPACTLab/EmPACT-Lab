/*
Theme: eLearning - Free Educational Responsive Web Template
Description: Free to use for personal and commercial use
Author: WebThemez.com
Website: http://webthemez.com
Note: Please do not remove the footer backlink (webthemez.com)--(if you want to remove contact: webthemez@gmail.com)
Licence: Creative Commons Attribution 3.0** - http://creativecommons.org/licenses/by/3.0/
*/
jQuery(document).ready(function ($) {
    // da slider - removed as cslider plugin is not loaded
    // Set the carousel options
    $('#quote-carousel').carousel({
        pause: true,
        interval: 4000,
    });
    // fancybox - removed as fancybox plugin is not loaded
    //isotope
    if ($('.isotopeWrapper').length) {
        var $container = $('.isotopeWrapper');
        var $resize = $('.isotopeWrapper').attr('id');
        // initialize isotope
        $container.isotope({
            itemSelector: '.isotopeItem',
            resizable: false, // disable normal resizing
            masonry: {
                columnWidth: $container.width() / $resize
            }
        });
        $("a[href='#top']").click(function () {
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
            return false;
        });
        // Close mobile menu when clicking on a link (not the toggle button)
        $('.navbar-inverse').on('click', 'ul.nav li a', function () {
            $('.navbar-inverse .in').addClass('collapse').removeClass('in').css('height', '1px');
        });
        $('#filter a').click(function () {
            $('#filter a').removeClass('current');
            $(this).addClass('current');
            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 1000,
                    easing: 'easeOutQuart',
                    queue: false
                }
            });
            return false;
        });
        $(window).smartresize(function () {
            $container.isotope({
                // update columnWidth to a percentage of container width
                masonry: {
                    columnWidth: $container.width() / $resize
                }
            });
        });
    }
});

// Give each secondary page banner a random research image on every visit.
(function () {
    var secondaryBanner = document.querySelector('#head.secondary');
    if (!secondaryBanner) return;

    var homepageImages = [
		'assets/homepage_images/eee1.webp',
		'assets/homepage_images/hive1.webp',
		'assets/homepage_images/hive2.webp',
		'assets/homepage_images/hive3.webp',
		'assets/homepage_images/robot1.webp'
    ];
    var selectedImage = homepageImages[Math.floor(Math.random() * homepageImages.length)];

    secondaryBanner.style.backgroundImage = 'url("' + selectedImage + '")';
    secondaryBanner.style.backgroundPosition = 'center';
    secondaryBanner.style.backgroundSize = 'cover';
})();
