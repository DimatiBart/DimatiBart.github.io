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


var SliderHelper = function(afterUnificationMethodName){
    var defaultMethodName = "_initSlider";
    afterUnificationMethodName = afterUnificationMethodName || defaultMethodName;
    this._sliders = [];
    this._SLIDERS_AMOUNT_IN_THE_MODULE = 2;
    this._AFTER_UNIFICATION = afterUnificationMethodName;
};

//module - jquery object with module containers
SliderHelper.prototype.init = function(module, additionalClassName){
    module.each(function(index, element){
        var $this = $(element);
        var uniqueClassSelector = additionalClassName + "_" + index;
        $this.addClass(uniqueClassSelector);
        uniqueClassSelector = "." + uniqueClassSelector;
        this[this._AFTER_UNIFICATION](uniqueClassSelector);
    }.bind(this));

    window.matchMedia("(min-width: 642px)").addListener(function(){
        for (var i in this._sliders) {
            var activeSlideIndex;

            if (window.matchMedia("(min-width: 642px)").matches == false) {
                activeSlideIndex = parseInt(this._sliders[i].desktop.realIndex);
                activeSlideIndex = activeSlideIndex ? activeSlideIndex * 4: activeSlideIndex;
                this._sliders[i].mobile.update(true);
                this._sliders[i].mobile.slideTo(activeSlideIndex);
            }
            else {
                activeSlideIndex = (parseInt(this._sliders[i].mobile.realIndex) / 4) + 1;
                this._sliders[i].desktop.update(true);
                this._sliders[i].desktop.slideTo(activeSlideIndex);
            }
        }
    }.bind(this));
};

SliderHelper.prototype._initSlider = function (parentSelector){
    var sliders = {};
    for (var i = 0; i < this._SLIDERS_AMOUNT_IN_THE_MODULE; i++){
        // where i == 1 is mobile, and i == 0 is desktop ver.
        var sliderPerView = i ? "auto" : 1;
        var selector = parentSelector + " .slider-wrapper" + (i ? "_mobile": "_desktop");
        var sliderWrapper = $(selector);
        var sliderAmount = sliderWrapper.find('.swiper-slide').length;

        //no need to init slider functionality at all
        if (!i && sliderAmount <= 1) {
            return;
        }
        else if (sliderAmount > 1) {
            var params = {
                loop: true,
                slidesPerView: sliderPerView,
                initialSlide: 0,
                pagination: selector + ' .swiper-pagination',
                paginationClickable: true
            };

            if (!i) {
                var desktopParams = {
                    nextButton: selector + ' .swiper-btn_next',
                    prevButton: selector +' .swiper-btn_prev',
                    spaceBetween: 20
                };
                $.extend(params, desktopParams);
            }

            var fieldName = i ? "mobile" : "desktop";

            sliders[fieldName] = new Swiper (selector + " .swiper-container", params);
        }
        else {
            sliderWrapper.find(".swiper-pagination, .swiper-btn").hide();
        }
    }

    this._sliders.push(sliders);
};

var BlogSliderHelper = function(afterUnificationMethodName){
    SliderHelper.call(this, afterUnificationMethodName);
};

BlogSliderHelper.prototype = Object.create(SliderHelper.prototype);
BlogSliderHelper.prototype.constructor = BlogSliderHelper;

BlogSliderHelper.prototype._loadData = function(moduleSelector) {
    var module = $(moduleSelector);
    var rssURL = module.data("rssUrl");

    $.ajax({
        url: rssURL,
        dataType: "xml",
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        success: function(data){
            //parse some =>
            var blogPosts = [];
            $(data).find("item").each(function(index, elem){
                if (index >= 8) {
                    var blogPost = this._getBlogTemplate($(elem));
                    blogPosts.push(blogPost);
                }
            }.bind(this));

            var desktopContainer = module.find(".slider-wrapper_desktop .swiper-wrapper");
            var mobileContainer = module.find(".slider-wrapper_mobile .swiper-wrapper");

            module.find(".swiper-slide").remove();

            var desktopSlideContainer;
            var mobileSlideContainer;

            blogPosts.forEach(function(elem, index){
                if (index % 4 == 0) {
                    desktopSlideContainer = $(document.createElement("div")).addClass("swiper-slide");
                }
                mobileSlideContainer = $(document.createElement("div")).addClass("swiper-slide");

                desktopSlideContainer.append(elem);
                mobileSlideContainer.append(elem);

                mobileContainer.append(mobileSlideContainer);

                if (index + 1 == blogPosts.length || desktopContainer.find(".blog-post").length == 4) {
                    desktopContainer.append(desktopSlideContainer);
                }
            });

            this._initSlider(moduleSelector);
        }.bind(this)
    })
};
BlogSliderHelper.prototype._getBlogTemplate = function(item){
    var text = item.find("title").text();
    //var text = item.find("description").text();
    var date = item.find("pubDate").text();
    date = date.match(/\d{2} \w+ \d{4}/)[0];
    var link = item.find("link").text();
    var author = item.find("creator").text();
    var description = item.find("encoded").text();
    var imgURL = $(description).find("img").attr("src");

    var firstRow;

    if (imgURL) {
        firstRow = '<a href="' + link + '" class="blog-post" style="background-image: url('+ imgURL +')">'
    }
    else {
        firstRow = '<a href="' + link + '" class="blog-post">'
    }
    return firstRow
        +'<div class="content">'
        + '<p class="title">BLOG</p>'
        + '<p class="text">'+ text + '</p>'
        + '<p class="author sub">'+ author + '</p>'
        + '<p class="date sub">'+ date + '</p>'
        + '</div>'
        + '</a>'
};
BlogSliderHelper.prototype._initSlider = function (parentSelector){
    var sliders = {};
    for (var i = 0; i < this._SLIDERS_AMOUNT_IN_THE_MODULE; i++){
        // where i == 1 is mobile, and i == 0 is desktop ver.
        var sliderPerView = i ? 1: "auto";
        var selector = parentSelector + " .slider-wrapper" + (i ? "_mobile": "_desktop");
        var sliderWrapper = $(selector);
        var sliderAmount = sliderWrapper.find('.swiper-slide').length;

        if (sliderAmount > 1) {
            var params = {
                loop: true,
                slidesPerView: sliderPerView,
                initialSlide: 0,
                pagination: selector + ' .swiper-pagination',
                paginationClickable: true
            };

            if (!i) {
                var desktopParams = {
                    nextButton: selector + ' .swiper-btn_next',
                    prevButton: selector +' .swiper-btn_prev',
                    spaceBetween: 20
                };
                $.extend(params, desktopParams);
            }

            var fieldName = i ? "mobile" : "desktop";

            sliders[fieldName] = new Swiper (selector + " .swiper-container", params);
        }
        else {
            sliderWrapper.find(".swiper-pagination, .swiper-btn").hide();
        }
    }

    this._sliders.push(sliders);
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

    var homeTours = $('.home-tours-module');

    if (homeTours.length) {
        var homeToursSliderHelper = new SliderHelper();
        homeToursSliderHelper.init(homeTours, "home_tours");
    }


    (function(){
        var swiperSelector = '.scrolling-hero-banner.swiper-container';
        var scrollingHeroBanner = $(swiperSelector);

        if (scrollingHeroBanner.length) {
            scrollingHeroBanner.each(function(index){
                var slider = $(this);
                var uniqueCurrentClassName = "scrolling-hero-banner_" + index;
                slider.addClass(uniqueCurrentClassName);
                uniqueCurrentClassName = "." + uniqueCurrentClassName;
                if (slider.find(".swiper-slide").length > 1) {
                    var autoplay = slider.attr("data-swiper-autoplay");
                    var params = {
                        loop: true,
                        pagination: uniqueCurrentClassName + ' .swiper-pagination',
                        paginationClickable: true,
                        nextButton: uniqueCurrentClassName + ' .swiper-btn_next',
                        prevButton: uniqueCurrentClassName +' .swiper-btn_prev'
                    };
                    if (autoplay) {
                        params.autoplay = parseInt(autoplay);
                    }
                    new Swiper(uniqueCurrentClassName, params);
                }
                else {
                    slider.find(" .swiper-btn").hide();
                }
            });

            $(document).on("click", swiperSelector + " .swiper-slide", function(){
                var link, isNewTab;

                isNewTab = JSON.parse($(this).attr("data-is-new-tab"));
                if (window.matchMedia("(min-width: 642px)").matches) {
                    link = $(this).attr("data-slider-desktop-link");
                }
                else {
                    link = $(this).attr("data-slider-mobile-link");
                }
                if (link) {
                    isNewTab ?
                        window.location = link :
                        window.open(link);
                }
            });
        }
    })();

    (function(){
        var countdownModule = $(".countdown-clock");
        if (countdownModule.length) {
            var countdownModuleHelper = {
                getTimeRemaining: function(deadline){
                    var t = deadline - new Date().getTime();
                    var seconds = Math.floor((t / 1000) % 60);
                    var minutes = Math.floor((t / 1000 / 60) % 60);
                    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
                    var days = Math.floor(t / (1000 * 60 * 60 * 24));
                    return {
                        'total': t,
                        'days': days,
                        'hours': hours,
                        'minutes': minutes,
                        'seconds': seconds
                    };
                },
                initializeClock: function(clockdownInfo){
                    this.updateClock(clockdownInfo);
                    clockdownInfo.timeinterval = setInterval(function(){
                        this.updateClock(clockdownInfo);
                    }.bind(this), 1000);
                },
                updateClock: function(countdownInfo){
                    var t = this.getTimeRemaining(countdownInfo.deadline);

                    countdownInfo.days.text(t.days);
                    countdownInfo.hours.text(('0' + t.hours).slice(-2));
                    countdownInfo.minutes.text(('0' + t.minutes).slice(-2));
                    countdownInfo.seconds.text(('0' + t.seconds).slice(-2));

                    if (t.total <= 0) {
                        clearInterval(countdownInfo.timeinterval);
                        this.closeClock(countdownInfo.clock);
                    }
                },
                closeClock: function(clock){
                    clock.addClass("inactive").removeClass("active");
                }
            };
            countdownModule.each(function(){
                var $this = $(this);
                var countdownInfo = {
                    clock: $this,
                    deadline: new Date($(this).attr("data-deadline")).getTime(),
                    days: $this.find(".days"),
                    hours: $this.find(".hours"),
                    minutes: $this.find(".minutes"),
                    seconds: $this.find(".seconds")

                };
                //var deadline = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);
                countdownModuleHelper.initializeClock(countdownInfo);
            });
        }
    })();
});

$(document).on('click', '.tap-to-call', function(e){
    e.stopPropagation();
    e.preventDefault();
    window.location = 'tel:' + $(this).data('tel');
});

// var homeBlogSliderHelper = {
//     _sliders: [],
//     _SLIDERS_AMOUNT_IN_THE_MODULE: 2,
//     init: function(homeBlogModule){
//         var additionalClassName = "home_blog";
//         homeBlogModule.each(function(index, element){
//             var $this = $(element);
//             var uniqueClassSelector = additionalClassName + "_" + index;
//             $this.addClass(uniqueClassSelector);
//             uniqueClassSelector = "." + uniqueClassSelector;
//             this._loadData(uniqueClassSelector);
//         }.bind(this));
//
//         window.matchMedia("(min-width: 642px)").addListener(function(){
//             for (var i in this._sliders) {
//                 var activeSlideIndex;
//
//                 if (window.matchMedia("(min-width: 642px)").matches == false) {
//                     activeSlideIndex = parseInt(this._sliders[i].desktop.realIndex);
//                     activeSlideIndex = activeSlideIndex ? activeSlideIndex * 4: activeSlideIndex;
//                     this._sliders[i].mobile.update(true);
//                     this._sliders[i].mobile.slideTo(activeSlideIndex);
//                 }
//                 else {
//                     activeSlideIndex = (parseInt(this._sliders[i].mobile.realIndex) / 4) + 1;
//                     this._sliders[i].desktop.update(true);
//                     this._sliders[i].desktop.slideTo(activeSlideIndex);
//                 }
//             }
//         }.bind(this));
//     },
//     _loadData: function(moduleSelector) {
//         var module = $(moduleSelector);
//         var rssURL = module.data("rssUrl");
//
//         $.ajax({
//             url: rssURL,
//             dataType: "xml",
//             headers: {
//                 'Access-Control-Allow-Origin': '*'
//             },
//             success: function(data){
//                 //parse some =>
//                 var blogPosts = [];
//                 $(data).find("item").each(function(index, elem){
//                     if (index >= 8) {
//                         var blogPost = this._getBlogTemplate($(elem));
//                         blogPosts.push(blogPost);
//                     }
//                 }.bind(this));
//
//                 var desktopContainer = module.find(".slider-wrapper_desktop .swiper-wrapper");
//                 var mobileContainer = module.find(".slider-wrapper_mobile .swiper-wrapper");
//
//                 module.find(".swiper-slide").remove();
//
//                 var desktopSlideContainer;
//                 var mobileSlideContainer;
//
//                 blogPosts.forEach(function(elem, index){
//                     if (index % 4 == 0) {
//                         desktopSlideContainer = $(document.createElement("div")).addClass("swiper-slide");
//                     }
//                     mobileSlideContainer = $(document.createElement("div")).addClass("swiper-slide");
//
//                     desktopSlideContainer.append(elem);
//                     mobileSlideContainer.append(elem);
//
//                     mobileContainer.append(mobileSlideContainer);
//
//                     if (index + 1 == blogPosts.length || desktopContainer.find(".blog-post").length == 4) {
//                         desktopContainer.append(desktopSlideContainer);
//                     }
//                 });
//
//                 this._initSlider(moduleSelector);
//             }.bind(this)
//         })
//     },
//     _getBlogTemplate: function(item){
//         var text = item.find("title").text();
//         //var text = item.find("description").text();
//         var date = item.find("pubDate").text();
//         date = date.match(/\d{2} \w+ \d{4}/)[0];
//         var link = item.find("link").text();
//         var author = item.find("creator").text();
//         var description = item.find("encoded").text();
//         var imgURL = $(description).find("img").attr("src");
//
//         var firstRow;
//
//         if (imgURL) {
//             firstRow = '<a href="' + link + '" class="blog-post" style="background-image: url('+ imgURL +')">'
//         }
//         else {
//             firstRow = '<a href="' + link + '" class="blog-post">'
//         }
//         return firstRow
//                     +'<div class="content">'
//                     + '<p class="title">BLOG</p>'
//                     + '<p class="text">'+ text + '</p>'
//                     + '<p class="author sub">'+ author + '</p>'
//                     + '<p class="date sub">'+ date + '</p>'
//                     + '</div>'
//             + '</a>'
//     },
//     _initSlider: function (parentSelector){
//         var sliders = {};
//         for (var i = 0; i < this._SLIDERS_AMOUNT_IN_THE_MODULE; i++){
//             // where i == 0 is mobile, and i == 1 is desktop ver.
//             var sliderPerView = i ? "auto" : 1;
//             var selector = parentSelector + " .slider-wrapper" + (i ? "_mobile" : "_desktop" );
//             var sliderWrapper = $(selector);
//
//             if (sliderWrapper.find('.swiper-slide').length > 1) {
//                 var params = {
//                     loop: true,
//                     slidesPerView: sliderPerView,
//                     initialSlide: 0,
//                     pagination: selector + ' .swiper-pagination',
//                     paginationClickable: true
//                 };
//
//                 if (!i) {
//                     var arrows = {
//                         nextButton: selector + ' .swiper-btn_next',
//                         prevButton: selector +' .swiper-btn_prev'
//                     };
//                     $.extend(params, arrows);
//                 }
//
//                 var fieldName = i ? "mobile" : "desktop";
//
//                 sliders[fieldName] = new Swiper (selector + " .swiper-container", params);
//             }
//             else {
//                 sliderWrapper.find(".swiper-pagination, .swiper-btn").hide();
//             }
//         }
//
//         this._sliders.push(sliders);
//     }
// };

(function(){
    var homeBlogModule = $(".home-blog-widget-module");
    if (homeBlogModule.length) {
        var homeBlogSliderHelper = new BlogSliderHelper("_loadData");
        homeBlogSliderHelper.init(homeBlogModule, "home_blog");
    }
})();