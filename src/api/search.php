<?php
	include 'connect.php';
	
	$table = isset($_POST['table'])? $_POST['table'] : '';
	$data = isset($_POST['data'])? $_POST['data'] : '';
	
	if(!$table){
		echo resStr(false,'','查询的表不存在');
	}else{
		$sql = "select * from $table where username='$data'";

		$result = $conn->query($sql);
		$row = $result->fetch_all(MYSQLI_ASSOC);

		echo resStr(true,$row,'success');
	}
?>