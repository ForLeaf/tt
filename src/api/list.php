<?php
	include 'connect.php';

	//获取前端传来的数据
	$pageNo = isset($_GET['pageNo'])? $_GET['pageNo'] : 1;
	$qty = isset($_GET['qty'])? $_GET['qty'] : 10;
	$cate = isset($_GET['cate'])? $_GET['cate'] : '';

	//sql语句
	$sql = "select * from goods";

	//利用php条件语句拼接sql
	if($cate){
		$sql .= " where category='$cate'";
	}

	$startIdx = $qty * ($pageNo - 1);

	$sql .= " limit $startIdx,$qty";

	//获取查询结果
	$result = $conn->query($sql);

	//使用查询结果集
	$row = $result->fetch_all(MYSQLI_ASSOC);

	//释放结果集
	$result->free();

	$res = array(
		'pageNo'=>$pageNo,
		'qty'=>$qty,
		'total'=>$conn->query('select count(*) from goods')-> fetch_row()[0],
		'goodsData'=>$row,
		'status'=>200
	);

	echo resStr(true,$res,'success');

	//关闭连接
	$conn->close();


?>