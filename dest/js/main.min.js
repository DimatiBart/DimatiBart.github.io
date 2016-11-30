var onYouTubePlayerAPIReady;

(function(){
    var headerModuleWrapper = $('.header-module-wrapper');
    if (headerModuleWrapper.length) {
        var youtubeFrame = $('.ytplayer');
        if (youtubeFrame.length) {

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

            if( isMobile.any()){
                isMobile = true;
            }
            else {
                isMobile = false;
            }

            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/player_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            onYouTubePlayerAPIReady = function() {
                youtubeFrame.each(function(i){
                    var $this = $(this);
                    if ($this.closest('.header-module').hasClass('desktop') && isMobile) {
                        return;
                    }
                    var module = $this.closest('.header-module');
                    var text = module.find('.text');
                    text.css('z-index: 2');
                    var link =  module.find('.link');
                    link.css({
                        "z-index": 1,
                        "background-color": "black"
                    });
                    var id = "youtube-player" + i;
                    $this.attr('id', id);
                    var url = $(this).attr('data-url');
                    var isStarted = false;
                    var player = new YT.Player(id, {
                        videoId: url,
                        playerVars: { 'autoplay': 1, 'controls': 0, 'showinfo': 0, 'rel':0, "wmode": "transparent"},
                        events: {
                            onReady: function(e){
                                player.mute();
                                player.playVideo();
                                setInterval(function(){
                                    if(player.getCurrentTime() > player.getDuration()-0.05){
                                        player.seekTo(0);
                                    }
                                }, 20)
                            },
                            onStateChange: function(e){
                                if (!isStarted && e.data == YT.PlayerState.PLAYING) {
                                    text.css('z-index: 1');
                                    link.css('z-index: 2');
                                    link.fadeTo("slow", 0);
                                    isStarted = true;
                                }
                                if (e.data == YT.PlayerState.ENDED){
                                    player.playVideo();
                                }
                            }
                        }
                    });
                });
            }
        }
    }
})();


// $(window).load(function(){
//     var upsModule = $('.ups-home-module');
//     if (upsModule.length) {
//         $(window).resize(function(){
//             if (window.matchMedia("(min-width: 641px)").matches === false) {
//                 var ups = upsModule.find('.ups-col');
//                 var heightArray = $.map(ups, function(elem){
//                     return $(elem).height();
//                 });
//                 var maxHeight = Math.max.apply(null, heightArray);
//                 upsModule.height(maxHeight);
//             }
//             else {
//                 upsModule.height('auto');
//             }
//         });
//         $(window).trigger('resize');
//     }
// })

(function(){
    var upsModule = $('.ups-home-module');
    if (upsModule.length) {
        $(window).resize(function(){
            if (window.matchMedia("(min-width: 641px)").matches === false) {
                var ups = upsModule.find('.ups-col');
                var heightArray = $.map(ups, function(elem){
                    return $(elem).height();
                });
                var maxHeight = Math.max.apply(null, heightArray);
                upsModule.height(maxHeight);
            }
            else {
                upsModule.height('auto');
            }
        });
        $(window).trigger('resize');
    }
})();