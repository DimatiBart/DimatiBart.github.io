/*
 * sidebar
 * ================================
 */

var sidebarSettings = {
    defaultPos: '',
    defaultMarginRight: -260
};

$(window).load(function(){
    initSidebar();
});

$(window).resize(function(){
    if ( window.matchMedia("(min-width: 641px)").matches == true ){
        var sidebar = $('#pageSidebar');
        if( sidebar.outerHeight() > window.innerHeight ){
            setToDefault();
        }
        if( sidebar.hasClass('scrolled') ){
            sidebar.css({
                marginRight: $('#pageContent').outerWidth()/2*(-1)
            });
        }
        initSidebar();
    }
});

$(window).scroll(function(){
    if ( window.matchMedia("(min-width: 641px)").matches == true ){
        setSidebarPosition();
        toggleSidebarTopBtn('.checkoutBtn.topBtn','.checkoutBtn.bottomBtn');
    }
});

function initSidebar(){
    sidebarSettings.defaultPos = $('#pageContent').offset();
    setSidebarPosition();
    toggleSidebarTopBtn('.checkoutBtn.topBtn','.checkoutBtn.bottomBtn');
}

function setSidebarPosition(){
    var sidebar = $('#pageSidebar');
    var pageContent = $('#pageContent');
    if ( window.matchMedia("(min-width: 641px)").matches == true ){
        if( $(window).scrollTop() > sidebarSettings.defaultPos.top &&
            sidebar.outerHeight() < window.innerHeight &&
            sidebar.outerHeight() < pageContent.find('.main').outerHeight() ){
            sidebar.addClass('scrolled');
            sidebar.css({
                marginRight: pageContent.outerWidth()/2*(-1)
            });
            if( ($(window).scrollTop() + sidebar.outerHeight()) > (pageContent.outerHeight() + pageContent.offset().top) ){
                sidebar.addClass('bottomPos');
            }
            else {
                sidebar.removeClass('bottomPos');
            }
        }
        else {
            setToDefault();
        }
    }
    else {
        setToDefault();
    }
}

function setToDefault(){
    $('#pageSidebar').removeClass('scrolled').css({
        marginRight: sidebarSettings.defaultMarginRight
    });
}

function toggleSidebarTopBtn(topBtn,bottomBtn){
    var sidebar = $('#pageSidebar');
    if( sidebar.find(topBtn).length !=0 && sidebar.find(bottomBtn).length != 0 ) {
        var topBtn = sidebar.find(topBtn);
        var bottomBtn = sidebar.find(bottomBtn);
        var bottomBtnTopPos = bottomBtn.offset().top + bottomBtn.outerHeight();
        var screenSize = window.innerHeight + $(window).scrollTop();
        if( bottomBtnTopPos > screenSize ){
            topBtn.addClass('visible');
        }
        else {
            topBtn.removeClass('visible');
        }
    }
}