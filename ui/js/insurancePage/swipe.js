(function($){
    var hasTouch = 'ontouchstart' in window;

    var EVENT_TAP_START = hasTouch ? 'touchstart' : 'mousedown';
    var EVENT_TAP_END = hasTouch ? 'touchend' : 'mouseup';
    var EVENT_TAP_MOVE = hasTouch ? 'touchmove' : 'mousemove';

    var getBrowserEvent = function (e) {
        return (hasTouch ? e.originalEvent.touches[0] : e);
    };

    $.event.special.swipe = {
        setup: function () {
            $(this).bind(EVENT_TAP_START + '.startSwap', function (e) {
                e = getBrowserEvent(e);

                var $el = $(this);

                var startX = e.screenX;
                var startY = e.screenY;

                var endX = startX;
                var endY = startY;

                var startTime = new Date().getTime();

                $(document).bind(EVENT_TAP_MOVE + '.moveSwap', function (ev) {
                    var event = getBrowserEvent(ev);

                    endX = event.screenX;
                    endY = event.screenY;

                    if (Math.abs(startX - endX) > 16) {
                        ev.preventDefault();
                    }
                }).unbind('.endSwap').bind(EVENT_TAP_END + '.endSwap', function (e) {
                    var deltaX = endX - startX;
                    var deltaY = endY - startY;

                    var deltaTime = (new Date().getTime()) - startTime;

                    if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 50) {
                        var direction = deltaX < 0 ? 'left' : 'right';

                        $el.trigger('swipe', [direction, deltaTime]);

                        e.preventDefault();
                        e.stopPropagation();
                    }

                    $(document).unbind('.moveSwap').unbind('.endSwap');
                });
            });
        },
        teardown: function() {
            $(this).unbind('.startSwap');
            $(document).unbind('.moveSwap').unbind('.endSwap');
        }
    };
})(jQuery);