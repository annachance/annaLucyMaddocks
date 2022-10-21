<?php

	$executionStartTime = microtime(true) / 1000;

  
   // bdcb51e95a4da6befdbef7586487d059

   // https://api.countrylayer.com/v2/name/{name}
   // ? access_key = API_KEY & fullText=

	//$url='https://api.countrylayer.com/v2/all'.'?access_key = bdcb51e95a4da6befdbef7586487d059'. '?fullText=true';
    $url='https://api.countrylayer.com/v2/name/'.'?access_key = bdcb51e95a4da6befdbef7586487d059'.'?fullText=true';


	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode['country'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>