<?php
	include 'connect.php';
	
	$username = isset($_POST['username'])? $_POST['username'] : '';
	$goodsId = isset($_POST['goodsId'])? $_POST['goodsId'] : '';
	
	//DELETE FROM MyGuests where id=1;
	$sql = "select goodsId,num,ourPrice from cart where username='$username' and goodsId='$goodsId';";
	$result = $conn->query($sql);
	$row = $result->fetch_assoc();

	$result->free();

	$sql = "delete from cart where username='$username' and goodsId='$goodsId';";

	$result = $conn->query($sql);
	
	if($result){
		echo resStr(true,$row,'删除成功');
	}else{
		echo resStr(false,'',$conn->error);
	}

?>