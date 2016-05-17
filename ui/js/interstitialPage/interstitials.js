/**
 * interstitials.js
 **********************************
 */

$(document).ready(function() {
    var paymentInterstitial = $('.interstitialPaymentContent');

    if (paymentInterstitial.length) {
        paymentInterstitialTextModifier(paymentInterstitial.find('.interstitialPaymentTitle'));
        paymentInterstitialTextModifier(paymentInterstitial.find('.interstitialPaymentContentText'));
    } else {
        dotsLooping();
        searchNumbersAnimation();
    }
});

$(window).load(function(){
    var paymentInterstitial = $('.interstitialPaymentContent');
    if (!paymentInterstitial.length) {
        getBannersRequest(searchFormParams);
    }
});

/*
 * dotsLooping
 **********************************
 */
function dotsLooping(){
    var dotsLoopingElement = $('.dotsLooping');
    if( dotsLoopingElement.length > 0 ){
        var dot = '.';
        var timer = setInterval(function() {
            if( dotsLoopingElement.html().length == 3 ){
                dotsLoopingElement.html('');
            }
            else {
                dotsLoopingElement.html( dotsLoopingElement.html() + dot );
            }
        }, 500);
    }
}

/*
 * searchNumbersAnimation
 **********************************
 */
function searchNumbersAnimation(){
    var searchNumber = $('.searchingData').find('.count');
    if( searchNumber.length > 0 ){
        var increaseNumber = 0.011;
        var timer = setInterval(function() {
            searchNumber.each(function(){
                var newValue = $(this).html().replace(/,/g, ".");
                newValue = parseFloat(newValue) + increaseNumber;
                newValue = newValue.toFixed(3);
                newValue = newValue.toString().replace(/\./g, ",");
                $(this).html(newValue);
            });
        }, 100);
    }
}

/*
 * getBannersRequest
 **********************************
 */
function getBannersRequest(postData) {
    $.ajax({
        type: "POST",
        url: "InterstitialApplyRuleAction.do",
        data: postData,
        dataType: 'json',
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        statusCode: {
            200: function (response) {
                updateBannersImages(response);
            }
        }
    });
}

/*
 * updateBannersImages
 **********************************
 */
function updateBannersImages(response) {
    var swf = '.swf';
    var premiumBannerImg = $('#premiumBannerImg');
    var premiumBannerObj = $('#premiumBannerObj');
    var bannerImageHolder = premiumBannerImg.closest('.bannerImageHolder');
    var leaderboardBannerImg = $('#leaderboardBannerImg');
    var leaderboardBannerEmbed = $('#leaderboardBannerObj');

    if (response.premiumBanner && response.premiumBanner != ''){
        if ( response.premiumBanner.substring(response.premiumBanner.length - 4) == swf ){
            bannerImageHolder.addClass('withFlash');
            if ( response.fallbackBanner && response.fallbackBanner != '' ){
                premiumBannerImg.attr('src',response.fallbackBanner);
            }
            else {
                premiumBannerImg.remove();
            }
            premiumBannerObj.attr('src',response.premiumBanner).css('display','block');
            if ( response.hasOwnProperty('premiumBannerUrl') && response.premiumBannerUrl != '' ){
                premiumBannerObj.wrap('<a href="" target="_blank" class="prBannerLink"></a>');
                bannerImageHolder.find('.prBannerLink').attr('href',response.premiumBannerUrl);
            }
        }
        else {
            premiumBannerImg.attr('src', response.premiumBanner);
            premiumBannerObj.remove();
            if ( response.hasOwnProperty('premiumBannerUrl') && response.premiumBannerUrl != '' ){
                premiumBannerImg.wrap('<a href="" target="_blank" class="prBannerLink"></a>');
                bannerImageHolder.find('.prBannerLink').attr('href',response.premiumBannerUrl);
            }
        }
    }
    else if ( response.fallbackBanner && response.fallbackBanner != '' ){
        if ( response.fallbackBanner.substring(response.premiumBanner.length - 4) == swf ){
            premiumBannerImg.remove();
            premiumBannerObj.attr('src',response.fallbackBanner).css('display','block');
        }
        else {
            premiumBannerImg.attr('src', response.fallbackBanner);
            premiumBannerObj.remove();
        }
    }

    if (response.leaderboardBanner){
        if ( response.leaderboardBanner.substring(response.leaderboardBanner.length - 4) == swf ){
            leaderboardBannerImg.remove();
            leaderboardBannerEmbed.attr('src',response.leaderboardBanner).css('display','inline-block');
        }
        else {
            leaderboardBannerImg.attr('src', response.leaderboardBanner);
            leaderboardBannerEmbed.remove();
        }
    }
}


/**
 * payment interstitials text modifier
 * @param elem - jquery selector
 */
function paymentInterstitialTextModifier(elem) {
    function wrap(str) {
        var regex = /((<[^>]+>|\s+)*)(.+?)((<[^>]+>|\s+)+|$)/ig;
        return str.replace(regex, "$1<span class='interstitialPayment-words'><span>$3</span></span>$4");
    }

    if (elem.length > 0) {
        elem.each(function () {
            var textEl = $(this).html();

            $(this).html(wrap(textEl));
        });
    }
}