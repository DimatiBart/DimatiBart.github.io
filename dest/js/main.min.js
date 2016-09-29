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
            //$('head').append(metaTag);
        }
    },
    _isTouch: (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.MaxTouchPoints > 0))
};

var UIController = {
    initUI: function(mobileHelper){
        mobileHelper._tabletDeviceCheck();
        if (mobileHelper._isTouch){
            $('body').addClass('touchDevice');

            // $(document).on('touchstart', '.flex-results-wrapper .ticket',function(event){
            //     mobileHelper._saveTouchPosition(event);
            //     mobileHelper._deleteTicketHover();
            //     var target = $(event.currentTarget);
            //     target.addClass('hovered');
            //     var index = target.index() + 1;
            //     $('.dates-container .date-cell:nth-child('+ index +')').addClass('hovered');
            // });
            //
            // $(document).on('touchmove', '.ticket',function(event){
            //     mobileHelper._saveTouchPosition(event);
            // });
            //
            // $(document).on('touchend', '.flex-results-wrapper  .ticket',function(event){
            //     var endTarget = $(document.elementFromPoint(mobileHelper.lastTouchPos.x, mobileHelper.lastTouchPos.y)).closest('.ticket');
            //     if (!endTarget.hasClass('hovered')) {
            //         mobileHelper._deleteTicketHover ();
            //     }
            // });

            $(document).on('click', '.ticket',function(event){
                event.preventDefault();
                var target = $(event.currentTarget);
                if (!target.hasClass('no-results')){
                    this._hideFlightLightbox();
                    this._showFlightLightbox(target);
                }
            }.bind(this));

            $(document).on('click', '.ticket .lightbox',function(event){
                event.stopPropagation();
            });
        }
        else {
            $(document).on('mouseenter', '.flex-results-wrapper  .ticket',function(event){
                if (window.matchMedia("(min-width: 641px)").matches === true) {
                    var target = $(event.currentTarget);
                    var index = target.index() + 1;
                    $('.dates-container .date-cell:nth-child('+ index +')').addClass('hovered');
                    this._showFlightLightbox(target);
                }
            }.bind(this));

            $(document).on('mouseleave', '.flex-results-wrapper .ticket',function(){
                $('.date-cell.hovered').removeClass('hovered');
                if (window.matchMedia("(min-width: 641px)").matches === true) {
                    $('.date-cell.hovered').removeClass('hovered');
                    this._hideFlightLightbox();
                }
            }.bind(this));

            $(document).on('click', '.ticket',function(event){
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
        $('.lightbox:visible').removeClass('active');
        this._hideBgLayer();
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
    }
};

UIController.initUI(mobileHelper);