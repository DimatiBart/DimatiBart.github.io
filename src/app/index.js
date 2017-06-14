var mySwiper = new Swiper ('.sta-app-scrolling-banner .swiper-container-sub', {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 60,
    loop: true,
    loopedSlides: 5,
    breakpoints: {
        640: {
            spaceBetween: 35
        }
    }
    // onSlideChangeStart: function () {
    //     slideChangeStartHandler(this, "hero");
    // }
});

var mySwiper1 = new Swiper ('.sta-app-scrolling-banner .swiper-container-hero', {
    centeredSlides: true,
    spaceBetween: 70,
    loop: true,
    loopedSlides: 5,
    pagination: ".sta-app-scrolling-banner .sta-app-phone .swiper-pagination",
    breakpoints: {
        640: {
            spaceBetween: 35
        }
    }
});

mySwiper.params.control = mySwiper1;
mySwiper1.params.control = mySwiper;