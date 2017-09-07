require(['config'], function () {
	require(['jquery','common'], function ($,com) {

		//加载尾部
		$('.load_footer').load('footer.html .footer');

		//事件加载
		$('.reg_ch_btn').click(function () {
			regCheck(function () {
				$.post('../api/reg_check.php', {
					username : $('.reg_box_name').val()
				}, function (res) {
					var res = JSON.parse(res);
					if (!res.res) {
						$('.reg_msg').html(res.msg).show()
					} else {
						//验证码倒计时
						var date = new Date();
						date = date.setMinutes(date.getMinutes() + 1);
						var timer = setInterval(function () {
							var nowDate = new Date();
							var num = parseInt((date - nowDate) / 1000);
							$('.reg_ch_btn').html(num + 's后重新发送');
							if (num === 0) {
								clearInterval(timer);
								$('.reg_ch_btn').html('发送验证码');
							}
						}, 30);
					}
				})
			})
		})

		$('.reg_btn').click(function () {
			regCheck(function () {
				if ($('.reg_box_check').val()) {
					if ($('.reg_box_name').val() === truePhone) {
						$.post('../api/reg.php', {
							username : $('.reg_box_name').val(),
							password : $('.reg_box_pwd').val()
						}, function (res) {
							var res = JSON.parse(res);
							if (res.res) {
								var date = new Date();
								var nextDate = new Date(date.getDate(date.setDate() + 7));
								com.Cookie.set('username', $('.reg_box_name').val(), nextDate, '/');
								window.location.href = '../index.html';
							} else {
								$('.reg_msg').html(res.msg).show();
							}
						})
					} else {
						$('.reg_msg').html('手机号不正确').show();
					}
				} else {
					$('.reg_msg').html('请输入验证码').show();
				}
			})
		})

		//reg 验证

		//存储验证手机号
		var truePhone;

		function regCheck(callback) {
			var username = $('.reg_box_name').val();
			var password = $('.reg_box_pwd').val();
			var showmsg = $('.reg_msg');
			if (username) {
				if (/^1[3578]\d{9}$/.test(username)) {
					truePhone = username;
					if (/^\w{6,16}$/.test(password)) {
						console.log(/^\w{6,16}$/.test(password))
						callback();
					} else {
						showmsg.html('密码格式不正确，请输入6-16密码(包含数字，字母，下划线)').show()
					}
				} else {
					showmsg.html('请输入正确手机号').show()
				}
				
			} else {
				showmsg.html('请输入手机号').show()
			}

		}
	})
})
