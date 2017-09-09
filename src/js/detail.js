require(['config'], function () {
	require(['jquery','common','default','jqfiy', 'swiper', 'gdzoom','lazyload'], function ($,com,base) {
		$('.addHeader').load(base.baseUrl + 'html/header.html .header');
		$('.addFooter').load(base.baseUrl + 'html/footer.html .footer');
		$('.addCartSide').load(base.baseUrl + 'html/cartSide.html .cartSide');
		require(['header', 'cartSide'], function () {
			//获取页面件的传参
			var str = decodeURI(location.search);
			var searchArr = str.slice(1, ).split('=');
			/*
				//要查询的表名
				table : ''
				//要查询的字段 默认全部
				field : []
				//查询条件 默认没有
				condition : {goodsId:'0001'}
			*/
			var obj = {
				table: 'goods',
				condition : {},
			};
			obj.condition[searchArr[0]] = searchArr[1];

			//detail.php
			$.post(base.baseUrl + 'api/detail.php', {
				data : JSON.stringify(obj)
			}, function (res) {
				var res = JSON.parse(res);
				

				var mokuai01 = res.data.map(function (item) {
					var price = Number(item.price);
					var ourPrice = Number(item.ourPrice);
					var dif = (ourPrice / price).toFixed(2) * 10;
					return `
					<div class="de_main_left">
						<div class="big-img-show">
							<img class="lazy img_mid" data-original="../${item.imgUrl}" data-big="../${item.imgUrl_big}">
						</div>
						<div class="small-img-list">
							<div class="swiper-container" id="swiper-container2">
								<div class="swiper-wrapper">
									<div class="swiper-slide"><img class="lazy" data-original="../${item.imgUrl_sma}" alt="${item.goodsName}"></div>
								</div>
							</div>
							<div class="prev-button button-disabled"></div>
							<div class="next-button"></div>
						</div>
					</div>
					<div class="de_main_right">
						<div class="de_goods_title">
							<p>${item.category} ${item.goodsName}</p>
						</div>
						<div class="de_goods_description"><p>${item.description}</p></div>	
						<div class="de_goods_priceArea">
							<div class="de_goods_area1">
								<span class="de_goods_label">价格</span>
								<span class="de_goods_price">${item.price}</span>
							</div>
							<div class="de_goods_area2">
								<span class="de_goods_label">促销价</span>
								<span class="de_goods_ourPrice">${item.ourPrice}</span>
								<span class="de_discount">${dif}折</span>
							</div>
							<div class="de_goods_area3">
								<i></i>
								<p>最高可返<span>0</span>蜜豆</p>	
								<em>?</em>
							</div>
						</div>
						<div class="de_postage">
							<p>邮费 <span>满299元免邮</span></p>
						</div>
						<div class="de_goods_num_area clearfix">
							<p>数量</p>
							<div class="de_goods_numArea">
								<span class="de_goods_substract">-</span>
								<span class="de_goods_nums">1</span>
								<span class="de_goods_add">+</span>
							</div>
							<p class="de_goods_has">库存: <span class="de_repertory">有货</span></p>
						</div>
						<div class="submit_area">
							<div class="cart_add_area"><button class="cart_add_btn">加入购物车</button></div>
							<div class="collect_add_area"><button class="collect_add_btn">加入收藏</button></div>
						</div>
					</div>
					`;
				}).join('');

				var mokuai02 = res.data.map(function (item) {
					return `
					<div data-show="opt1">
						<div><img class="lazy" data-original="../${item.imgUrl_other_01}"></div>
						<div><img class="lazy" data-original="../${item.imgUrl_other_02}"></div>
						<div><img class="lazy" data-original="../${item.imgUrl_other_03}"></div>
					</div>
					<div data-show="opt2">
						<p>品牌<span>${item.category}</span></p>
						<p>产品名称<span>${item.goodsName}</span></p>
						<p>功效<span>${item.efficacy}</span></p>
						<p>保质期<span>3年（具体以收到实物为准）</span></p>
						<p>适用人群<span>所有人群</span></p>
						<p>原产地<span>韩国</span></p>
						<p>产品容量<span>${item.mAh}</span></p>
						<p>规格<span>${item.spec}</span></p>
					</div>
					`;
				}).join('');

				console.log($('.de_main_header'),$('.de_area3_show').find(`[data-show=opt3]`))
				$('.de_area3_show').find(`[data-show=opt3]`).before(mokuai02);
				$('.de_main_header').html(mokuai01);

				//懒加载
				$("img.lazy").lazyload({
					threshold : 120,
					placeholder : '/src/img/lazyload.gif',
				});

				//多图放大镜
				var mySwiper2 = new Swiper('#swiper-container2',{
					watchSlidesProgress : true,
					watchSlidesVisibility : true,
					slidesPerView: 4,
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
					if (mySwiper2.activeIndex + 4 >= 4) {
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
					height: 400,
				}).init();

				//点击切换
				$('.de_area3_nav').on('click', function (e) {
					console.log(e.target.nodeName === 'LI')
					if (e.target.nodeName === 'LI') {
						var dataShow = $(e.target).attr('data-show'); 
						$(e.target).addClass('nav_li_active').siblings('li').removeClass('nav_li_active');
						$('.de_area3_show').find(`[data-show=${dataShow}]`).css('display', 'block')
							.siblings('div').css('display', 'none');
					}
				})

				//点击显示大图
				$('.de_comment_div_01').click(function () {
					$('.de_comment_div_02').css('display', 'block');
				})
				//点击隐藏
				$('.de_comment_div_02').on('click', function (e) {
					if (e.target.nodeName === 'I') {
						$(this).css('display','none')
					}
				})

				//点击增加
				$('.de_goods_add').click(function () {
					var currentNum = Number($('.de_goods_nums').html());
					$('.de_goods_nums').html(currentNum + 1);
				})
				//点击减少
				$('.de_goods_substract').click(function () {
					var currentNum = $('.de_goods_nums').html();
					if (currentNum - 1 > 0) {
						$('.de_goods_nums').html(currentNum - 1);
					} else {
						$('.de_goods_nums').html(currentNum);
					}
				})

				//点击加入购物车

				// 保存购物车所有商品信息
				// 获取原cookie中的值
				var carlist = com.Cookie.get('carlist');
				carlist = carlist ? JSON.parse(carlist) : [];
				var username = com.Cookie.get('username');
				username = username ? username : null;

				$('.cart_add_btn').on('click', function () {
					
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

					var guid = res.data[0].goodsId;
					var goods_img = base.baseUrl + res.data[0].imgUrl;
					var goods_price = res.data[0].ourPrice;
					var goods_category = res.data[0].category;
					var goods_Name = res.data[0].goodsName;
					var num = $('.de_goods_nums').html();

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
							num: num,
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
								<a href="${base.baseUrl}html/detail.html?goodsId=${item.goodsId}"><img src="${item.imgUrl}"></a>
							</div>
							<div class="goods_right">
								<div class="goods_title">
									<a href="${base.baseUrl}html/detail.html?goodsId=${item.goodsId}">
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
							num : num,
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
})