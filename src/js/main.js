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

(function tabletDevicesCheck(){
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
        $('head').append(metaTag);
    }
})();

(function initUI(){
    var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.MaxTouchPoints > 0));
    if (isTouch){
        $('body').addClass('touchDevice');

        $(document).on('touchstart', '.flex-results-wrapper .ticket',function(event){
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

        $(document).on('touchend', '.flex-results-wrapper  .ticket',function(event){
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
        $(document).on('mouseenter', '.flex-results-wrapper  .ticket',function(){
            var index = $(this).index() + 1;
            $('.dates-container .date-cell:nth-child('+ index +')').addClass('hovered');
        });

        $(document).on('mouseleave', '.flex-results-wrapper .ticket',function(){
            var index = $(this).index() + 1;
            $('.date-cell.hovered').removeClass('hovered');
        });

        $(document).on('click', '.ticket',function(){
            if (!this.classList.contains('no-results')){
                console.log('Hello');
            }
        });
    }
})();
