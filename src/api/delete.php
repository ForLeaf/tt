<?php
	include 'connect.php';
	
	$username = isset($_POST['username'])? $_POST['username'] : '';
	$goodsId = isset($_POST['goodsId'])? $_POST['goodsId'] : '';
	
	//DELETE FROM MyGuests where id=1;
	$sql = "delete from cart where username='$username' and goodsId='$goodsId'";

	$result = $conn->query($sql);
	
	if($result){
		echo resStr(true,'','删除成功');
	}else{
		echo resStr(false,'','删除失败');
	}

?>