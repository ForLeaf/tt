<?php
	include 'connect.php';

	$username = isset($_POST['username'])? $_POST['username'] : '';

	$sql = "select username from user where username = '$username'";
	$result = $conn->query($sql);

	if($result->num_rows > 0){
		echo resStr(false,[],'此号码已被注册');
	}else{
		echo resStr(true,[],'success');
	}
?>