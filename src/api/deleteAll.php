<?php
	include 'connect.php';
	
	$data = isset($_POST['data'])? $_POST['data'] : '';
	
	$arr = json_decode($data,true);
	$nowArr = array();
	for($i=0;$i<count($arr);$i++){
		$username = $arr[$i]['username'];
		$goodsId = $arr[$i]['goodsId'];

		$sql = "select goodsId,num,ourPrice from cart where username='$username' and goodsId='$goodsId';";
		$result = $conn->query($sql);
		$row = $result->fetch_assoc();
		$result->free();

		$sql = "delete from cart where username='$username' and goodsId='$goodsId';";
		$result = $conn->query($sql);

		$nowArr[] = $row;
	}
	
	if($result){
		echo resStr(true,$nowArr,'删除成功');
	}else{
		echo resStr(false,'',$conn->error);
	}

?>