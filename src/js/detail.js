require(['config'], function () {
	require(['jquery', 'swiper', 'gdzoom'], function ($) {
		//多图放大镜

		var mySwiper2 = new Swiper('#swiper-container2',{
			watchSlidesProgress : true,
			watchSlidesVisibility : true,
			slidesPerView: 3,
			spaceBetween : 10,
			onClick: function(){
				var smallImgUrl = $(mySwiper2.clickedSlide).children('img')[0].src;
				var midImgUrl = smallImgUrl.replace('sma', 'mid');
				var bigImgUrl = smallImgUrl.replace('sma', 'big');
				$('.big-img-show').children('img').attr({
					'src': midImgUrl,
					'data-big' : bigImgUrl,
				})
			}
		})
		
		function updateNavPosition(){
			$('#swiper-container2 .active-nav').removeClass('active-nav')
			//mySwiper3.activeIndex 获取当前的index
			var activeNav = $('#swiper-container2 .swiper-slide').eq(mySwiper3.activeIndex).addClass('active-nav');

			if (!activeNav.hasClass('swiper-slide-visible')) {
				console.log(1);
				if (activeNav.index()>mySwiper2.activeIndex) {
					console.log(2);
					//mySwiper2.width 获取轮播图  的宽度
					var thumbsPerNav = Math.floor(mySwiper2.width/activeNav.width())-1

					//
					mySwiper2.slideTo(activeNav.index()-thumbsPerNav)
				}
				else {
					console.log(3);
					mySwiper2.slideTo(activeNav.index())
				}	
			}
		}

		//设置前进/后退按钮
		$('.next-button').click(function () {
			mySwiper2.slideTo(mySwiper2.activeIndex + 1);
			$('.prev-button').removeClass('button-disabled');
			if (mySwiper2.activeIndex + 4 >= 7) {
				$(this).addClass('button-disabled');
			} else {
				$(this).removeClass('button-disabled');
			}
			
		})
		$('.prev-button').click(function () {
			mySwiper2.slideTo(mySwiper2.activeIndex - 1);
			$('.next-button').removeClass('button-disabled');
			if (mySwiper2.activeIndex <= 0) {
				$(this).addClass('button-disabled');
			} else {
				$(this).removeClass('button-disabled');
			}
		})

		//设置放大镜
		$('.big-img-show').gdszoom({
			position: 'right',
			width: 400,
			height : 400,
		}).init()
	})
})