/*
 * M A I N
 * ================================
 */

$(document).ready(function () {

    var fareTermsHTML;
    /*
     * detailsBox
     */
    $(document).on('click.toggleDetailsList', '.detailsBox .detailsToggler', function () {
        $(this).find('.fullDetails').toggle();
        $(this).find('.lessDetails').toggle();
        $(this).closest('.detailsBox').find('.toggledDetails').stop(true, true).slideToggle(200);
    });

    /*
     * fareBreakdown link
     */
    $(document).on('click.fareBreakdownClick', '.fareBreakdownLink', function (event) {
        event.preventDefault();
        showPopup($('.fareBreakdownPopup'));
    });
    /*
     * fareTermsConditions link
     */
    $(document).on('click.fareTermsLinkClick', '.fareTermsLink', function (event) {
        event.preventDefault();
        if (fareTermsHTML) {
            showFareTermsPopup(fareTermsHTML);
        } else {
            var request = $.ajax({
                type: "POST",
                url: "/staglobe/getFareRulesInformation.do",
                data: "requestSource=Booking&selectedItinId=0",
                statusCode: {
                    200: function (response) {
                        fareTermsHTML = response;
                        showFareTermsPopup(response);
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
        }
    });

    function showFareTermsPopup(response){
        var popup = $('.fareTermsPopup');
        popup.find('.popupContent').html(response);
        showPopup(popup);
    }

    /*
     * close popup btn
     */
    $(document).on('click.closePopupBtn', '.popup .closePopupBtn,.popup .cancelBtn', function (event) {
        event.preventDefault();
        hidePopup();
    });

    /*
     * travel extras
     */
    if (window.matchMedia("(max-width: 640px)").matches) {
        $('.travelExtrasBox').addClass('collapsed');
    }
    $(document).on('click.toggleTravelExtras', '.travelExtrasBox.collapsed .travelExtrasBoxHeader', function (event) {
        var travelExtrasBox = $(this).closest('.travelExtrasBox');
        travelExtrasBox.toggleClass('open');
        travelExtrasBox.find('.travelExtrasContent .contentWrap').stop(true, true).slideToggle(200);
        travelExtrasBox.find('.orderingBox').stop().slideToggle(200);
    });

    /*
     * more details link
     */
    $(document).on('click.moreDetailsLinkClick', '.travelExtrasBox .moreDetailsLink', function (event) {
        event.preventDefault();
        var travelExtrasBox = $(this).closest('.travelExtrasBox');
        $(this).toggleClass("open");
        travelExtrasBox.find('.hiddenDetailsBox').stop(true).slideToggle(300);
    });

    /*
     * "why do i need this" link
     */
    $(document).on('click.whyDoINeedThisClick', '.travelExtrasBox .whyDoINeedThisLink', function (event) {
        event.preventDefault();
        var popup = $(this).closest('.travelExtrasBox').find('.whyDoINeedThisPopup');
        showPopup(popup);
    });

    /*
     * cancellationRulesLink
     */
    $(document).on('click.cancellationRulesLinkClick', '.cancellationRulesLink', function (event) {
        event.preventDefault();
        var popupName = $(this).data("popup-name");
        showPopup($('.cancellationRulesPopup[data-popup-name="' + popupName + '"]'));
    });

    /*
     * toggle promo code
     */
    $(document).on('click.togglePromoCode', '.promoCodeToggleBtn', function (event) {
        event.preventDefault();
        var promoCodeBox = $(this).closest('.promoCodeBox');
        promoCodeBox.toggleClass('open');
        promoCodeBox.find('.promoCodeRow').stop().slideToggle(200);
    });

    /*
     * sidebar travel extras toggleHiddenInfoBtn
     */
    $(document).on('click.toggleHiddenInfo', '.addTravelExtrasList li.collapsed .toggleHiddenInfoBtn', function (event) {
        event.preventDefault();
        var hiddenInfo = $(this).closest('li.collapsed').find('.hiddenInfo');
        hiddenInfo.stop(true, true).slideToggle(250);
        hiddenInfo.closest('li.collapsed').toggleClass('open');
    });

    /*
     * sidebar add travel extras
     */
    $(document).on('click.addTravelExtrasLink', '#addTravelExtrasList li header', function (event) {
        event.preventDefault();
        var travelExtrasName = $(this).closest('li').data('travel-extras-name');
        var destinationElement = $('.travelExtrasBox[data-travel-extras-name="' + travelExtrasName + '"]');
        if (destinationElement.length != 0 && $(this).closest('li').hasClass('collapsed') == false) {
            $('html, body').animate({
                scrollTop: destinationElement.offset().top
            }, 700);
        }
    });

    /*
     * show "remove product" tooltip for sidebar
     */
    $(document).on('click.cartProductRemoveLink', '.cartBox .cartBoxHeader .removeBtn', function (event) {
        event.preventDefault();
        var tooltip = $(this).closest('.cartBox').find('.removeTooltip');
        $('#pageSidebar').find('.removeTooltip').stop().fadeOut(300);
        tooltip.stop().fadeIn(300);
    });

    /*
     * show "remove product" tooltip for travel extras for sidebar
     */
    $(document).on('click.travelExtrasRemoveLink', '#addTravelExtrasList .removeBtn', function (event) {
        event.preventDefault();
        var tooltip = $(this).closest('.cell').find('.removeTooltip');
        $('#pageSidebar').find('.removeTooltip').stop().fadeOut(300);
        tooltip.stop().fadeIn(300);
    });

    /*
     * hide "remove product" tooltip
     */
    $(document).on('click.hideTooltip', '.tooltip .cancelBtn', function () {
        var tooltip = $(this).closest('.tooltip');
        hideTooltip(tooltip);
    });

    /*
     * call us popup
     */
    $(document).on('click.callUsLink', '.needHelpBox .callUsLink', function (event) {
        event.preventDefault();
        showPopup($('.callUsPopup'));
    });

    /*
     * window resize
     */
    // default view port size
    var viewportWidth = $(window).width();
    var screenHeight = screen.height;
    var breakpoint_640 = 640;

    $(window).resize(function () {
        if ($(window).width() != viewportWidth && $(window).width() != screenHeight) {
            if (window.matchMedia("(min-width: 641px)").matches) {
                $('.detailsBox .toggledDetails').show();
                showTravelExtrasBox();
                showFooterPromoCode();
            } else {
                hideToggledDetails();
                hideTravelExtrasBox();
                hideFooterPromoCode();
            }
        }
        else {
            if (viewportWidth >= breakpoint_640) {
                showTravelExtrasBox();
                $('.detailsBox .toggledDetails').show();
                showFooterPromoCode();
            }
        }
    });

    function hideTravelExtrasBox() {
        // travel extras box toggling
        var travelExtrasBox = $('.travelExtrasBox');
        travelExtrasBox.addClass('collapsed').removeClass('open');
        travelExtrasBox.find('.travelExtrasContent .contentWrap').hide();
        travelExtrasBox.find('.orderingBox').hide();
        // travel extras hidden details Box
        travelExtrasBox.find('.hiddenDetailsBox').hide();
    }

    function showTravelExtrasBox() {
        var travelExtrasBox = $('.travelExtrasBox');
        travelExtrasBox.removeClass('collapsed').removeClass('open');
        travelExtrasBox.find('.travelExtrasContent .contentWrap').show();
        travelExtrasBox.find('.orderingBox').show();
    }

    function hideToggledDetails() {
        var detailsBox = $('.detailsBox');
        detailsBox.find('.toggledDetails').hide();
        detailsBox.find('.fullDetails').show();
        detailsBox.find('.lessDetails').hide();
    }

    function showFooterPromoCode() {
        var promoCodeBox = $('.footerPromoCode');
        promoCodeBox.removeClass('open');
        promoCodeBox.find('.promoCodeRow').show();
    }

    function hideFooterPromoCode() {
        var promoCodeBox = $('.footerPromoCode');
        promoCodeBox.removeClass('open');
        promoCodeBox.find('.promoCodeRow').hide();
    }

    /*
     * studentYouthLink
     */
    $(document).on('click.studentYouthLink', '.studentYouthLink', function (event) {
        event.preventDefault();
        showPopup($('.studentYouthPopup'));
    });

    /*
     * addDonationBtn
     */
    $(document).on('click.addDonationBtn', '.addDonationBtn', function (event) {
        event.preventDefault();
        var promoCodeBox = $('.promoCodeBox.footerPromoCode');
        var promoCodeInput = promoCodeBox.find('.promoCodeInput');
        var donationRadioBtn = $('.donationSection').find('.donationRadioBtn');
        var validationResult = donationsValidation();
        if( validationResult == true ){
            promoCodeInput.val(donationRadioBtn.filter(':checked').val());
            if ( window.matchMedia("(min-width: 641px)").matches == false ){
                promoCodeBox.addClass('open');
                promoCodeBox.find('.promoCodeRow').stop().slideDown(200);
            }
        }
    });

    /*
     * removeProductBtn
     */
    $(document).on('click.removeProductBtn', '.removeProductBtn', function (event) {
        event.preventDefault();
        var bgLayer = '<div class="bgLayer tooltipBgLayer"></div>';
        var prodName = $(this).data('prod-name');
        $('body').append(bgLayer);
        $('#pageSidebar').find('.removeBtn[data-prod-name="'+ prodName +'"]').trigger('click').closest('.hiddenInfo').show().closest('li.collapsed').addClass('open');
    });

    /*
     * tooltipBgLayer
     */
    $(document).on('click.tooltipBgLayer', '.tooltipBgLayer', function () {
        var tooltip = $('.tooltip.removeTooltip:visible');
        hideTooltip(tooltip);
    });

    (function(){
        var mql_850 = window.matchMedia("(min-width: 850px)");
        mql_850.addListener(hideRemovingTooltip);
    }());

    function hideRemovingTooltip() {
        var tooltip = $('.tooltip.removeTooltip:visible');
        tooltip.hide();
        hideTooltip(tooltip);
    }

    $(document).on('click.sta-right', '#sta-mobile-header .sta-right', function () {
        var staMobileHeader = $('#sta-mobile-header')
        var cartBar = $('.cartBar');
        cartBar.animate({
            right: '80%'
        }, 400);
        staMobileHeader.animate({
            right: '80%'
        }, 400);
    });

    $(document).on('click', '.mm-opened .mm-page', function () {
        var staMobileHeader = $('#sta-mobile-header')
        var cartBar = $('.cartBar');
        cartBar.animate({
            right: '0'
        }, 400, "easy");
        staMobileHeader.animate({
            right: '0'
        }, 400, "easy");
    });
});

$(window).load(function () {
    /*
     * showExtrasTooltip
     */
    function showExtrasTooltip(extrasName, timeout) {
        var sidebarTooltip = $('.cartBox.extrasBox .travelExtrasTooltip');
        var cartBarTooltip = $('.cartBar .travelExtrasTooltip');
        var target = $('#addTravelExtrasList').find('li[data-travel-extras-name="' + extrasName + '"]');
        var targetCoords = target.position();
        var leftPadding = 10;
        var topCoords = targetCoords.top - sidebarTooltip.outerHeight() / 2 + target.outerHeight() / 2 - 1;
        var leftCoords = targetCoords.left - sidebarTooltip.outerWidth() - leftPadding;
        var cartBar = $('.cartBar');
        if (cartBar.css('display') == 'none') {
            sidebarTooltip.css({
                top: topCoords,
                left: leftCoords
            });
            sidebarTooltip.stop().fadeIn(350, function () {
                $(this).delay(timeout).fadeOut();
            });
        } else {
            cartBarTooltip.stop().fadeIn(350, function () {
                $(this).delay(timeout).fadeOut();
            });
        }
    }

    (function initExtrasTooltip() {
        var extrasName = $('input[name="tooltipTravelExtrasName"]').val();
        var tooltipTarget = $('#addTravelExtrasList li[data-travel-extras-name="' + extrasName + '"]');
        if (extrasName != '' && tooltipTarget.length != 0) {
            var extrasTooltipTimeout = setTimeout(function () {
                showExtrasTooltip(extrasName, 5000);
            }, 350);
        }
    })();
});


/*
 * showPopup
 */
function showPopup(popup) {
    var bgLayer = '<div class="bgLayer" id="bgLayer"></div>';
    var minTopPos = 20;
    var pageContent = $('#pageContent');
    var topPos;
    $('body').append(bgLayer);
    if (popup.outerHeight() > $(window).height()) {
        topPos = $(document).scrollTop() + minTopPos - pageContent.offset().top;
    }
    else {
        var topPos = ($(window).height() - popup.outerHeight()) / 2 + $(document).scrollTop() - pageContent.offset().top;
    }
    popup.css('top', topPos).stop(true, true).fadeIn(350);
    $('#bgLayer').click(function () {
        hidePopup();
    });
}

/*
 * hidePopup
 */
function hidePopup() {
    $('#bgLayer').fadeOut(300, function () {
        $(this).remove();
    });
    $('.popup').stop().fadeOut(300);
}

function hideTooltip(tooltip){
    $('.tooltipBgLayer').fadeOut(300, function () {
        $(this).remove();
    });
    tooltip.stop().fadeOut(300);
}

/*
 * Cross Sell popup
 */
function showCrossSellPopup() {
    if (window.matchMedia("(min-width: 641px)").matches) {
        var popup = $('.crossSellPopup');
        showPopup(popup);
    }
    else {
        if (validateOnSubmit() && !controls.isLocked()) {
            submitShoppingCart();
        }
    }

}


















 
