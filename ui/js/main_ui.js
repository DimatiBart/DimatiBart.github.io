/**
 * main.js
 **********************************
 * custom selects, custom checkboxes
 * lightboxes, tooltips
 */

$(document).ready(function(){
    /*
     * custom select
     **********************************
     */
    $(document).on('change.customSelectChange','.customSelect select',function(event){
        var select = $(this);
        if( select.find('option:selected').hasClass('defaultVal') ){
            select.addClass('defValSelected');
        }
        else {
            select.removeClass('defValSelected');
        }
    });
    $('.customSelect').find('select').trigger('change.customSelectChange');

    /*
     * custom checkbox
     **********************************
     */
    $('.customCheckbox input:checked').closest('.customCheckbox').addClass('checked');
    $(document).on('change.checkboxChange','.customCheckbox input[type="checkbox"]',function(event){
        event.stopPropagation();
        var checkbox = $(this);
        if( checkbox.prop('checked') == true ){
            checkbox.closest('.customCheckbox').addClass('checked');
        }
        else {
            checkbox.closest('.customCheckbox').removeClass('checked');
        }
    });
    $('.customCheckbox input[type="checkbox"]').trigger('change.checkboxChange');

    /*
     * tooltipBtn
     ***************************************
     */
    $(document).on('click','.tooltipBtn',function(event){
        event.preventDefault();
    });

    $(document).on('mouseenter.showTooltip','.tooltipBtn',function(){
        var tooltipName = $(this).data('lightbox-name');
        var tooltip = $(this).closest('.tooltipWrapp').find('.tooltipBox[data-lightbox-name="'+ tooltipName +'"]');
        showTooltip($(this),tooltip);
    });
    (function(){
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.MaxTouchPoints > 0));
        if( isTouch == true ){
            $(document).off('mouseenter.showTooltip');
            $(document).on('touchstart.showTooltip','.tooltipBtn',function(){
                var tooltipName = $(this).data('lightbox-name');
                var tooltip = $(this).closest('.tooltipWrapp').find('.tooltipBox[data-lightbox-name="'+ tooltipName +'"]');
                showTooltip($(this),tooltip);
            });
        }
    }());

    $(document).on('mouseleave.hideTooltip','.tooltipWrapp',function(){
        var tooltipName = $(this).find('.tooltipBtn').data('lightbox-name');
        var tooltip = $('.tooltipBox[data-lightbox-name="'+ tooltipName +'"]');
        hideTooltip(tooltip);
    });

    /*
     * mobileTooltipBtn
     ***************************************
     */
    (function(){
        var mql_640 = window.matchMedia("(min-width: 641px)");
        mql_640.addListener(mobileTooltipBtnHandler);
        mobileTooltipBtnHandler(mql_640);
    }());

    function mobileTooltipBtnHandler(mql) {
        var mobileTooltipBtn = $('.mobileTooltipBtn');
        var mobileTooltipBox = $('.mobileTooltipBox');
        var tooltipWrapp = $('.tooltipWrapp');
        if (mql.matches) {
            closeLightbox(mobileTooltipBox);
            mobileTooltipBtn.removeClass('lightboxBtn').addClass('tooltipBtn');
            mobileTooltipBox.removeClass('lightbox').addClass('tooltipBox');
            tooltipWrapp.removeClass('mobileView');
        } else {
            mobileTooltipBtn.removeClass('tooltipBtn').addClass('lightboxBtn');
            mobileTooltipBox.removeClass('tooltipBox').addClass('lightbox').css({
                "top":"50%",
                "left":"50%"
            });
            tooltipWrapp.addClass('mobileView');
        }
    }

    /*
     * lightboxBtn
     ***************************************
     */
    $(document).on('click.showLightbox','.lightboxBtn',function(event){
        event.preventDefault();
        var lightboxName = $(this).data('lightbox-name');
        var lightbox = $('.lightbox[data-lightbox-name="'+ lightboxName +'"]');
        showLightbox(lightbox);
    });

    /*
     * closeLightboxBtn
     ***************************************
     */
    $(document).on('click.closeLightbox','.closeLightboxBtn',function(event){
        event.preventDefault();
        var lightbox = $(this).closest('.lightbox');
        closeLightbox(lightbox);
    });
    $(document).on('click.closeLightboxLayer','.bgLayer',function(){
        var lightbox = $('.lightbox');
        $('body').removeClass('noScroll');
        $('.bgLayer').fadeOut(200,function(){
            $(this).remove();
        });
        lightbox.fadeOut(200);
    });

    /*
     * detailsBox
     ***************************************
     */
    $(document).on('click.toggleDetailsList','.detailsBox .detailsToggler',function(){
        $(this).find('.fullDetails').toggle();
        $(this).find('.lessDetails').toggle();
        $(this).closest('.detailsBox').find('.toggledDetails').stop(true,true).slideToggle(200);
    });

    (function(){
        var mql_640 = window.matchMedia("(min-width: 641px)");
        mql_640.addListener(toggleDetailsList);
        toggleDetailsList(mql_640);
    }());

    function toggleDetailsList(mql) {
        var detailsBox = $('.shoppingCartSection .detailsBox');
        if (mql.matches) {
            detailsBox.find('.toggledDetails').show();
        } else {
            detailsBox.find('.toggledDetails').hide();
            detailsBox.find('.fullDetails').show();
            detailsBox.find('.lessDetails').hide();
        }
    }

});

$(window).load(function(){
    /*
     * trigger change event for custom selects
     */
    $('.customSelect').find('select').trigger('change.customSelectChange');
});


/*
 * showTooltip
 ***************************************
 */
function showTooltip(tooltipBtn,tooltip){
    var topCoord;
    var leftCoord;
    var tooltipBox = $('.tooltipBox');
    var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.MaxTouchPoints > 0));
    hideTooltip(tooltipBox);
    if( tooltip.css('position') == 'fixed' ){
        tooltip.css('position','absolute');
    }
    if( tooltip.hasClass('rightSide') ){
        topCoord = tooltipBtn.position().top + tooltipBtn.outerHeight()/2 - 20;
        leftCoord = tooltipBtn.position().left + tooltipBtn.outerWidth() + 8;
    }
    else {
        topCoord = tooltipBtn.position().top + tooltipBtn.outerHeight() + 8;
        leftCoord = tooltipBtn.position().left - tooltip.outerWidth()/2 + tooltipBtn.outerWidth()/2;
    }
    tooltip.css({
        "top": topCoord,
        "left": leftCoord
    }).stop(true,true).fadeIn(350,function(){
        if( isTouch == true ){
            $(document).on('touchstart.closeTooltip',function(event){
                var tooltip = $('.tooltipBox');
                hideTooltip(tooltip);
            });
            $(document).on('touchstart.stopPropagation','.tooltipBox',function(event){
                event.stopPropagation();
            });
            $(document).on('touchstart.stopPropagation1','.tooltipWrapp',function(event){
                event.stopPropagation();
            });
        }
    });
}

/*
 * hideTooltip
 ***************************************
 */
function hideTooltip(tooltip){
    tooltip.stop(true,true).fadeOut(250);
}

/*
 * show lightbox
 ***************************************
 */
function showLightbox(lightbox){
    var lightboxName = lightbox.data('lightbox-name');
    var bgLayer = '<div class="bgLayer ' + lightboxName + '"' + '></div>';
    var pageContent = $('#pageContent');
    $('body').append(bgLayer);
    $('.bgLayer.'+lightboxName).fadeIn(400);
    setLightboxPosition(lightbox,pageContent);
    lightbox.fadeIn(300);
    var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.MaxTouchPoints > 0));
    if( isTouch == true ){
        $('.bgLayer').css('cursor','pointer');
    }
    $(window).on('resize.lightboxResize',function(){
        setLightboxPosition(lightbox,pageContent);
    });
}

/*
 * set lightbox position
 ***************************************
 */
function setLightboxPosition(lightbox,pageContent){
    if( (lightbox.outerHeight() + 20) >= $(window).height() ){
        $('body').removeClass('noScroll');
        lightbox.addClass('absolutePos').css({
            top: 20 + $(window).scrollTop() - pageContent.offset().top,
            position: 'absolute'
        });
    }
    else {
        $('body').addClass('noScroll');
        lightbox.removeClass('absolutePos').css({
            position: 'fixed',
            top: '50%'
        });
    }
}

/*
 * close lightbox
 ***************************************
 */
function closeLightbox(lightbox){
    $('body').removeClass('noScroll');
    var lightboxName = lightbox.data('lightbox-name');
    var bgLayer;
    if( lightbox.length == 1 ){
        bgLayer = $('.bgLayer.'+lightboxName);
    }
    else {
        bgLayer = $('.bgLayer');
    }
    bgLayer.fadeOut(250,function(){
        $(this).remove();
    });
    lightbox.fadeOut(250);
    $(window).off('resize.lightboxResize');
}
