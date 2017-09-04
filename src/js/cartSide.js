require(['config'], function () {
	require(['jquery'], function () {
		//hover动画
		$('.cs_main').on('mouseenter', 'li', function () {
			$(this).children('div').css('display', 'block').animate({ left: -80 }, 500);			
		})
			.on('mouseleave', 'li', function () {
				$(this).children('div').stop().animate({ left: -100 }, function () {
					$(this).children('div').css('display', 'none');
			}.bind(this))
			})
		
		//购物车点击
		$('.cs_li_cart').click(function () {
			$('.cs_op_cart').animate({ left: -285 }, 300);
		})

		$('.cs_op_cart').on('click', function (e) {
			
			//点击关闭
			if (e.target === $(this).find('.cart_close')[0]) {
				$('.cs_op_cart').animate({ left: 40 }, 300);
			}

			//点击结算
			if (e.target === $(this).find('.submit_btn')[0]) {
				
				//提交订单 跳转页面
				

			}

			//点击增加
			if (e.target === $(this).find('.num_add')[0]) {
				
			}

			//点击减少
			if (e.target === $(this).find('.num_cut')[0]) {
				
			}

			//点击删除
			if (e.target === $(this).find('.goods_remove')[0]) {
				
			}
		})
			
	})
})