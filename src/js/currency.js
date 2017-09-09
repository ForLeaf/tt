require(['config'], function () {
	require(['jquery', 'common', 'default','layer'], function ($,com,base,layer) {
		//加载尾部
		$('.addFooter').load(base.baseUrl + 'html/footer.html .footer');
	
		//cookie检查是否登录
		if (com.Cookie.get('username')) {
			$('.in_login_btn').addClass('disabled');
			$('.in_reg_btn').addClass('disabled');
			$('.login_out').removeClass('disabled');
			$('.login_username').removeClass('disabled');
			$('.login_username').html(com.Cookie.get('username'));
		} else {
			$('.in_login_btn').removeClass('disabled');
			$('.in_reg_btn').removeClass('disabled');
			$('.login_out').addClass('disabled');
			$('.login_username').addClass('disabled');
		}

		//退出登录 清除用户cookie
		$('.login_out').click(function () {
			com.Cookie.remove('username');
			com.Cookie.remove('carlist');
			$('.in_login_btn').removeClass('disabled');
			$('.in_reg_btn').removeClass('disabled');
			$('.login_out').addClass('disabled');
			$('.login_username').addClass('disabled');
		})

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
				var sum = Number(item.num) * parseFloat(item.ourPrice);
				return `
				<tr class="row" data-guid="${item.goodsId}">
					<td class="col-md-1 radioGroup"><i class="radioItem group_01 active"></i></td>
					<td class="col-md-4">
						<div class="cu_goods_msg">
							<a href="${base.baseUrl}/html/detail.html?goodsId=${item.goodsId}">
								<img src="${item.imgUrl}" alt="${item.goodsName}">
								<span>${item.category} ${item.goodsName}</span>
							</a>
						</div>
					</td>
					<td class="col-md-1"><span>--</span></td>
					<td class="col-md-2"><span class="cu_goods_price">${item.ourPrice}</span></td>
					<td class="col-md-2">
						<div class="cu_goods_num">
							<span class="num_sub">-</span>
							<span class="num_show">${item.num}</span>
							<span class="num_add">+</span>
						</div>
					</td>
					<td class="col-md-1"><span class="total_price">${sum.toFixed(2)}</span></td>
					<td class="col-md-1"><span class="cu_remove_btn">删除</span></td>
				</tr>
				`;
			}).join('') : '';
			$('.thr_body').html(mokuai);
			$('.cu_goods_totalPrice').html(total_price.toFixed(2));
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
			createCart(res.data);
		}

		$('.cu_main_table01').on('click', function (e) {
			if ($(e.target).hasClass('radioItem')) {
				$(e.target).toggleClass('active');
			}
			if ($(e.target).hasClass('selectAll')) {
				$('.radioItem').addClass($(e.target).hasClass('active') ? 'active' : '');
				$('.radioItem').removeClass($(e.target).hasClass('active') ? '' : 'active');
			}
			if($(e.target).hasClass('selectGroup_01')){
				$('.group_01').addClass($(e.target).hasClass('active') ? 'active' : '');
				$('.group_01').removeClass($(e.target).hasClass('active') ? '' : 'active');
			}

			//点击增加
			if ($(e.target).hasClass('num_add')) {
				var $currentTr = $(e.target).parents('tr');
				var num = Number($currentTr.find('.num_show').html());
	
				if (com.Cookie.get('username')) {
					var goods = {
						username: com.Cookie.get('username'),
						num: 1,
						goodsId: $currentTr.attr('data-guid'),
					};
	
					$.post(base.baseUrl + 'api/carlist.php', {
						data : JSON.stringify(goods),
					}, function (res) {
						var res = JSON.parse(res);
						if (res.res) {
							var allPrice = Number(res.data.num) * parseFloat(res.data.ourPrice);
							var currentPrice = $(`[data-guid = ${res.data.goodsId}]`).find('.total_price').html();
							var dif = allPrice - currentPrice;
							var current_total_price = Number($('.cu_goods_totalPrice').html());
	
							$(`[data-guid = ${res.data.goodsId}]`).find('.total_price').html(allPrice.toFixed(2));
							$('.cu_goods_totalPrice').html((current_total_price + dif).toFixed(2));
							//更新span
							$currentTr.find('.num_show').html(res.data.num);
						} else {
							console.log(res.msg)
						}
					})
				}
			}
	
			//点击减少
			if ($(e.target).hasClass('num_sub')) {
				var $currentTr = $(e.target).parents('tr');
				var num = Number($currentTr.find('.num_show').html());
				//更新数据库
				if (com.Cookie.get('username')) {
					var goods = {
						username: com.Cookie.get('username'),
						num: -1,
						goodsId: $currentTr.attr('data-guid'),
					};
	
					$.post(base.baseUrl + 'api/carlist.php', {
						data : JSON.stringify(goods),
					}, function (res) {
						var res = JSON.parse(res);
						if (res.res) {
							var allPrice = Number(res.data.num) * parseFloat(res.data.ourPrice);
							var currentPrice = $(`[data-guid = ${res.data.goodsId}]`).find('.total_price').html();
							var dif = allPrice - currentPrice;
							var current_total_price = Number($('.cu_goods_totalPrice').html());
	
							$(`[data-guid = ${res.data.goodsId}]`).find('.total_price').html(allPrice.toFixed(2));
							$('.cu_goods_totalPrice').html((current_total_price + dif).toFixed(2))
							//更新span
							$currentTr.find('.num_show').html(res.data.num);
						} else {
							console.log(res.msg)
						}
					})
				}
			}
	
			//点击删除
			if ($(e.target).hasClass('cu_remove_btn')) {
				var $currentTr = $(e.target).parents('tr');
				//更新数据库
				if (com.Cookie.get('username')) {

					layer.config({
						path : '../lib/layer-v3.0.3/layer/'
					})
					layer.confirm('您确定要删除吗？',{
						btn : ['确定','取消']
					}, function (index) {
						
						$.post(base.baseUrl + 'api/delete.php', {
							username: com.Cookie.get('username'),
							goodsId : $currentTr.attr('data-guid'),
						}, function (res) {
							var res = JSON.parse(res);
							if (res.res) {
								var allPrice = Number(res.data.num) * parseFloat(res.data.ourPrice);
								var current_total_price = Number($('.cu_goods_totalPrice').html());
		
								$('.cu_goods_totalPrice').html((current_total_price - allPrice).toFixed(2))
								//更新span
								$currentTr.remove();
							} else {
								console.log(res.msg)
							}
							layer.close(index);
						})
					}, function (index) {
						layer.close(index);
					})
				} 
			}

			//点击全体删除
			if ($(e.target).hasClass('deleteAll_icon')) {
				layer.config({
					path : '../lib/layer-v3.0.3/layer/'
				})
				layer.confirm('您确定要删除吗？',{
					btn : ['确定','取消']
				}, function (index) {
					var domActive = $('.radioItem.active.group_01').parents('tr');
					var arr = [];
					for (var i = 0; i < domActive.length; i++){
						var obj = {};
						obj.goodsId = $(domActive[i]).attr('data-guid');
						obj.username = com.Cookie.get('username');
						arr.push(obj);
					}
					
					$.post(base.baseUrl + 'api/deleteAll.php', {
						data : JSON.stringify(arr)
					}, function (res) {
						var res = JSON.parse(res);
						if (res.res) {
							var allPrice = 0;
							res.data.forEach(function (ele,idx) {
								$(`[data-guid=${ele.goodsId}]`).remove();
								allPrice += Number(ele.num) * parseFloat(ele.ourPrice);
							})
							var current_total_price = Number($('.cu_goods_totalPrice').html());
	
							$('.cu_goods_totalPrice').html((current_total_price - allPrice).toFixed(2));

						} else {
							console.log(res.msg)
						}
						layer.close(index);
					})


				}, function (index) {
					layer.close(index);
				})
			}
			var num = $('.radioItem.active').parents('tr').find('.num_show');
			var price = $('.radioItem.active').parents('tr').find('.cu_goods_price');
			var total_price = 0;

			for (var i = 0; i < num.length; i++){
				var _num = Number(num[i].innerText);
				var _price = parseFloat(price[i].innerText);
				total_price += _num * _price;
			}
			$('.cu_goods_totalPrice').html(total_price.toFixed(2));

		})
	})
})