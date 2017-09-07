
require(['config'], function () {
		
	require(['jquery', 'common', 'default', 'layer', 'jqfiy', 'swiper', 'lazyload'], function ($, com, base,layer) {
		//加载尾部
		$('.addFooter').load(base.baseUrl + 'html/footer.html .footer');
		
		//加载头部
		$('.addHeader').load(base.baseUrl + 'html/header.html .header');

		//加载购物车栏
		$('.addCartSide').load(base.baseUrl + 'html/cartSide.html .cartSide');

		require(['header','cartSide'], function () {
			
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
				if (scrollTop >= document.documentElement.scrollHeight - window.innerHeight - 400 && last !== pageNo) {
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
						var str = data.map(function (ele, idx) {
							var save = Number(ele.price) - Number(ele.ourPrice);
							return `
							<li data-guid="${ele.goodsId}">
								<div class="mc_goodsCard">
									<a href="${base.baseUrl}html/detail.html?goodsid=${ele.goodsId}">
										<div class="mc_goodsCard_img">
											<img class="lazy" alt="${ele.goodsName}" data-original="./${ele.imgUrl}">
										</div>
										<div class="mc_goodsCard_title">
											<p class="goods_category">${ele.category}</p>
											<p class="goods_goodsName">${ele.goodsName}</p>
										</div>
									</a>
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
					//懒加载
					$("img.lazy").lazyload({
						threshold : 120,
						placeholder : '/src/img/lazyload.gif',
					});
				})
			}

			//点击加入购物车

			// 保存购物车所有商品信息
			// 获取原cookie中的值
			var carlist = com.Cookie.get('carlist');
			carlist = carlist ? JSON.parse(carlist) : [];
			var username = com.Cookie.get('username');
			username = username ? username : null;

			$('.mc_goods_show_ul').on('click', '.mc_goodsCard_cartOnBtn', function () {
				
				//飞入效果
				var offset = $('#end').offset();
				var $img = $(this).parents('li').find('img');
				var flyer = $img.clone().addClass("u-flyer");

				flyer.css({
					width: 40,
					height : 40
				})

				flyer.fly({
					start: {
						left: event.clientX,
						top: event.clientY,
					},
					end: {
						left: offset.left,
						top: offset.top - window.scrollY,
						width: 20,
						height: 20
					},
					//动画结束后调用函数，清除飞入的图片
					onEnd: function () {
						flyer.remove();
						//   	// 刷新页面
						// location.reload();
					}
				});

				/*
					1.写入cookie
					2.生成购物车单
					3.写入数据库
				*/
				$currentLi = $(this).parents('li');

				var guid = $currentLi.attr('data-guid');
				var goods_img = $currentLi.find('img').prop('src');
				var goods_price = $currentLi.find('.mc_goodsCard_ourProce').html();
				var goods_category = $currentLi.find('.goods_category').html();
				var goods_Name = $currentLi.find('.goods_goodsName').html();

				// cookie中是否存在当前商品
				var hasGoods = false;
				for (var i = 0; i < carlist.length; i++) {
					if (carlist[i].goodsId === guid) {
						hasGoods = true;

						// 如果当前商品已经存在cookie中，则商品数量+1
						carlist[i].qty++;

						break;
					}
				}

				if (!hasGoods) {

					var goods = {
						goodsId: guid,
						category: goods_category,
						goodsName : goods_Name,
						ourPrice: goods_price,
						imgUrl: goods_img,
						num: 1
					};

					// 把当前商品信息写入carlist
					carlist.push(goods);
				}

				var date = new Date();
				var nextDate =new Date(date.setDate(date.getDate() + 7));
				com.Cookie.set('carlist', JSON.stringify(carlist),nextDate,'/');


				// 2）把cookie中的商品信息写入购物车
				var qtysum = 0;
				var total_price = 0;
				var mokuai = carlist.map(function (item) {
					qtysum += Number(item.num);
					total_price += Number(item.num) * parseFloat(item.ourPrice);
					return `
					<li data-guid="${item.goodsId}">
						<div class="goos_left">
							<a href="${base.baseUrl}html/detail.html?goodsid=${item.goodsId}"><img src="${item.imgUrl}"></a>
						</div>
						<div class="goods_right">
							<div class="goods_title">
								<a href="${base.baseUrl}html/detail.html?goodsid=${item.goodsId}">
									<span>${item.category} ${item.goodsName}</span>
								</a>
							</div>
							<div class="num_change">
								<a class="num_cut iconfont icon-jian"></a>
								<span class="cart_goods_num">${item.num}</span>
								<a class="num_add iconfont icon-jia"></a>
							</div>
							<div class="goods_price">${item.ourPrice}</div>
							<a class="goods_remove"><span class="iconfont icon-lajixiang"></span></a>
						</div>
					</li>
					`;
				}).join('');

				$('.cs_cart_ul01').html(mokuai);
				$('#end').find('.goods_num').html(carlist.length);
				$('#cs_total').find('.total_num').html(qtysum);
				$('#cs_total').find('.total_price').html(total_price.toFixed(2));

				//3 写入数据库
				/*
					username
					goodsName
					category
					imgUrl
					num
					ourPrice
					goodsId
				*/
				if (com.Cookie.get('username')) {
					
					var goods = {
						username : com.Cookie.get('username'),
						goodsName : goods_Name,
						category : goods_category,
						imgUrl : goods_img,
						num : 1,
						ourPrice : goods_price,
						goodsId : guid,
					}
					$.post(base.baseUrl + 'api/carlist.php', {
						data : JSON.stringify(goods),
					}, function (res) {
						console.log(res);
					})
				}
			})
		})
	})
})