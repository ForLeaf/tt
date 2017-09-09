<?php
	include 'connect.php';

	//获取前端传来的数据

	/*
		pageNo
		qty
		classifyId  // 可选 默认无
		order // 可选 默认 goodsId 
		sort  // 可选 默认 asc  /desc

	*/
	
	$pageNo = isset($_GET['pageNo'])? $_GET['pageNo'] : 1;
	$qty = isset($_GET['qty'])? $_GET['qty'] : 10;
	$classifyId = isset($_GET['classifyId'])? $_GET['classifyId'] : '';
	$order = isset($_GET['order'])? $_GET['order'] : 'goodsId';
	$sort = isset($_GET['sort'])? $_GET['sort'] : 'asc';
	$search = isset($_GET['search'])? $_GET['search'] : '';

	//sql语句
	$sql = "select * from goods";

	//利用php条件语句拼接sql
	if($classifyId){
		$sql .= " where classifyId='$classifyId'";
	}
	if($search){
		$search = "%$search%";
		$sql .= " where goodsName like '$search' or classify like '$search' or category like '$search'";
	}
	if($order){
		$sql .= " order by $order";
	}

	if($sort){
		$sql .= " $sort";
	}
	
	$startIdx = $qty * ($pageNo - 1);

	$sql .= " limit $startIdx,$qty";

	$sql ."<br>" .$search; 

	//echo $sql;
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