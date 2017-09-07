
require(['config'], function () {
		
	require(['jquery', 'common', 'default', 'swiper'], function ($, com, base) {
		//加载尾部
		$('.addFooter').load(base.baseUrl + 'html/footer.html .footer');
		
		//加载头部
		$('.addHeader').load(base.baseUrl + 'html/header.html .header');

		require(['header'], function () {
			
			$('.nav_fir_ul').removeClass('disabled');



			//轮播图
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

			
			/*
				滚动加载 生成节点
			*/
			var pageNo = 1;
			var qty = 10;
			var last = pageNo;
			listAdd();

			window.onscroll = function () {
				var scrollTop = window.scrollY;

				// 快滚动到底部滚动到底部
				if (scrollTop >= document.documentElement.scrollHeight - window.innerHeight - 200 && last !== pageNo) {
					console.log('scrolling.....');
					listAdd();
					last = pageNo;
				}
			}

			//发起ajax请求
			function listAdd() {
				// 发起ajax请求
				//请求数据生成节点
				$.get(base.baseUrl + 'api/list.php', {
					'pageNo': pageNo,
					'qty' : qty,
				}, function (res) {
					var res = JSON.parse(res);

					if (res.res) {
						var data = res.data.goodsData;
						console.log(data);

						var str = data.map(function (ele, idx) {
							var save = Number(ele.price) - Number(ele.ourPrice);
							return `
							<li>
								<div class="mc_goodsCard">
									<div class="mc_goodsCard_img">
										<img src="./${ele.imgUrl}" alt="">
									</div>
									<div class="mc_goodsCard_title">
										<p class="goods_category">${ele.category}</p>
										<p class="goods_goodsName">${ele.goodsName}</p>
									</div>
									<div class="mc_goodsCard_price">
										<div class="mc_goodsCard_ourProce">${ele.ourPrice}</div>
										<div class="mc_goodsCard_price">
											<p class="mc_goodsCard_price_show">${ele.price}</p>
											<p class="mc_goodsCard_price_save">立省 <span>${save}</span></p>	
										</div>
										<div class="mc_goodsCard_cartOnBtn">
											<button>加入购物车</button>
										</div>
									</div>
								</div>
							</li>
							`;
						}).join('');
						
						$('.mc_goods_show_ul')[0].innerHTML += str;
						if (pageNo < Math.ceil(res.data.total / qty)) {
							pageNo++;
						}
					}
				})
			}


		})
	})
})