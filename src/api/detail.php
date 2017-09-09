<?php
	include 'connect.php';
	/*
		//要查询的表名
		table : ''
		//要查询的字段 默认全部
		field : []
		//查询条件 默认没有
		condition : {goodsId:'0001'}
	*/

	$data = isset($_POST['data'])? $_POST['data'] : '';
	
	if(!$data){
		echo resStr(false,'','数据不存在');
	}else{
		$obj = json_decode($data,true);
		$table = $obj['table'];

		if(!$table){
			echo resStr(false,'','未传入表名');
		}else{
			$field = isset($obj['field'])? $obj['field'] : '*';
			$condition = isset($obj['condition'])? $obj['condition'] : '';

			if(is_array($field)){
				$sql = "select ";
				for($i=0;$i<count($field);$i++){
					$opt = $field[$i];
					$sql .= "$opt,";
				}
				$sql = mb_substr($sql,0,strlen($sql)-1);
				$sql .= " from $table";
			}else{
				$sql = "select $field from $table";
			}

			if($condition){
				$sql .= " where ";
				foreach($condition as $key => $value){
					$sql .= "$key='$value' and ";
				}
				$sql = mb_substr($sql,0,strlen($sql)-4);
				$sql .= ";";

				$result = $conn->query($sql);
				$row = $result->fetch_all(MYSQLI_ASSOC);

				echo resStr(true,$row,'success');
			}else{
				$sql .= ";";
				$result = $conn->query($sql);
				$row = $result->fetch_all(MYSQLI_ASSOC);

				echo resStr(true,$row,'success');
			}

			$result->free();
			$conn->close();

		}
	}
?>