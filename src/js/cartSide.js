require(['config'], function () {
	require(['jquery', 'layer', 'default', 'common'], function ($, layer, base, com) {

		/*
			username
			goodsName
			category
			imgUrl
			num
			ourPrice
			goodsId
		*/
		//生成购物车函数
		function createCart(arr) {
			var qtysum = 0;
			var total_price = 0;
			var mokuai = arr.length ? arr.map(function (item) {
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
			}).join('') : '';

			$('.cs_cart_ul01').html(mokuai);
			$('#end').find('.goods_num').html(arr.length);
			$('#cs_total').find('.total_num').html(qtysum);
			$('#cs_total').find('.total_price').html(total_price.toFixed(2));
		}

		//根据是否登录用数据库或cookie生成购物车
		if (com.Cookie.get('username')) {
			//请求数据库数据
			$.post(base.baseUrl + 'api/search.php', {
				table: 'cart',
				data : com.Cookie.get('username'),
			}, function (res) {
				var res = JSON.parse(res);
				createCart(res.data);

				//覆盖cookie 暂时的解决版本
				var carlist = JSON.stringify(res.data);
				var date = new Date();
				var nextDate =new Date(date.setDate(date.getDate() + 7));
				com.Cookie.set('carlist', carlist, nextDate, '/');
			})
		} else {
			
			//初始化写入cookie
			var carlist = com.Cookie.get('carlist');
			carlist = carlist ? JSON.parse(carlist) : [];
			createCart(carlist);
		}


		//hover动画
		$('.cs_main').on('mouseenter', 'li', function () {
			$(this).children('div').css('display', 'block').animate({ left: -80 }, 500);			
		})
			.on('mouseleave', 'li', function () {
				$(this).children('div').stop().animate({ left: -100 }, function () {
					$(this).children('div').css('display', 'none');
			}.bind(this))
			})
		
		//返回顶部
		$('.cs_li_dingbu').click(function () {
			window.scrollTo(0, 0);
		})
		
		//购物车点击
		$('.cs_li_cart').click(function () {
			$('.cs_op_cart').animate({ left: -285 }, 300);
		})

		//检查用户是否登录
		if (com.Cookie.get('username')) {
			$('.cs_cart_type').css('display', 'none');
		} else {
			$('.cs_cart_type').css('display', 'block');
		}

		$('.cs_op_cart').on('click', function (event) {
			//点击登录
			if (event.target === $(this).find('.cs_login_btn')[0]) {
				layer.config({
					path : '../lib/layer-v3.0.3/layer/'
				})
				layer.open({
					type: 1,
					title: '你还未登录',
					area: '500px',
					shade: 0.2,
					//skin : 'layui-layer-molv'	
					content: `
					<div class="box" style="padding:10px 30px">
						<div class="form-group">
							<input type="email" class="form-control" id="username" placeholder="请输入手机号码">
						</div>
						<div class="form-group">
							<input type="password" class="form-control" id="password" placeholder="请输入密码">
						</div>
					</div>
					`,
					btn : 'submit',
					yes: function (index, layero) {
						$.post(base.baseUrl + 'api/login.php', {
							username: $('#username').val(),
							password: $('#password').val()
						}, function (res) {
							console.log(777)
							var res = JSON.parse(res);
							if (res.res) {
								layer.alert('登录成功',{
									icon: 1,
								})

								//将登陆信息写入Cookie
								var date = new Date();
								var nextDate = new Date(date.setDate(date.getDate() + 7));
								com.Cookie.set('username', $('#username').val(), nextDate, '/');

								//将购物车物品写入个人数据
								
								//请求数据库数据
								$.post(base.baseUrl + 'api/search.php', {
									table: 'cart',
									data : com.Cookie.get('username'),
								}, function (res) {
									var res = JSON.parse(res);
									createCart(res.data);

									//覆盖cookie 暂时的解决版本
									var carlist = JSON.stringify(res.data);
									var date = new Date();
									var nextDate =new Date(date.setDate(date.getDate() + 7));
									com.Cookie.set('carlist', carlist, nextDate, '/');
								})
								

								//1s 关闭弹窗
								setTimeout(function () {
									layer.closeAll();

									//隐藏 cs_cart_type
									$('.cs_cart_type').css('display', 'none');
									//cookie检查是否登录
									
									$('.in_login_btn').addClass('disabled');
									$('.in_reg_btn').addClass('disabled');
									$('.login_out').removeClass('disabled');
									$('.login_username').removeClass('disabled');
									$('.login_username').html(com.Cookie.get('username'));
									
								},1000)
							} else {
								layer.alert('登录失败，用户名或密码不正确', {
									icon : 2,
								})
								setTimeout(function () {
									layer.close(layer.index);	
								},1000)
							}
						 })
					},
				})
			}
			
			//点击关闭
			if (event.target === $(this).find('.cart_close')[0]) {
				$('.cs_op_cart').animate({ left: 40 }, 300);
			}

			//点击结算
			if (event.target === $(this).find('.submit_btn')[0]) {
				
				//提交订单 跳转页面
				window.location.href = base.baseUrl + 'html/currency.html';
				
			}

			//点击增加
			if ($(event.target).hasClass('num_add')) {
				var $currentli = $(event.target).parents('li');
				var num = Number($currentli.find('.cart_goods_num').html());
				//更新数据库
				if (com.Cookie.get('username')) {
					var goods = {
						username: com.Cookie.get('username'),
						num: 1,
						goodsId: $currentli.attr('data-guid'),
					};

					$.post(base.baseUrl + 'api/carlist.php', {
						data : JSON.stringify(goods),
					}, function (res) {
						var res = JSON.parse(res);
						if (res.res) { 
							var current_total_price = Number($('#cs_total').find('.total_price').html());
							var current_allnum = Number($('#cs_total').find('.total_num').html());
							var current_num = Number($currentli.find('.cart_goods_num').html());
							var dif_num = Number(res.data.num) - current_num;
							var dif_price = dif_num * res.data.ourPrice;
							console.log(dif_price,dif_num)
							$('#cs_total').find('.total_price').html((current_total_price + dif_price).toFixed(2));
							$('#cs_total').find('.total_num').html(current_allnum + dif_num);
							$currentli.find('.cart_goods_num').html(res.data.num);
						} else {
							console.log(res.msg)
						}
					})
				}
			}

			//点击减少
			if ($(event.target).hasClass('num_cut')) {
				var $currentli = $(event.target).parents('li');
				var num = Number($currentli.find('.cart_goods_num').html());
				//更新数据库
				if (com.Cookie.get('username')) {
					var goods = {
						username: com.Cookie.get('username'),
						num: -1,
						goodsId: $currentli.attr('data-guid'),
					};

					$.post(base.baseUrl + 'api/carlist.php', {
						data : JSON.stringify(goods),
					}, function (res) {
						var res = JSON.parse(res);
						if (res.res) { 
							var current_total_price = Number($('#cs_total').find('.total_price').html());
							var current_allnum = Number($('#cs_total').find('.total_num').html());
							var current_num = Number($currentli.find('.cart_goods_num').html());
							var dif_num = Number(res.data.num) - current_num;
							var dif_price = dif_num * res.data.ourPrice;
							console.log(dif_price,dif_num)
							$('#cs_total').find('.total_price').html((current_total_price + dif_price).toFixed(2));
							$('#cs_total').find('.total_num').html(current_allnum + dif_num);
							$currentli.find('.cart_goods_num').html(res.data.num);
						} else {
							console.log(res.msg)
						}
					})
				}
			}

			//点击删除
			if ($(event.target).hasClass('icon-lajixiang')) {
				var $currentli = $(event.target).parents('li');
				var num = Number($currentli.find('.cart_goods_num').html());
				//更新数据库
				if (com.Cookie.get('username')) {
					
					$.post(base.baseUrl + 'api/delete.php', {
						username: com.Cookie.get('username'),
						goodsId : $currentli.attr('data-guid'),
					}, function (res) {
						var res = JSON.parse(res);
						if (res.res) { 
							var current_total_price = Number($('#cs_total').find('.total_price').html());
							var current_allnum = Number($('#cs_total').find('.total_num').html());
							var all_price = Number(res.data.num) * parseFloat(res.data.ourPrice);
							var current_length = $('#end').find('.goods_num').html();
							$('#cs_total').find('.total_price').html((current_total_price - all_price).toFixed(2));
							$('#cs_total').find('.total_num').html(current_allnum - res.data.num);
							$('#end').find('.goods_num').html(current_length - 1);
							$currentli.remove();
						} else {
							console.log(res.msg)
						}
					})
				} 
			}
		})
			
	})
})