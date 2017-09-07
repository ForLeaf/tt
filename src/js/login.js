require(['config'], function () {
	require(['jquery','common'], function ($,com) {

		//加载尾部
		$('.load_footer').load('footer.html .footer');

		//事件加载
		
		$('.reg_btn').click(function () {
			regCheck(function () {

				$.post('../api/login.php', {
					username : $('.reg_box_name').val(),
					password : $('.reg_box_pwd').val()
				}, function (res) {
					//console.log(res)
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
			})
		})

		//reg 验证

		function regCheck(callback) {
			var username = $('.reg_box_name').val();
			var password = $('.reg_box_pwd').val();
			var showmsg = $('.reg_msg');
			if (username) {
				if (/^1[3578]\d{9}$/.test(username)) {
					truePhone = username;
					if (/^\w{6,16}$/.test(password)) {
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
