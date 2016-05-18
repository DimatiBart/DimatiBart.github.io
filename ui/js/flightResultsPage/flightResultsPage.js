/*
 * Flight Results main js
 * ================================
 */

$(document).ready(function(){

    var currentNumFlightsToDisplay = numberOfFlightsToDisplay;

    /*
     * mobile_filter_btn
     *****************************************
     */
    $(document).on('click.mobile_filter_btn', '#mobile_filter_btn', function () {
        $('body').toggleClass('mobileSidebarOpen');
    });

    /*
     * close_mobile_filter
     *****************************************
     */
    $(document).on('click.close_mobile_filter', '.mobileSidebarOpen .mainContent', function () {
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
        event.stopPropagation();
        var flightTicketDetailsBox = $(this).find('.flightTicketDetailsBox');
        if (window.matchMedia("(min-width: 641px)").matches === false &&
            $('body').hasClass('mobileSidebarOpen') === false &&
            flightTicketDetailsBox.length ){
            $(this).find('.flightDetailsBtn').trigger('click');
            showMobileFlightDetails(flightTicketDetailsBox);
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
            var flightDetailsBtn = $(this).closest('.flightTicketBox').find('.flightDetailsBtn');
            flightDetailsBtn.removeClass('active');
            flightTicketDetailsBox.stop().slideUp(500).removeClass('open');
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
     * show more results button
     *****************************************
     */
    $(document).on('click.second-btn', '.second-btn', function(event){
        event.preventDefault();
        var footer = $(this).closest('.mainContentFooter');
        $('.tabMenuContent.active').find('.flightTicketBox.hidden').slice(0, numberOfFlightsToDisplay).removeClass('hidden');
        currentNumFlightsToDisplay += numberOfFlightsToDisplay;
        if (currentNumFlightsToDisplay >= flightItinerariesQuantity) {
            $(this).hide();
            footer.find('.currentFlightsSize').html(flightItinerariesQuantity);
        }
        else {
            footer.find('.currentFlightsSize').html(currentNumFlightsToDisplay);
        }
    });

    /*
     * sticky header emulation
     *****************************************
     */
    $(window).scroll(function(){

        var scrollTop = $(window).scrollTop();
        var searchBar =  $('.searchBar');
        var barHeaderHeight = searchBar.outerHeight();
        var pageHeaderHeight;
        var padding;
        if (window.matchMedia("(min-width: 641px)").matches === true ) {
            pageHeaderHeight = $('.header').outerHeight();
            padding = 20;
        }
        else {
            pageHeaderHeight = 0;
            padding = 0;
        }

        if(scrollTop > pageHeaderHeight + padding){
            $('.pageContentHeader').css('padding-top', barHeaderHeight + padding);
            searchBar.addClass('fixedHeader');
            searchBar.css('margin-top', 0);
        }
        else {
            $('.pageContentHeader').css('padding-top','0');
            searchBar.removeClass('fixedHeader');
            searchBar.css('margin-top', padding);
        }
    });

    /*
     * flightTicketFooter click shows details
     *****************************************
     */
    $(document).on('click', '.flightTicketFooter', function(){
        if (window.matchMedia("(min-width: 641px)").matches === true ) {
            $(this).find('.flightDetailsBtn').trigger('click');
        }
    })
});

$(window).resize(function(){
    var flightTicketDetailsBox = $('.flightTicketDetailsBox.open.openOnMobile');
    if (window.matchMedia("(min-width: 641px)").matches === false && flightTicketDetailsBox.length ) {
        setFlightDetailsHeight(flightTicketDetailsBox);
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
    var flightTicketDetailsBox = $('.flightTicketDetailsBox.openOnMobile');
    body.addClass('bodyRotate');
    flightTicketDetailsBox.addClass('rotate').css('top',$(window).scrollTop());
    flightTicketDetailsBox.closest('.flightTicketBox').removeClass('active');
    setTimeout(function(){
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
      Ext.Ajax.request({url: _url,
          success: function(response){
              if (isValidAjaxResponse(response.responseText)) {
                  $(flightDetailsId).html(response.responseText);
              } else if (isAjaxSessionExpired(response.responseText)) {
                  forwardSessionExpired();
              }
              controls.unlock();
          },
          failure: function(response) {
              controls.unlock();
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