/*
 * Insurance page
 * ================================
 */

$(window).load(function(){
    if (window.matchMedia("(max-width: 640px)").matches) {
        setMobileTableSize();
        setSliderSize();
        slideToMostPopular();
    }
});

var viewportWidth;
var screenHeight;
var tooltip_tmpl = '<div class="insuranceTableTooltip tmpl"><h5 class="tooltipHeading"></h5><a href="#" class="closeBtn"></a><p></p></div>';

$(document).ready(function(){
    viewportWidth = $(window).width();
    screenHeight = screen.height;

    $(document).on('click.nextSlide','.sliderNextBtn',function(event){
        event.preventDefault();
        var insuranceTableSection = $(this).closest('.insuranceTableSection');
        var hiddenColumnsNumber = $(this).closest('.insuranceTableSection').data('hidden-columns');
        startToSlide("next",insuranceTableSection,hiddenColumnsNumber);
    });
    $(document).on('click.prevSlide','.sliderPrevBtn',function(event){
        event.preventDefault();
        var insuranceTableSection = $(this).closest('.insuranceTableSection');
        var hiddenColumnsNumber = $(this).closest('.insuranceTableSection').data('hidden-columns');
        startToSlide("prev",insuranceTableSection,hiddenColumnsNumber);
    });
    toggleSlideButtons();

    $(document).on('click.showAllTableRows','.insuranceTable .extraRowsToggleBtn',function(event){
        event.preventDefault();
        var extraRowsToggleBtn = $(this);
        toggleTableRows(extraRowsToggleBtn);
    });

    if( $('#insuranceTableHoverCheck').val() == 'true' ){
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.MaxTouchPoints > 0));

        $('.insuranceTable').addClass('withHover');
        $(document).on('mouseenter.showTooltip','.insuranceTable .infoRow .rowHeading',function(event){
            showInsuranceTableTooltip(event,'desktop');
        });
        $(document).on('mouseleave.hideTooltip','.insuranceTable .infoRow .rowHeading',function(){
            hideInsuranceTableTooltip();
        });


        $(document).on('click.showMobileTooltip','.insuranceTable .mobileHeadingRow td',function(event){
            showInsuranceTableTooltip(event,'mobile');
        });
        $(document).on('click.hideMobileTooltip','.insuranceTableTooltip .closeBtn',function(event){
            event.preventDefault();
            hideInsuranceTableTooltip();
        });

        if( isTouch == true && window.matchMedia("(min-width: 641px)").matches ){
            $(document).on('touchstart.showTabletTooltip','.insuranceTable .infoRow .rowHeading',function(event){
                showInsuranceTableTooltip(event,'tablet');
            });
        }
    }


    $('.mobileTableTopSection').on('swipe', function(event, direction) {
        var insuranceTableSection = $(this).closest('.insuranceTableSection');
        if (direction == 'left') {
            insuranceTableSection.find('.sliderNextBtn').trigger('click.nextSlide');
        }
        if (direction == 'right') {
            insuranceTableSection.find('.sliderPrevBtn').trigger('click.prevSlide');
        }
    });

    collapseExtraTableRows();
});

$(window).resize(function(){
    if (window.matchMedia("(min-width: 641px)").matches) {
        $('.insuranceTable').each(function(){
            setSizeToDefault($(this));
        });
        $('.sliderBox').find('.sliderItem').each(function(){
            setSizeToDefault($(this));
        });
        setDesktopTableSize();
    }
    else {
        setMobileTableSize();
        setSliderSize();
        resizeSliderShift();
    }
    if( $(window).width() != viewportWidth || viewportWidth >= 641 ){
        collapseExtraTableRows();
        hideInsuranceTableTooltip();
    }
});

function setMobileTableSize(insuranceTable){
    if( !insuranceTable ){
        insuranceTable = $('.insuranceTable');
    }
    insuranceTable.each(function(){
        var screenWidth = $(this).closest('.insuranceTableSection').width();
        var hiddenTableCol = 1;
        var tableColumns = $(this).find('.headingRow th').length - hiddenTableCol;
        var tableWidth = screenWidth * tableColumns;
        $(this).find('th').each(function(){
            $(this).css('width',screenWidth);
        });
        $(this).css('width',tableWidth);
    });
}

function setDesktopTableSize(){
    var insuranceTable = $('.insuranceTable');
    insuranceTable.each(function(){
        var tableTh = $(this).find('th');
        var tableThWidth = 100/tableTh.length + "%";
        tableTh.css('width',tableThWidth);
    });
}

function setSizeToDefault(element){
    //element.css('width','auto');
    element.css({
        'width': 'auto',
        'margin-left': 0
    });
}

function setSliderSize(tableSlider){
    if(!tableSlider){
        var tableSlider = $('.insuranceTableSection').find('.tableSlider');
    }
    tableSlider.each(function(){
        var sliderBox = $(this).find('.sliderBox');
        var slideSize = sliderBox.outerWidth();
        var slideCount = sliderBox.find('.sliderItem').length;
        var sliderWrapWidth = slideCount * slideSize;
        var sliderPrevBtn = $(this).find('.sliderPrevBtn');
        var sliderNextBtn = $(this).find('.sliderNextBtn');
        $(this).find('.sliderWrap').width(sliderWrapWidth);
        sliderBox.find('.sliderItem').width(slideSize);
        if( slideCount == 1 ){
            sliderPrevBtn.hide();
            sliderNextBtn.hide();
        }
    });
}

function startToSlide(slideType,insuranceTableSection,hiddenTableCol){
    //sliderBox
    var sliderBox = insuranceTableSection.find('.sliderBox');
    var sliderWrap = insuranceTableSection.find('.sliderWrap');
    var slideSize = sliderBox.outerWidth();
    var currentSlide = sliderBox.find('.sliderItem.current');
    var prevSliderIndex = currentSlide.index() - 1;
    var nextSliderIndex = currentSlide.index() + 1;
    var sliderShift;
    //insuranceTable
    var insuranceTable = insuranceTableSection.find('.insuranceTable');
    var tableSlideSize = insuranceTableSection.outerWidth();
    var currentTableSlide = insuranceTable.find('.headingRow th.current');
    var prevTableIndex = currentTableSlide.index() - 1;
    var nextTableIndex = currentTableSlide.index() + 1;
    var tableShift;
    if( hiddenTableCol === undefined ){
        hiddenTableCol = 1;
    }
    else {
        hiddenTableCol = parseInt(hiddenTableCol);
    }
    // sliderPagination
    var sliderPagination = insuranceTableSection.find('.sliderPagination');
    var currentPagination = sliderPagination.find('.current');

    currentSlide.removeClass('current');
    currentTableSlide.removeClass('current');
    currentPagination.removeClass('current');
    var slide_index;
    var tableCol_index;
    if( slideType == "next" ){
        if( currentSlide.index() == (sliderBox.find('.sliderItem').length-1) ){
            sliderShift = 0;
            tableShift = 0;
            slide_index = 0;
            tableCol_index = 0+hiddenTableCol;
        }
        else {
            sliderShift = nextSliderIndex * slideSize;
            tableShift = (nextTableIndex-hiddenTableCol) * tableSlideSize;
            slide_index = nextSliderIndex;
            tableCol_index = nextTableIndex;
        }
    }
    if( slideType == "prev" ){
        if( currentSlide.index() == 0 ){
            sliderShift = (sliderBox.find('.sliderItem').length-1)*slideSize;
            tableShift = (insuranceTable.find('th').length-1-hiddenTableCol)*tableSlideSize;
            slide_index = sliderBox.find('.sliderItem').length-1;
            tableCol_index = insuranceTable.find('.headingRow th').length-1;

        }
        else {
            sliderShift = prevSliderIndex * slideSize;
            tableShift = (prevTableIndex-hiddenTableCol) * tableSlideSize;
            slide_index = prevSliderIndex;
            tableCol_index = prevTableIndex;
        }
    }
    if( slideType == "mostPopular" ){
        var mostPopularIndex = insuranceTable.find('.mostPopularRow td.mostPopular').index() - hiddenTableCol;
        sliderShift = mostPopularIndex*slideSize;
        tableShift = mostPopularIndex*tableSlideSize;
        slide_index = mostPopularIndex;
        tableCol_index = mostPopularIndex+hiddenTableCol;
    }
    sliderWrap.removeClass('disableTransition');
    insuranceTable.removeClass('disableTransition');
    sliderBox.find('.sliderItem').eq(slide_index).addClass('current');
    insuranceTable.find('th').eq(tableCol_index).addClass('current');
    sliderPagination.find('span').eq(slide_index).addClass('current');
    sliderWrap.css("marginLeft",sliderShift*(-1));
    insuranceTable.css("marginLeft",tableShift*(-1));
}

function slideToMostPopular(){
    var insuranceTableSection = $('.insuranceTableSection');
    insuranceTableSection.each(function(){
        var mostPopular = $(this).find('tr.mostPopularRow').find('td.mostPopular');
        var hiddenColumnsNumber = $(this).data('hidden-columns');
        if( mostPopular.length > 0 ){
            startToSlide("mostPopular",$(this),hiddenColumnsNumber);
        }
    });

}

function resizeSliderShift(){
    var insuranceTableSection = $('.insuranceTableSection');
    insuranceTableSection.each(function(){
        var sliderWrap = $(this).find('.sliderWrap');
        var insuranceTable = $(this).find('.insuranceTable');
        var sliderShift = sliderWrap.find('.sliderItem').outerWidth() * sliderWrap.find('.sliderItem.current').index();
        var tableShift = insuranceTable.find('.headingRow .current').outerWidth() * (insuranceTable.find('.headingRow .current').index()-1);
        sliderWrap.addClass('disableTransition').css("marginLeft",sliderShift*(-1));
        insuranceTable.addClass('disableTransition').css("marginLeft",tableShift*(-1));
    });
}

function collapseExtraTableRows(){
    var maxShowingRows = 6;
    var insuranceTableSection = $('.insuranceTableSection');
    insuranceTableSection.each(function(){
        var insuranceTable = $(this).find('.insuranceTable');
        $(this).find('.extraRowsToggleBtn').removeClass('hideAll');
        insuranceTable.find('tbody').each(function(){
            var infoRowsNumber = $(this).find('.infoRow').length;
            if( infoRowsNumber > maxShowingRows ){
                $(this).find('.dividerRow td').addClass('withBtn');
                for( var i=infoRowsNumber; i>maxShowingRows; i-- ){
                    $(this).find('.infoRow').eq(i-1).hide();
                    $(this).find('.mobileHeadingRow').eq(i-1).hide();
                }
            }
        });
    });
}

function toggleTableRows(extraRowsToggleBtn){
    var maxShowingRows = 6;
    var infoRowsNumber = extraRowsToggleBtn.closest('tbody').find('.infoRow').length;
    extraRowsToggleBtn.toggleClass('hideAll');
    var infoRows = extraRowsToggleBtn.closest('tbody').find('.infoRow');
    if (window.matchMedia("(min-width: 641px)").matches) {
        for( var i=infoRowsNumber; i>maxShowingRows; i-- ){
            infoRows.eq(i-1).toggle();
        }
    }
    else {
        for( var i=infoRowsNumber; i>maxShowingRows; i-- ){
            infoRows.eq(i-1).toggle();
            extraRowsToggleBtn.closest('tbody').find('.mobileHeadingRow').eq(i-1).toggle();
        }
    }
}

function showInsuranceTableTooltip(event,tooltipType){
    hideInsuranceTableTooltip();
    var target = $(event.target);
    var tooltipHeading = target.data('tooltip-heading');
    var tooltipContent = target.data('tooltip-content');

    if( (tooltipHeading != '' && tooltipHeading != undefined) || (tooltipContent != '' && tooltipContent != undefined) ){
        var insuranceTableSection = $('.insuranceTableSection');
        insuranceTableSection.append(tooltip_tmpl);
        var targetCoords = target.position();
        var tooltip = $('.insuranceTableTooltip.tmpl');
        var tooltipTopCoord;
        var tooltipLeftCoord;
        var tooltipWidth;
        var animationDelay;

        if( tooltipType != undefined && tooltipType != '' ){
            if( tooltipType == 'desktop' || tooltipType == 'tablet' ){
                tooltipTopCoord = targetCoords.top + target.outerHeight();
                tooltipLeftCoord = targetCoords.left + target.outerWidth();
                tooltipWidth = insuranceTableSection.width() - target.outerWidth();
                animationDelay = 150;
            }
            if( tooltipType == 'tablet' ){
                tooltip.addClass('tablet');
            }
            if( tooltipType == 'mobile' ){
                tooltipTopCoord = targetCoords.top + target.outerHeight();
                tooltipLeftCoord = targetCoords.left;
                tooltipWidth = target.outerWidth();
                animationDelay = 0;
                tooltip.addClass('mobile');
            }
        }

        tooltip.find('.tooltipHeading').html(tooltipHeading);
        tooltip.find('p').html(tooltipContent);
        tooltip.css({
            'top': tooltipTopCoord,
            'left': tooltipLeftCoord,
            'width': tooltipWidth
        }).stop().delay(animationDelay).fadeIn(300,function(){
            $(this).removeClass('tmpl');
        });
    }
}

function hideInsuranceTableTooltip(){
    var tooltip = $('.insuranceTableTooltip');
    tooltip.remove();
}

function toggleSlideButtons(){
    var slides = $('.sliderWrap').find('.sliderItem');
    if( slides.length < 2 ){
        $('.sliderPrevBtn,.sliderNextBtn').hide();
    }
}



