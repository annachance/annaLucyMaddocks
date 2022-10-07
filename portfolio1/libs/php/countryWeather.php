<?php

    ini_set('display_errors', 'On');
	error_reporting(E_ALL);
    
	$executionStartTime = microtime(true) / 1000;

    //4d5ab8a2e54f4fc6266e34bcf9c514ab
    // http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}
    
    //Open Weather API
    $url='http://api.openweathermap.org/data/2.5/forecast?id=524901'.'&appid=4d5ab8a2e54f4fc6266e34bcf9c514ab';



	//$url='https://api.openweathermap.org/data/2.5/onecall?lat=' . $_REQUEST['lat'] . '&lon=' . $_REQUEST['lon'] . '&exclude=minutely,hourly,daily&alerts&appid=9d7d5443594b4a598ad2f7764d07115d';
    //$url='https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=minutely,hourly,daily&alerts&appid=9d7d5443594b4a598ad2f7764d07115d';
    
    
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
	$output['data'] = $decode;   //['current']  ?!?!?!?
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>