var touchHelper = {
    lastTouchPos: {
        x: null,
        y: null
    },
    saveTouchPosition: function(event){
        var touch = event.originalEvent.touches[0];
        this.lastTouchPos.x = touch.pageX;
        this.lastTouchPos.y =  touch.pageY;
    },
    deleteTicketHover: function () {
        $('.ticket.hovered').removeClass('hovered');
        $('.date-cell.hovered').removeClass('hovered');
    }
};

$(function(){
    var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.MaxTouchPoints > 0));
    if (isTouch){
        $('body').addClass('touchDevice');

        $(document).on('touchstart', '.ticket',function(event){
            touchHelper.saveTouchPosition.call(touchHelper, event);
            touchHelper.deleteTicketHover ();
            $this = $(this);
            $this.addClass('hovered');
            var index = $this.index() + 1;
            $('.dates-container .date-cell:nth-child('+ index +')').addClass('hovered');
        });

        $(document).on('touchmove', '.ticket',function(event){
            touchHelper.saveTouchPosition.call(touchHelper, event);
        });

        $(document).on('touchend', '.ticket',function(event){
            $this = $(this);
            var index = $this.index() + 1;
            var endTarget = $(document.elementFromPoint(touchHelper.lastTouchPos.x, touchHelper.lastTouchPos.y)).closest('.ticket');
            if (!endTarget.hasClass('hovered')) {
                touchHelper.deleteTicketHover ();
            }

        });

        $(document).on('click', '.ticket',function(){
            event.preventDefault();
            if (!this.classList.contains('no-results')){
                console.log('Hello');
            }
        });
    }
    else {
        $(document).on('mouseenter', '.ticket',function(){
            var index = $(this).index() + 1;
            $('.dates-container .date-cell:nth-child('+ index +')').addClass('hovered');
        });

        $(document).on('mouseleave', '.ticket',function(){
            var index = $(this).index() + 1;
            $('.date-cell.hovered').removeClass('hovered');
        });

        $(document).on('click', '.ticket',function(){
            if (!this.classList.contains('no-results')){
                console.log('Hello');
            }
        });
    }


});