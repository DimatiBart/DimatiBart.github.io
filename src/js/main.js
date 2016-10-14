var mobileHelper = {
    lastTouchPos: {
        x: null,
        y: null
    },
    _saveTouchPosition: function(event){
        var touch = event.originalEvent.touches[0];
        this.lastTouchPos.x = touch.pageX;
        this.lastTouchPos.y =  touch.pageY;
    },
    _deleteTicketHover: function () {
        $('.ticket.hovered').removeClass('hovered');
        $('.date-cell.hovered').removeClass('hovered');
    },
    _tabletDeviceCheck: function(){
        var metaTag = '<meta name="viewport" content="width=1000">';
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
        if( isMobile.any() && window.matchMedia("(min-width: 768px)").matches ){
            $('head').append(metaTag);
        }
    },
    _isTouch: (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.MaxTouchPoints > 0))
};

var UIController = {
    isReturn: null,
    swiper: null,
    initUI: function(mobileHelper){
        this.isReturn = $('.flex-container').hasClass('return');
        if (this.isReturn){
            this.initSwiper();

            $(document).on('click', '.swiper .ticket',function(event){
                var target = $(event.currentTarget);
                var slide = target.closest('.swiper-slide');
                var columnIndex, rowIndex;
                if (slide.hasClass('second')) {
                    columnIndex = 3; //
                }
                else {

                    if (slide.hasClass('third')) {
                        columnIndex = target.index() + 3;
                    }
                    else {
                        columnIndex = target.index() - 1;
                    }
                }
                rowIndex = target.closest('.flex-results-row').index() - 1;

                this._hoverSwiperDatesCell(target, columnIndex, rowIndex);
                var desktopTable = $('.flex-results-table');

                var lightbox = $('.flex-results-table .flex-results-row').eq(rowIndex).find('.ticket').eq(columnIndex).find('.lightbox').clone();
                $('body').append(lightbox);
                lightbox.attr('style', '').addClass('active');
                this._showBgLayer();
            }.bind(this));
        }
        mobileHelper._tabletDeviceCheck();
        if (mobileHelper._isTouch){
            $('body').addClass('touchDevice');

            $(document).on('touchstart', '.flex-results-table .flex-results-row .ticket',function(event){
                mobileHelper._saveTouchPosition(event);
                mobileHelper._deleteTicketHover();
                var target = $(event.currentTarget);
                target.addClass('hovered');
                this._hoverDatesCell(target);
            }.bind(this));

            $(document).on('touchmove', '.flex-results-table .ticket',function(event){
                mobileHelper._saveTouchPosition(event);
            });

            $(document).on('touchend', '.flex-results-table .flex-results-row  .ticket',function(event){
                var endTarget = $(document.elementFromPoint(mobileHelper.lastTouchPos.x, mobileHelper.lastTouchPos.y)).closest('.ticket');
                if (!endTarget.hasClass('hovered')) {
                    mobileHelper._deleteTicketHover ();
                }
            });

            $(document).on('click', '.flex-results-table .ticket',function(event){
                event.preventDefault();
                var target = $(event.currentTarget);
                this._hideFlightLightbox();
                if (!target.hasClass('no-results')){
                    this._showFlightLightbox(target);
                }

            }.bind(this));

            $(document).on('click', '.flex-results-table .ticket .lightbox',function(event){
                event.stopPropagation();
            });
        }
        else {
            $(document).on('mouseenter', '.flex-results-table .flex-results-row  .ticket',function(event){
                $('.date-cell.hovered').removeClass('hovered');
                if (window.matchMedia("(min-width: 641px)").matches === true) {
                    var target = $(event.currentTarget);
                    this._hoverDatesCell(target);
                    this._showFlightLightbox(target);
                }
            }.bind(this));

            $(document).on('mouseleave', '.flex-results-table .flex-results-row .ticket',function(){
                if (window.matchMedia("(min-width: 641px)").matches === true) {
                    this._hideFlightLightbox();
                }
            }.bind(this));

            $(document).on('click', '.flex-results-table .ticket',function(event){
                if (window.matchMedia("(min-width: 641px)").matches === false) {
                    this._showFlightLightbox($(event.currentTarget))
                }
            }.bind(this));

            var desktopMediaQuery = window.matchMedia("(min-width: 641px)");
            desktopMediaQuery.addListener(this._hideFlightLightbox.bind(this));
        }

        $(document).on('click', '.preloader',function(){
            $(this).toggleClass('pressed');
        });

        $(document).on('click', '.lightboxCloseBtn, .bgLayer',function(event){
            event.stopPropagation();
            if (window.matchMedia("(min-width: 641px)").matches === false) {
                this._hideFlightLightbox();
            }
            else {
                this._hideFlightLightbox($(event.currentTarget));
            }

        }.bind(this));

        $(document).on('click', '.searchBar', function(){
            $('.searchWidgetBox').toggleClass('active');
        });
    },
    _hoverDatesCell: function(target) {
        var columnIndex;
        var trContainsHeader = target.closest('.flex-results-row').hasClass('contains-header');
        if (trContainsHeader){
            columnIndex = target.index() - 1;
        }
        else {
            columnIndex = target.index();
        }
        if (this.isReturn) {
            target.siblings('.date-cell').addClass('hovered');
        }
        $('.dates-container .date-cell:nth-child('+ columnIndex +')').addClass('hovered');
    },
    _showFlightLightbox: function(ticket){
        var lightbox = ticket.find('.lightbox');
        if (!lightbox.length) {
            return;
        }
        if (window.matchMedia("(min-width: 641px)").matches === false) {
            this._showBgLayer();
        }
        //lightbox.fadeIn(350);
        lightbox.addClass('active');
        this._calculateLightBoxPosition(ticket, lightbox);
    },
    _hideFlightLightbox: function(){
        //$('.lightbox:visible').fadeOut(50);
        var lightbox = $('.lightbox:visible');
        if (lightbox.length) {
            lightbox.removeClass('active');
            this._hideBgLayer();

            if (window.matchMedia("(min-width: 641px)").matches === false && mobileHelper._isTouch) {
                lightbox.closest('.ticket').addClass('hovered');
            }
        }
    },
    _showBgLayer: function() {
        if (!$('.bgLayer').length) {
            var bgLayer = '<div class="bgLayer"></div>';
            $('html').addClass('noScroll');
            $('body').addClass('lightboxNoScroll').append(bgLayer);
            bgLayer = $('.bgLayer');
            bgLayer.fadeIn(350);
        }
    },
    _hideBgLayer: function(){
        var bgLayer = $('.bgLayer');
        if (bgLayer.length) {
            $('html').removeClass('noScroll');
            $('body').removeClass('lightboxNoScroll');
            bgLayer.fadeOut(350,function(){
                bgLayer.remove();
            });
        }
    },
    _calculateLightBoxPosition: function (ticket, lightbox){
        if (window.matchMedia("(min-width: 641px)").matches === false) {
            lightbox.css('transform', 'translate:(-50%,-50%)');
        }
        else {
            var yPos = lightbox.attr('data-y-pos');
            if (yPos) {
                lightbox.css('transform', 'translate(-50%,'+ yPos +'px)');
            }
            else {
                var halfOFTicketPriceHeight = 11;
                var halfOfLightboxPriceHeight = 14;
                var ticketPriceMiddlePos = ticket.find('.price').position().top +  halfOFTicketPriceHeight;
                var lightboxPriceMiddlePos = lightbox.find('.price').position().top + halfOfLightboxPriceHeight;
                var difference = ticketPriceMiddlePos - lightboxPriceMiddlePos;
                lightbox.attr('data-y-pos', difference);
                lightbox.css('transform', 'translate(-50%,'+ difference +'px)');
            }

        }
    },
    initSwiper: function(){
        this.swiper = new Swiper('.swiper-container', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            spaceBetween : 0,
            slidesPerView: 'auto',
            centeredSlides: true,
            initialSlide: 1,
            nextButton: '.swiper-next',
            prevButton: '.swiper-prev'
        });
    },
    _hoverSwiperDatesCell: function(target, columnIndex, rowIndex){
        var swiperContainer = $('.swiper');
        var departDatesTable = swiperContainer.find('.depart-dates-table');
        swiperContainer.find('.swiper-container .dates-container.hovered').removeClass('hovered');
        departDatesTable.find('.dates-container.hovered').removeClass('hovered');
        target.closest('.flex-results-row').siblings('.dates-container').find('.date-cell').eq(rowIndex).addClass('hovered');
        departDatesTable.find('.dates-container .date-cell').eq(columnIndex).addClass('hovered');
    }
};

UIController.initUI(mobileHelper);