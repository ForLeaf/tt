require(['config'], function () {
	require(['jquery', 'swiper'], function () {
		var mySwiper2 = new Swiper('#swiper-container1', {
			//autoplay : 2000,
			watchSlidesProgress : true,
			watchSlidesVisibility : true,
			slidesPerView : 4,
			loop: true,
			centeredSlides: false,
			prevButton:'.swiper-button-prev',
			nextButton:'.swiper-button-next',
		}) 
	})
})