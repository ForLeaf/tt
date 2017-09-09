<?php
	include 'connect.php';

	$data = isset($_POST['data'])? $_POST['data'] : '';

	$data = json_decode($data,true);

	if(!$data){
		echo resStr(false,'','数据不存在');
	}else{
		/*
			username
			goodsName
			category
			imgUrl
			num
			ourPrice
			goodsId
		*/
		
		$username = $data['username'];
		$goodsId = $data['goodsId'];
		$qty = $data['num'];
		
		$sql = "select num from cart where username='$username' and goodsId='$goodsId'";
		$result = $conn->query($sql);
		$row = $result->fetch_row();
		$result->free();
		//update MyGuests set name='Mary' where id=1;
		if($row[0]){
			$num = $row[0] + $qty;
			if($num < 1){
				echo resStr(false,'','不能再减了');
			}else{
				$sql = "update cart set num=$num where username='$username' and goodsId='$goodsId'";
				$result = $conn->query($sql);
				if($result){
					$sql = "select goodsId,num,ourPrice from cart where username='$username' and goodsId='$goodsId';";
					$res = $conn->query($sql);
					$row = $res->fetch_assoc();

					echo resStr(true,$row,'更新数据成功');
				}else{
					echo resStr(false,'',$conn->error);
				}
			}

		}else{

			$name = $data['goodsName'];
			$price = $data['ourPrice'];
			$imgurl = $data['imgUrl'];
			$category = $data['category'];

			$sql = "insert into cart(username,goodsName,category,imgUrl,num,ourPrice,goodsId)";
			$sql .= " values ('$username','$name','$category','$imgurl',$qty,$price,'$goodsId');";
			$result = $conn->query($sql);
			if($result){
				$sql = "select * from cart where username='$username' and goodsId='$goodsId';";
				$result = $conn->query($sql);
				$row = $result->fetch_all(MYSQLI_ASSOC);

				echo resStr(true,$row,'插入数据成功');
			}else{
				echo resStr(false,'',$conn->error);
			}
		}
	
		$conn->close();
	
	}

?>