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
    _classNames: ['first', 'second'],
    breakpointsClasses: ["swiper-container_desktop", "swiper-container_desktop"],
    _destroyWrapperSliders: function(){
        this._classNames.forEach(function(elem){
           this.sliders[elem].mobile.destroy();
           this.sliders[elem].desktop.destroy();
        }.bind(this));
    },
    updateSliders: function(){
        this._classNames.forEach(function(elem){
            this.sliders[elem].mobile.update();
            this.sliders[elem].desktop.update();
        }.bind(this));
    },
    destroy: function() {
        if (this.isInited) {
            this._destroyWrapperSliders(this.sliders.first);
            this._destroyWrapperSliders(this.sliders.second);
            this.isInited = false;
        }
    },
    _hideIndicators: function(sliderWrapper, isDesktop){
        var classToHide;
        if (isDesktop) {
            classToHide = ".swiper-pagination_desktop";
            sliderWrapper.find(".swiper-button").hide();
        }
        else {
            classToHide = ".swiper-pagination_mobile";
        }
        sliderWrapper.find(classToHide).hide();
    },
    _getSwiperParamObject: function(wrapperSelector, isLooped, isDesktop){
        var type = isDesktop ? "desktop": "mobile";

        var params =  {
            pagination: wrapperSelector + " .swiper-pagination_" + type,
            paginationClickable: true,
            spaceBetween: 20,
            loop: isLooped
        };

        if (isDesktop) {
            var arrows = {
                nextButton: wrapperSelector +' .swiper-button-next',
                prevButton: wrapperSelector + ' .swiper-button-prev'
            };
            $.extend(params, arrows)
        }

        return params;
    },
    init: function(){
        if (!this.isInited) {
            this._classNames.forEach(function(curValue){
                var shouldBeLooped_mobile = true;
                var shouldBeLooped_desktop = true;

                var currentSlider = $(".slider-wrapper_" + curValue);
                var wrapperSelector = '.flight-deals-module .slider-wrapper_' + curValue;
                var slidesAmount = currentSlider.find(".swiper-container_mobile .swiper-slide").length;
                if (slidesAmount <= 2) {
                    if (slidesAmount == 2) {
                        shouldBeLooped_desktop = false;
                        this._hideIndicators(currentSlider, true);
                    }
                    else {
                        shouldBeLooped_mobile = false;
                        shouldBeLooped_desktop = false;
                        this._hideIndicators(currentSlider, true);
                        this._hideIndicators(currentSlider);
                    }
                }

                var desktopSliderParams = this._getSwiperParamObject(wrapperSelector, shouldBeLooped_desktop, true);
                var mobileSliderParams = this._getSwiperParamObject(wrapperSelector, shouldBeLooped_mobile);

                this.sliders[curValue] = {};

                this.sliders[curValue].desktop = new Swiper(wrapperSelector + " .swiper-container_desktop", desktopSliderParams);
                this.sliders[curValue].mobile = new Swiper(wrapperSelector + " .swiper-container_mobile", mobileSliderParams);
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
        var activeClass, disabledClass;
        if (element.hasClass('first-tab')) {
            activeClass = '.slider-wrapper_first';
            disabledClass  = '.slider-wrapper_second';
        }
        else {
            disabledClass = '.slider-wrapper_first';
            activeClass  = '.slider-wrapper_second';
        }
        var flightDealModule = $(".flight-deals-module");
        flightDealModule.find(activeClass).addClass("active");
        flightDealModule.find(disabledClass).removeClass("active");

        if (flightDealsSwiper.isInited) {
            flightDealsSwiper.updateSliders();
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



    (function(){
        var swiperSelector = '.scrolling-hero-banner.swiper-container';
        var scrollingHeroBanner = $(swiperSelector);

        if (scrollingHeroBanner.length) {
            if (scrollingHeroBanner.find(".swiper-slide").length > 1) {
                new Swiper(swiperSelector, {
                    loop: true,
                    pagination: swiperSelector + ' .swiper-pagination',
                    paginationClickable: true,
                    nextButton: swiperSelector + ' .swiper-btn_next',
                    prevButton: swiperSelector +' .swiper-btn_prev',
                });
            }
            else {
                $(swiperSelector + " .swiper-btn").hide();
            }
        }
    })();
});

$(document).on('click', '.tap-to-call', function(e){
    e.stopPropagation();
    e.preventDefault();
    window.location = 'tel:' + $(this).data('tel');
});
