/**
 **********************************************
 * Tooltip
 ==============================================
 */

(function ( $ ) {

    $.fn.addTooltip = function(options) {

        var tooltip_tmpl = '<div class="customTooltip tmpl"><p class="tooltipText"></p></div>';
        var tooltip;
        var tooltipTarget = $(this);
        var settings = $.extend({
            bottomMargin: 5
        }, options );

        /*
         * event handlers
         */
        $(this).bind('mouseenter.showTooltip',function(){
            showTooltip($(this));
        });

        $(this).bind('mouseleave.hideTooltip',function(){
            hideTooltip();
        });

        /*
         * event handlers for touch devices
         */
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.MaxTouchPoints > 0));
        if( isTouch == true ){
            $(this).unbind('mouseenter.showTooltip');
            $(this).unbind('mouseleave.hideTooltip');
            $(this).bind('touchstart.showTooltip',function(){
                showTooltip($(this));
            });
        }

        /*
         * showTooltip
         */
        function showTooltip(tooltipElement){
            if( isTouch == true ){
                $('.customTooltip').remove();
            }
            $('body').append(tooltip_tmpl);
            tooltip = $('.customTooltip.tmpl').removeClass('tmpl');
            var tooltipText = tooltipElement.data('tooltip-text');
            var topCoord,
                leftCoord;
            tooltip.find('.tooltipText').html(tooltipText);
            topCoord = tooltipElement.offset().top  - tooltip.outerHeight() - settings.bottomMargin;
            leftCoord = tooltipElement.offset().left + tooltipElement.outerWidth()/2 - tooltip.outerWidth()/2;
            tooltip.css({
                top: topCoord,
                left: leftCoord
            }).stop(true,true).fadeIn(300,function(){
                if( isTouch == true ){
                    $(document).bind('touchstart.closeTooltip',function(){
                        hideTooltip();
                    });
                    tooltip.bind('touchstart.stopPropagation',function(event){
                        event.stopPropagation();
                    });
                    tooltipTarget.bind('touchstart.stopPropagation',function(event){
                        event.stopPropagation();
                    });
                }
            });
        }

        /*
         * hideTooltip
         */
        function hideTooltip(){
            tooltip.remove();
        }

        return this;
    };

}( jQuery ));


$(document).ready(function(){

    $('.withTooltip').addTooltip();

});
