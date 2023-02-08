<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

	$executionStartTime = microtime(true) / 1000;

    //OpenCage- Forward GeoCode API
	$url='https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['country'] . '&key=12c285c4a085423d82d962afb2cffa4b';

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
	$output['data'] = $decode['results'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>