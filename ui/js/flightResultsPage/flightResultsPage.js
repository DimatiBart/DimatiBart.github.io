/*
 * Flight Results main js
 * ================================
 */

var allowedFlightStep;

$(document).ready(function(){

    allowedFlightStep =  numberOfFlightsToDisplay;

    /*
     * mobile_filter_btn
     *****************************************
     */
    $(document).on('click.mobile_filter_btn', '#mobile_filter_btn', function (event) {
        event.stopPropagation();
        $('body').toggleClass('mobileSidebarOpen');
    });

    /*
     * close_mobile_filter
     *****************************************
     */
    $(document).on('click.close_mobile_filter', '.mobileSidebarOpen .mainContent', function (event) {
        event.stopPropagation();
        hideMobileMenu();
    });

    /*
     * tab menu
     *****************************************
     */
    $(document).on('click.tabItem', '.tabMenu .tabItem', function () {
        if( $(this).hasClass('active') === false ){
            var tab_name = $(this).data('tab-name');
            var tabMenuContent = $('.tabMenuContent');
            var tabMenu = $(this).closest('.tabMenu');
            tabMenuContent.hide();
            tabMenuContent.filter('[data-tab-name="'+ tab_name +'"]').stop().fadeIn(500);
            tabMenu.find('.tabItem').removeClass('active');
            $(this).addClass('active');
        }
    });

    /*
     * flightDetailsBtn
     *****************************************
     */
    $(document).on('click.flightDetailsBtn', '.flightDetailsBtn', function (event) {
        event.stopPropagation();
        if (window.matchMedia("(min-width: 641px)").matches === true) {
            var flightTicketBox = $(this).closest('.flightTicketBox');
            var flightTicketDetailsBox = flightTicketBox.find('.flightTicketDetailsBox');
            $(this).toggleClass('active');
            flightTicketDetailsBox.stop().slideToggle(500).toggleClass('open');
        }        
    });

    $(document).on('click.showMobileFlightDetails', '.flightTicketBox', function (event) {
        if ($('.tooltip.active').length == 0) {
            var flightTicketDetailsBox = $(this).find('.flightTicketDetailsBox');
            if (window.matchMedia("(min-width: 641px)").matches === false &&
                $('body').hasClass('mobileSidebarOpen') === false &&
                flightTicketDetailsBox.length) {
                event.stopPropagation();
                $(this).find('.flightDetailsBtn').trigger('click');
                showMobileFlightDetails(flightTicketDetailsBox);
            }
        }
    });

    /*
     * backToResultsBtn
     *****************************************
     */
    $(document).on('click.backToResultsBtn', '.backToResultsBtn', function () {
        if (window.matchMedia("(min-width: 641px)").matches === false) {
            hideMobileFlightDetails();
        }
    });

    /*
     * filterListCheckbox
     *****************************************
     */
    $(document).on('change.filterListCheckbox', '.filterListCheckbox', function () {
        var filterListLabel = $(this).closest('.filterListLabel');
        if ( $(this).prop('checked') === true ){
            filterListLabel.addClass('checked').closest('li').addClass('checked');
        }
        else {
            filterListLabel.removeClass('checked').closest('li').removeClass('checked');
        }
    });

    /*
     * button loading animation
     *****************************************
     */
    $(document).on('click.preloaderClick', '.btn.preloader', function(){
        $(this).toggleClass('pressed');
    });

    /*
     * closeFlightDetailsBtn
     *****************************************
     */
    $(document).on('click.closeFlightDetailsBtn', '.closeFlightDetailsBtn', function (event) {
        event.preventDefault();
        if (window.matchMedia("(min-width: 641px)").matches) {
            var flightTicketDetailsBox = $(this).closest('.flightTicketDetailsBox');
            var flightTicketBox  = $(this).closest('.flightTicketBox');
            var flightDetailsBtn = flightTicketBox.find('.flightDetailsBtn');
            var margin = parseInt(flightTicketBox.css('margin-top'));
            var scroll = flightTicketBox.offset().top - $('.searchBarContainer').height() - margin;
            flightDetailsBtn.removeClass('active');
            flightTicketDetailsBox.stop().slideUp(500).removeClass('open');
            $('html body').animate({scrollTop:  scroll}, 500);
        }
        else {
            hideMobileFlightDetails();
        }
    });

    /*
     * stop event bubbling
     * for flightTicketDetailsBox
     *****************************************
     */
    $(document).on('click', '.flightTicketDetailsBox.openOnMobile', function(event){
        event.stopPropagation();
    });

    /*
     * stop event bubbling
     * flightTicketFooter links
     *****************************************
     */
    $(document).on('click', '.flightTicketFooter a', function(event){
        event.stopPropagation();
    });

    /*
     * stop click event bubbling
     * searchWidgetBox
     *****************************************
     */
    $(document).on('click', '.searchWidgetBox', function(event){
        event.stopPropagation();
    });

    /*
     * show more results button
     *****************************************
     */
    $(document).on('click.second-btn', '.second-btn', function(event){
        event.preventDefault();
        airResultsUITool.allowedMoreFlightCount(this);
    });

    /*
     * sticky header emulation
     *****************************************
     */
    $(window).scroll(function(){
        calculateSummaryPosition();
    });

    /*
     * show/hide Search Widget
     *****************************************
     */
    $(document).on('click', '.searchBarContainer', function(){
       $('.searchWidgetBox').toggleClass('active');
        checkSWScroll();
        calculateSummaryPosition();
    });

    /*
     * flightTicketFooter click shows details
     *****************************************
     */
    $(document).on('click', '.flightTicketFooter', function(){
        if (window.matchMedia("(min-width: 641px)").matches === true ) {
            $(this).find('.flightDetailsBtn').trigger('click');
        }
    });

    /*
     * lightboxBtn
     *****************************************
     */
    $(document).on('click.showLightbox','.lightboxBtn',function(event){
        event.preventDefault();
        event.stopPropagation();
        var lightboxName = $(this).data('lightbox-name');
        var lightbox = $('.lightbox[data-lightbox-name="'+ lightboxName +'"]');
        showLightbox(lightbox);
    });

    /*
     * lightboxCloseBtn
     ***************************************
     */
    $(document).on('click.closeLightbox','.lightboxCloseBtn, .lightboxExtraCloseBtn',function(event){
        event.preventDefault();
        var lightbox = $(this).closest('.lightbox');
        closeLightbox(lightbox);
    });
    $(document).on('click.closeLightboxLayer','.bgLayer',function(){
        var lightboxName = $(this).data('lightbox-name');
        var lightbox = $('.lightbox[data-lightbox-name="'+ lightboxName +'"]');
        closeLightbox(lightbox);
    });

    /*
     * lightbox prevent click bubbling
     ***************************************
     */
    $(document).on('click.preventBubbling','.lightbox',function(event){
        event.stopPropagation();
    });


    $('.flight_adv').on('click', function(event){
        event.preventDefault();
        calculateSummaryPosition();
    });


    (function(){
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.MaxTouchPoints > 0));
        if( isTouch == true ) {
            $(document).on('touchstart', '.tooltipContainer', function(event){
                event.stopPropagation();
                showTooltip(this);
            });
            $(document).on('touchstart', '.tooltip', function(event){
                event.stopPropagation();
            });
            $(document).on('click', '.tooltipContainer, .tooltip', function(event){
                event.stopPropagation();
            });
            $(document).on('click', function(){
                if ($('.tooltip.active').length != 0) {
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    hideTooltip();
                }
            })
        }
        else {
            $(document).on('mouseenter', '.tooltipContainer', function(event){
                showTooltip(this);
            });

            $(document).on('mouseleave', '.tooltipContainer', function(event){
                hideTooltip(this);
            });
        }
    })();


    /*
     * fareRulesLink
     * @fareRulesLightboxContent
     ***************************************
     */
    $(document).on('click.fareRulesLinkClick','.fareRulesLink',function(){
        event.preventDefault();
        event.stopPropagation();
        var fare_rules_lightbox = $('#fare_rules_lightbox');
        var dynamicDataBox = fare_rules_lightbox.find('.dynamicDataBox');
        var isEmpty = dynamicDataBox.is(':empty');
        if (isEmpty) {
            $.ajax({
                type: "POST",
                url: "/staglobe/getFareRulesInformation.do",
                data: "requestSource=Shopping&selectedItinId=0",
                statusCode: {
                    200: function (response) {
                        dynamicDataBox.append(response);
                        showLightbox(fare_rules_lightbox);
                    },
                    404: function () {
                    },
                    500: function () {
                    }
                },
                beforeSend: function (xhr) {
                    $('body').append(loading_layer);
                    $('#loadingLayer').fadeIn(300);
                },
                complete: function () {
                    $('#loadingLayer').fadeOut(300, function () {
                        $('#loadingLayer').remove();
                    });
                }
            });
        } else {
            showLightbox(fare_rules_lightbox);
        }
    });

    /*
     * customCheckbox
     *****************************************
     */
    $(document).on('change.customCheckboxChange','input.customCheckbox',function(){
        var customCheckboxLabel = $(this).closest('.customCheckboxLabel');
        if( $(this).prop('checked') ){
            customCheckboxLabel.addClass('checked');
        }
        else {
            customCheckboxLabel.removeClass('checked');
        }
    });

    /*
     * filterListCheckbox
     *****************************************
     */
    $(document).on('change.filterListCheckboxChange','input.filterListCheckbox',function(){
        var filterListLabel = $(this).closest('li').find('.filterListLabel');
        if( $(this).prop('checked') ){
            filterListLabel.addClass('checked');
        }
        else {
            filterListLabel.removeClass('checked');
        }
    });

    /*
     * showMoreFiltersBtn
     *****************************************
     */
    $(document).on('click.showMoreFiltersBtnClick','.showMoreFiltersBtn',function(){
        var filterListLabel_hidden = $(this).closest('.filterBox').find('.filterList').find('li.hidden');
        if( $(this).hasClass('active') ){
            $(this).removeClass('active');
            filterListLabel_hidden.hide();
        }
        else {
            $(this).addClass('active');
            filterListLabel_hidden.show();
            if( $(this).data('ellipsis-added') !== true ){
                setMaxWidthForFilterLabel(filterListLabel_hidden);
                $(this).data('ellipsis-added',true);
            }
        }
    });

    /*
     * setMaxWidthForFilterLabel
     *****************************************
     */
    setMaxWidthForFilterLabel($('.filterList').filter('.withCounts').find('.filterListLabel').not('.hidden'));


});

$(window).resize(function(){
    if (window.matchMedia("(min-width: 641px)").matches === false) {
        var flightTicketDetailsBox = $('.flightTicketDetailsBox.open.openOnMobile');
        if (flightTicketDetailsBox.length) {
            setFlightDetailsHeight(flightTicketDetailsBox);
        }
        //checkSWScroll();
        calculateSummaryPosition();
        $('.tooltip').css({
            transform: 'translateX(-50%)',
            left: '50%',
            right: 'none'
        });
    }
});

/*
 * hideMobileMenu
 *****************************************
 */
(function(){
    var mql_640 = window.matchMedia("(min-width: 641px)");
    mql_640.addListener(hideMobileMenu);
    mql_640.addListener(hideFlightDetails);
}());

/*
 * hideMobileMenu
 *****************************************
 */
function hideMobileMenu() {
    $('body').removeClass('noScroll mobileSidebarOpen');
}

/*
 * hideFlightDetails
 *****************************************
 */
function hideFlightDetails() {
    var flightTicketDetailsBox = $('.flightTicketDetailsBox.open');
    $('html').removeClass('noScroll');
    $('body').removeClass('noScroll bodyTransition bodyRotate');
    flightTicketDetailsBox.hide().removeClass('open openOnMobile rotate').css({
        'height':'auto',
        'top': 'auto'
    });
    flightTicketDetailsBox.closest('.flightTicketBox').removeClass('active');
    $('.flightDetailsBtn.active').removeClass('active');
}

/*
 * hideMobileFlightDetails
 *****************************************
 */
function hideMobileFlightDetails() {
    var body = $('body');
    var html = $('html');
    var flightTicketDetailsBox = $('.flightTicketDetailsBox.openOnMobile');
    body.addClass('bodyRotate');
    flightTicketDetailsBox.addClass('rotate').css('top',$(window).scrollTop());
    flightTicketDetailsBox.closest('.flightTicketBox').removeClass('active');
    setTimeout(function(){
        html.removeClass('noScroll');
        body.addClass('bodyTransition').removeClass('bodyRotate noScroll');
        flightTicketDetailsBox.css('top',0);
    }, 4);
    setTimeout(function(){
        flightTicketDetailsBox.hide().removeClass('open openOnMobile rotate').css('height','auto');
    }, 200);
    setTimeout(function(){
        body.removeClass('bodyTransition');
    }, 500);
}

/*
 * showMobileFlightDetails
 *****************************************
 */
function showMobileFlightDetails(flightTicketDetailsBox){
    var body = $('body');
    var html = $('html');
    html.addClass('noScroll');
    body.addClass('bodyTransition bodyRotate noScroll');
    flightTicketDetailsBox.addClass('open openOnMobile rotate').css('top',$(window).scrollTop()).fadeIn(250);
    flightTicketDetailsBox.closest('.flightTicketBox').addClass('active');
    setFlightDetailsHeight(flightTicketDetailsBox);
    setTimeout(function(){
        body.removeClass('bodyTransition bodyRotate');
        $('.flightTicketDetailsBox.openOnMobile').removeClass('rotate').css('top',0);
    }, 500);
}

/*
 * setFlightDetailsHeight
 *****************************************
 */
function setFlightDetailsHeight(flightTicketDetailsBox){
    flightTicketDetailsBox.css('height',$(window).height());
}

/*
 * showFlightDetails
 *****************************************
 */
function showFlightDetailsInfo(obj, fareId, goingThere) {
  var flightDetailsId = "#flightDetails"+goingThere+fareId;
  if($(flightDetailsId+" td").length == 0){
      if (!controls.checkAndLock()) return;
      var _url = UrlBuilder.create('AirFlightExtraDetails.do').add('fareId', fareId).add('flow', 'air').add('goingThere', goingThere).get();
      $.ajax({
          type: "GET",
          url: _url,
          statusCode: {
              200: function (response) {
                  if (isValidAjaxResponse(response)) {
                      $(flightDetailsId).html(response);
                  } else if (isAjaxSessionExpired(response)) {
                      forwardSessionExpired();
                  }
                  controls.unlock();
              },
              404: function () {
                  controls.unlock();
              },
              500: function () {
                  controls.unlock();
              }
          }
      });
  }
}

function showChangeAirportPanel(flightType) {
    var warningMsg;
    if (flightType == "outbound") {
      warningMsg = $(".flightOutbound .warningMsg");
    }
    else if (flightType == "inbound") {
      warningMsg = $(".flightInbound .warningMsg");
    }
    else {
      return;
    }
    if (!warningMsg.is(":visible")) {
      warningMsg.show();
    }
}

function checkSWScroll () {
    var html = $('html');
    var body = $('body');
    if (window.matchMedia("(min-width: 641px)").matches === false ) {
        if ($('.searchWidgetBox').hasClass('active')) {
            html.addClass('noScroll');
            body.addClass('noScroll');
        }
        else {
            html.removeClass('noScroll');
            body.removeClass('noScroll');
        }
    }
    else {
        html.removeClass('noScroll');
        body.removeClass('noScroll');
    }
}

function calculateSummaryPosition() {
    var scrollTop = $(window).scrollTop();
    var searchBar =  $('.searchBarContainer');
    var barHeaderHeight = searchBar.outerHeight();
    var pageHeaderHeight;
    var padding;
    var maxHeight;
    var nextContainer;
    if (window.matchMedia("(min-width: 641px)").matches === true ) {
        pageHeaderHeight = $('#sta-page-wrap').outerHeight() + $('#sta-top-header').height();
        padding = 20;
        nextContainer = $('.pageContentHeader');
    }
    else {
        pageHeaderHeight = $('#sta-mobile-header').outerHeight();
        padding = 0;
        nextContainer = $('#page_content');
    }

    if(scrollTop > pageHeaderHeight + padding){
        nextContainer.css('padding-top', barHeaderHeight + padding);
        searchBar.addClass('fixedHeader');
        searchBar.css('margin-top', 0);

        if (searchBar.find('.searchWidgetBox').hasClass('active')) {
            if (window.matchMedia("(min-width: 641px)").matches === true ) {
                searchBar.css('max-height', 'none');
            }
            else {
                searchBar.css('max-height', '100%');

            }
        }
    }
    else {
        nextContainer.css('padding-top','0');
        searchBar.removeClass('fixedHeader');
        searchBar.css('margin-top', padding);

        if (searchBar.find('.searchWidgetBox').hasClass('active')) {
            if (window.matchMedia("(min-width: 641px)").matches === true ) {
                searchBar.css('max-height', 'none');
            }
            else {
                searchBar.css('max-height', searchBar.height());
            }
        }

    }
}

/*
 * showLightbox
 *****************************************
 */
function showLightbox(lightbox){
    var lightboxName = lightbox.data('lightbox-name');
    var bgLayer = '<div class="bgLayer ' + lightboxName + '"' + '></div>';
    var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.MaxTouchPoints > 0));
    if( lightbox.length > 0 ){
        $('html').addClass('noScroll');
        $('body').addClass('lightboxNoScroll').append(bgLayer);
        $('.bgLayer.'+lightboxName).removeClass(lightboxName).attr('data-lightbox-name',lightboxName).fadeIn(350);
        lightbox.stop().fadeIn(350);
        if( isTouch ){
            $('.bgLayer').css('cursor','pointer');
        }
    }
}


/*
 * closeLightbox
 *****************************************
 */
function closeLightbox(lightbox){
    var lightboxName = lightbox.data('lightbox-name');
    var bgLayer = $('.bgLayer[data-lightbox-name="'+ lightboxName +'"]');
    $('html').removeClass('noScroll');
    $('body').removeClass('lightboxNoScroll');
    bgLayer.fadeOut(250,function(){
        $(this).remove();
    });
    lightbox.stop().fadeOut(250);
}

/*
 * showTooltip
 *****************************************
 */
function showTooltip(container) {
    hideTooltip();
    var tooltip = $(container).find('.tooltip');
    // if (!tooltip.hasClass('active')) {
    $(container).find('.tooltip').stop(true,true).fadeIn(350).addClass('active');
    $(container).find('.tooltipArrow').stop(true,true).fadeIn(350).addClass('active');
    var ticket = tooltip.closest('.flightTicketBox');
    var tooltipLeftBorder = Math.round(tooltip.offset().left);
    var ticketLeftBorder = Math.round(ticket.offset().left);
    if (window.matchMedia("(min-width: 641px)").matches === false) {
        if (tooltipLeftBorder == ticketLeftBorder) {
            return;
        }
        if (tooltipLeftBorder < ticketLeftBorder) {
            tooltip.css({
                left: '-10px',
                transform: 'none'
            });
        }
        else {
            var tooltipRightBorder =  tooltipLeftBorder +  Math.round(tooltip.outerWidth());
            var ticketRightBorder = ticketLeftBorder + Math.round(ticket.width());
            if (tooltipRightBorder == ticketRightBorder) {
                return;
            }
            if (tooltipRightBorder > ticketRightBorder) {
                tooltip.css({
                    right: '-10px',
                    left: 'auto',
                    transform: 'none'
                });
            }
            else{
                tooltip.css({
                    transform: 'translateX(-50%)',
                    left: '50%',
                    right: 'none'
                })
            }
        }
    }
}

/*
 * hideTooltip
 *****************************************
 */
function hideTooltip(container) {
    if (container) {
        $(container).find('.tooltip').stop(true,true).fadeOut(350).removeClass('active');
        $(container).find('.tooltipArrow').stop(true,true).fadeOut(350).removeClass('active');
    }
    else {
        $('.tooltip.active, .tooltipArrow.active').stop(true,true).fadeOut(350).removeClass('active');
    }
}

/*
 * setMaxWidthForFilterLabel
 *****************************************
 */
function setMaxWidthForFilterLabel(filterListLabel){
    var countElement_margin = 5;
    var priceElement_margin = 15;
    filterListLabel.each(function(){
        var filterText = $(this).find('.filterText');
        var count = $(this).find('.count');
        var price = $(this).find('.price');
        var maxWidth = $(this).width() - count.outerWidth() - price.outerWidth() - countElement_margin - priceElement_margin;
        filterText.css('max-width',maxWidth);
    });
}