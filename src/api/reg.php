<?php
	/*
		sql语句返回值
			* select : 数据
			* insert : true/false
			* delect : true/false
			* update : true/false
		XSS跨域脚本攻击
			* 永远不要相信客户端输入的信息的安全性
			* 对输入进行过滤
			* 对输出进行处理
	 */

	 include 'connect.php';

	 $username = isset($_GET['username'])? $_GET['username'] : '';
	 $password = isset($_GET['password'])? $_GET['password'] : '';

	 //查看用户名是否存在
	$sql = "select username from user where username = '$username'";
	$result = $conn->query($sql);

	

	if($result->num_rows > 0){
		echo resStr(false,[],'用户名已存在');

		//释放查询内存
		$result->free();

	}else{
		$password = md5($password);

		$sql = "insert into user (username,password) values ('$username','$password')";

		//获取结果
		$result = $conn->query($sql);

		if($result){
			echo resStr(true,[],'插入数据成功');
		}else{
			echo resStr(false,[],'Error: '.$sql.'<br>'.$conn->error);
		}
	}

	

	//关闭连接
	$conn->close();
?>