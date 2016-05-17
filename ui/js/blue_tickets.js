$(document).ready(function () {

    $('.blueTicketBtn').click(function(event){
        event.preventDefault();
        showBlueTicketPopup();
    });

    $('.blueTicketPopup .closePopupBtn').click(function(event){
        event.preventDefault();
        hidePopup();
    });

    $('.blueTicketBox').click(function(event){
        showBlueTicketPopup();
    });

    function showBlueTicketPopup() {
        var bgLayer = '<div class="bgLayer" id="bgLayer"></div>';
        $('body').append(bgLayer);
        var topPos;
        var minTopPos = 20;
        if($('.blueTicketPopup').outerHeight() > $(window).height()){
            topPos = $(document).scrollTop() + minTopPos;
        }
        else {
            topPos = ($(window).height() - $('.blueTicketPopup').outerHeight()) / 2 + $(document).scrollTop();
        }
        $('.blueTicketPopup').css('top', topPos).stop(true, true).fadeIn(300);
        $('#bgLayer').click(function(){
            hidePopup();
        });
    }

    function hidePopup() {
        $('#bgLayer').stop().fadeOut(300,function(){
            $(this).remove();
        });
        $('.blueTicketPopup').stop().fadeOut(300);
    }

});
