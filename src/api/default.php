<?php
	function resStr($res,$data,$msg){
		$arr = array(
			'data'=>$data,
			'msg'=>$msg,
			'res'=>$res
		);
		return json_encode($arr,JSON_UNESCAPED_UNICODE);
	}
?>