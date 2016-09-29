$('body').addClass('touchDevice');

$(document).on('click', '.ticket',function(event){
    console.log('hey now');
    // var target = $(event.currentTarget);
    // if (!target.hasClass('no-results')){
    //     UIController._hideFlightLightbox();
    //     UIController._showFlightLightbox(target);
    // }
});

$(document).on('click', '.ticket .lightbox',function(event){
    console.log('wtf');
});

$(document).on('click', '.preloader',function(){
    $(this).toggleClass('pressed');
});