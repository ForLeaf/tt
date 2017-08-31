<?php
	include 'connect.php';

	$username = isset($_GET['username'])? $_GET['username'] : '';
	$password = isset($_GET['password'])? $_GET['password'] : '';

	//md5加密
	$password = md5($password);

	//建立查询
	$sql = "select username from user where username='$username' and password='$password'";

	//获取查询结果
	$result = $conn->query($sql);

	if($result->num_rows > 0){
		echo resStr(true,[],'用户登录成功');
	}else{
		echo resStr(false,[],'用户名或密码不正确');
	}

	//释放查询内存
	$result->free();

	//关闭连接
	$conn->close();
	
?>