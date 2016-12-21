var onYouTubePlayerAPIReady;

(function(){
    var headerModuleWrapper = $('.header-module-wrapper');
    if (headerModuleWrapper.length) {
        var youtubeFrame = $('.ytplayer');
        if (youtubeFrame.length) {

            var isMobile = {
                Android: function() {
                    return navigator.userAgent.match(/Android/i);
                },
                BlackBerry: function() {
                    return navigator.userAgent.match(/BlackBerry/i);
                },
                iOS: function() {
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                },
                Opera: function() {
                    return navigator.userAgent.match(/Opera Mini/i);
                },
                Windows: function() {
                    return navigator.userAgent.match(/IEMobile/i);
                },
                any: function() {
                    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                }
            };

            if( isMobile.any() && window.matchMedia("(min-width: 642px)").matches == false){
                isMobile = true;
            }
            else {
                isMobile = false;
            }

            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/player_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            onYouTubePlayerAPIReady = function() {
                youtubeFrame.each(function(i){
                    var $this = $(this);
                    if ($this.closest('.header-module').hasClass('desktop') && isMobile) {
                        return;
                    }
                    var module = $this.closest('.header-module');
                    var text = module.find('.text');
                    text.css('z-index', 2);
                    var link =  module.find('.link');
                    link.css({
                        "z-index": 1,
                        "background-color": "black"
                    });
                    var id = "youtube-player" + i;
                    $this.attr('id', id);
                    var url = $(this).attr('data-url');
                    var isStarted = false;
                    var player = new YT.Player(id, {
                        videoId: url,
                        playerVars: { 'autoplay': 1, 'controls': 0, 'showinfo': 0, 'rel':0, "wmode": "transparent"},
                        events: {
                            onReady: function(e){
                                player.mute();
                                player.playVideo();
                                setInterval(function(){
                                    if(player.getCurrentTime() > player.getDuration()-0.05){
                                        player.seekTo(0);
                                    }
                                }, 20)
                            },
                            onStateChange: function(e){
                                if (!isStarted && e.data == YT.PlayerState.PLAYING) {
                                    text.css('z-index', 1);
                                    link.css('z-index', 2);
                                    link.fadeTo("slow", 0);
                                    isStarted = true;
                                }
                                if (e.data == YT.PlayerState.ENDED){
                                    player.playVideo();
                                }
                            }
                        }
                    });
                });
            }
        }
    }
})();

(function(){
    var upsModule = $('.ups-home-module');
    if (upsModule.length) {
        $(window).resize(function(){
            if (window.matchMedia("(min-width: 641px)").matches === false) {
                var ups = upsModule.find('.ups-col');
                var heightArray = $.map(ups, function(elem){
                    return $(elem).height();
                });
                var maxHeight = Math.max.apply(null, heightArray);
                upsModule.height(maxHeight);
            }
            else {
                upsModule.height('auto');
            }
        });
        $(window).trigger('resize');
    }
})();

function tabSwitcherHandler(element){
    var width = element.outerWidth();
    var switcher = element.siblings('.switch');
    element.siblings('.active').removeClass('active');
    element.addClass('active');
    switcher.css('width', width);
    var position = element.position().left;
    switcher.css('left', position);
}

var flightDealsSwiper;
var homeHeroSwiperObj = {
    desktop:{
        first: null,
        second: null
    },
    mobile: null
};

$(window).load(function(){
    var flightDeals = $('.flight-deals-module');

    if (flightDeals.length) {

        flightDealsSwiper =  new Swiper('.flight-deals-module .swiper-container', {
            pagination: '.flight-deals-module .swiper-pagination',
            paginationClickable: true,
            spaceBetween: 20,
            nextButton: '.flight-deals-module .swiper-button-next',
            prevButton: '.flight-deals-module .swiper-button-prev',
            loop: true,
            slidesPerView: 2,
            breakpoints: {
                641: {
                    slidesPerView: 1
                }
            }
        });
        var currentTab = flightDeals.find('.tabs li.active');
        tabSwitcherHandler(currentTab);

        $(document).on('click', '.flight-deals-module .tabs li', function(){
            var $this = $(this);
            if (!$this.hasClass('active')) {
                tabSwitcherHandler($this);
            }
        });

        $(window).resize(function(){
            var currentTab = flightDeals.find('.tabs li.active');
            tabSwitcherHandler(currentTab);
        })
    }

    var homeHero = $('.home-hero-carousel-module');

    if (homeHero.length) {

        homeHeroSwiperObj.desktop.first =  new Swiper('.home-hero-carousel-module .swiper-container.first', {
            direction: 'vertical',
            simulateTouch: false,
            loop: true
            // nextButton: '.flight-deals-module.swiper-button-next',
            // prevButton: '.flight-deals-module .swiper-button-prev'
        });

        var sliderAmount = $('.home-hero-carousel-module .swiper-container.second .swiper-slide').length;

        homeHeroSwiperObj.desktop.second =  new Swiper('.home-hero-carousel-module .swiper-container.second', {
            direction: 'vertical',
            loop: true,
            simulateTouch: false,
            initialSlide: sliderAmount - 1
        });

        homeHeroSwiperObj.mobile =  new Swiper('.home-hero-carousel-module .swiper-container.mobile', {
            loop: true,
            pagination: '.home-hero-carousel-module .sliders.mobile .swiper-pagination',
            paginationClickable: true,
            onSlideChangeStart: function(slider){
                console.log(slider.realIndex);
                var paginators = $('.home-hero-carousel-module .paginator');
                paginators.filter('.active').removeClass('active');
                var index = parseInt(slider.realIndex);
                var currentButton = paginators.eq(index).addClass('active');
                var color = currentButton.data('color');
                $('.home-hero-carousel-module').css('background-color', color);
                homeHeroSwiperObj.desktop.first.slideTo(index + 1);
                homeHeroSwiperObj.desktop.second.slideTo(sliderAmount - index);
                //$('.home-hero-carousel-module .paginator').eq(slider.realIndex).trigger('click');
            }
        });

        //homeHeroSwiperObj.mobile.params.control = homeHeroSwiperObj.desktop.first;
        //homeHeroSwiperObj.desktop.first.params.control = homeHeroSwiperObj.mobile;




        $(document).on('click', '.home-hero-carousel-module .paginator', function(){
            var $this = $(this);
            if (!$this.hasClass('active')) {
                $('.home-hero-carousel-module .paginator.active').removeClass('active');

                var color = $this.data('color');
                $this.addClass('active');
                $('.home-hero-carousel-module').css('background-color', color);
                var index = $this.index();
                homeHeroSwiperObj.desktop.first.slideTo(index + 1);
                homeHeroSwiperObj.mobile.slideTo(index + 1);
                homeHeroSwiperObj.desktop.second.slideTo(sliderAmount - index);
            }
        });
    }
});