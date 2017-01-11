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

var flightDealsSwiper = {
    sliders: {},
    isInited: false,
    destroy: function() {
        if (this.isInited) {
            this.sliders.first.destroy();
            this.sliders.second.destroy();
            this.isInited = false;
        }
    },
    _classNames: ['first', 'second'],
    init: function(){
        if (!this.isInited) {
            this._classNames.forEach(function(curValue){
                this.sliders[curValue] = new Swiper('.flight-deals-module .swiper-container_' + curValue, {
                    pagination: '.flight-deals-module .swiper-pagination_'+ curValue,
                    paginationClickable: true,
                    spaceBetween: 20,
                    nextButton: '.flight-deals-module .swiper-button-next.swiper-button_'+ curValue,
                    prevButton: '.flight-deals-module .swiper-button-prev.swiper-button_'+ curValue,
                    loop: true,
                    slidesPerView: 2,
                    breakpoints: {
                        641: {
                            slidesPerView: 1
                        }
                    }
                });
            }.bind(this));
        }
        this.isInited = true;
    },
    tabSwitcherHandler: function(element){
        var width = element.outerWidth();
        var switcher = element.siblings('.switch');
        element.siblings('.active').removeClass('active');
        element.addClass('active');
        this.sliderDisplayHandler(element);

        switcher.css('width', width);
        var position = element.position().left;
        switcher.css('left', position);
    },
    sliderDisplayHandler: function (element){
        var classToRemove, classToAdd;
        if (element.hasClass('first-tab')) {
            classToAdd = 'slider-wrapper_first-active';
            classToRemove  = 'slider-wrapper_second-active';
        }
        else {
            classToRemove = 'slider-wrapper_first-active';
            classToAdd  = 'slider-wrapper_second-active';

        }
        $('.flight-deals-module .slider-wrapper').addClass(classToAdd).removeClass(classToRemove);

        if (flightDealsSwiper.isInited) {
            flightDealsSwiper.sliders.first.update();
            flightDealsSwiper.sliders.second.update();
        }
    }
};
var homeHeroSwiperObj = {
    desktop:{
        first: null,
        second: null
    },
    mobile: null
};

var homeToursSliders = {
    mobile: null,
    desktop: null
};

$(window).load(function(){
    var flightDeals = $('.flight-deals-module');

    if (flightDeals.length) {

        var currentTab = flightDeals.find('.tabs li.active');
        flightDealsSwiper.tabSwitcherHandler(currentTab);

        flightDealsSwiper.init();

        $(document).on('click', '.flight-deals-module .tabs li', function(){
            var $this = $(this);
            if (!$this.hasClass('active')) {
                flightDealsSwiper.tabSwitcherHandler($this);
            }
        });

        $(window).resize(function(){
            var currentTab = flightDeals.find('.tabs li.active');
            flightDealsSwiper.tabSwitcherHandler(currentTab);
        })
    }

    var homeHero = $('.home-hero-carousel-module');

    if (homeHero.length) {

        function paginatorHandler(index){
            var paginators = $('.home-hero-carousel-module .paginator');
            paginators.filter('.active').removeClass('active');
            var currentButton = paginators.eq(index).addClass('active');
            var color = currentButton.data('color');
            $('.home-hero-carousel-module').css('background-color', color);
        }

        homeHeroSwiperObj.desktop.first =  new Swiper('.home-hero-carousel-module .swiper-container.first', {
            direction: 'vertical',
            simulateTouch: false,
            loop: true,
            spaceBetween: 0
        });

        var sliderAmount = $('.home-hero-carousel-module .swiper-container.second .swiper-slide').length;

        homeHeroSwiperObj.desktop.second =  new Swiper('.home-hero-carousel-module .swiper-container.second', {
            direction: 'vertical',
            loop: true,
            simulateTouch: false,
            initialSlide: sliderAmount - 1,
            spaceBetween: 0
        });

        homeHeroSwiperObj.desktop.first.disableTouchControl();
        homeHeroSwiperObj.desktop.second.disableTouchControl();

        homeHeroSwiperObj.mobile =  new Swiper('.home-hero-carousel-module .swiper-container.mobile', {
            loop: true,
            pagination: '.home-hero-carousel-module .swiper-pagination',
            spaceBetween: 10,
            preventClicksPropagation: false,
            preventClicks: false,
            paginationClickable: true,
            onSlideChangeStart: function(slider){
                var index = parseInt(slider.realIndex);
                paginatorHandler(index);
                homeHeroSwiperObj.desktop.first.slideTo(index + 1);
                homeHeroSwiperObj.desktop.second.slideTo(sliderAmount - index);
            }
        });


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

        $(document).on('click', '.swiper-slide', function(event){
           if (homeHeroSwiperObj.mobile.animating) {
               event.preventDefault();
           }
        });

        $(document).on('click', '.home-hero-carousel-module .swiper-btn', function(event){
            event.stopPropagation();
            event.preventDefault();
            var $this = $(this);
            $('.home-hero-carousel-module .paginator.active').removeClass('active');
            if ($this.hasClass('swiper-btn_next')) {
                homeHeroSwiperObj.desktop.first.slideNext();
                homeHeroSwiperObj.desktop.second.slidePrev();
                homeHeroSwiperObj.mobile.slideNext();
            }
            else {
                homeHeroSwiperObj.desktop.first.slidePrev();
                homeHeroSwiperObj.desktop.second.slideNext();
                homeHeroSwiperObj.mobile.slidePrev();
            }
            paginatorHandler(parseInt(homeHeroSwiperObj.desktop.first.realIndex));
        });
    }

    var heroTours = $('.home-tours-module');

    if (heroTours.length) {
        homeToursSliders.mobile = new Swiper('.home-tours-module .swiper-container.mobile', {
            loop: true,
            grabCursor: true,
            pagination: '.home-tours-module .swiper-container.mobile .swiper-pagination',
            spaceBetween: 20,
            slidesPerView:'auto',
            parallax: true,
            paginationClickable: true,
            //centeredSlides: true,
            //freeMode: true
        });

        homeToursSliders.desktop = new Swiper('.home-tours-module .swiper-container.desktop', {
            loop: true,
            grabCursor: true,
            paginationClickable: true,
            pagination: '.home-tours-module .swiper-container.desktop .swiper-pagination',
            //spaceBetween: 20,
            nextButton: '.home-tours-module .swiper-container.desktop .swiper-button-next',
            prevButton: '.home-tours-module .swiper-container.desktop .swiper-button-prev',
        });

        window.matchMedia("(min-width: 642px)").addListener(function(){
            var activeSlideIndex;
            if (window.matchMedia("(min-width: 642px)").matches == false) {
                activeSlideIndex = parseInt(homeToursSliders.desktop.realIndex);
                activeSlideIndex = activeSlideIndex ? activeSlideIndex * 4: activeSlideIndex;
                homeToursSliders.mobile.slideTo(activeSlideIndex);
            }
            else {
                activeSlideIndex = Math.trunc(parseInt(homeToursSliders.mobile.realIndex) / 4) + 1;
                homeToursSliders.desktop.slideTo(activeSlideIndex);
            }
        })
    }
});

$(document).on('click', '.tap-to-call', function(e){
    e.stopPropagation();
    e.preventDefault();
    window.location = 'tel:' + $(this).data('tel');
});