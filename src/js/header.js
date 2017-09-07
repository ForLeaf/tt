

require(['config'], function () {
	require(['jquery', 'common','default'], function ($,com,base) {
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
			$('.in_login_btn').removeClass('disabled');
			$('.in_reg_btn').removeClass('disabled');
			$('.login_out').addClass('disabled');
			$('.login_username').addClass('disabled');
		})

		//搜索款聚焦
		$('.search').focus(function () {
			$(this).parent().addClass('on_foucs');
		})

		//搜索框输入
		$('.search').on('input', function (event) {
			if ($(this).val()) {
				$('.clear_search').removeClass('disabled');
			} else {
				$('.clear_search').addClass('disabled');
			}
		})

		//清除搜索内容
		$('.clear_search').on('click', function () {
			$('.search').val('');
			$(this).addClass('disabled');
		})

		//搜索款搜索
		$('.icon_search').on('click', function () {
			if ($('.search').val()) {
				window.location.href = base.baseUrl + 'html/search.html?search=' + encodeURI($('.search').val()); 
			}
			
		})

		$('.search').keyup(function (event) {
			if ($(this).val() && event.keyCode === 13) {
				window.location.href = base.baseUrl + 'html/search.html?search=' + encodeURI($('.search').val());
			}
		})
	})
})
