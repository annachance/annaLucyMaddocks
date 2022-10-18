<?php

    ini_set('display_errors', 'On');
	error_reporting(E_ALL);
    
	$executionStartTime = microtime(true) / 1000;

    //Open Exchange Rates API
    $url = 'https://openexchangerates.org/api/latest.json?'.$_REQUEST['currencyCode'].'app_id=30266cba1d97439cb23025bccb6285c8';  //not 100% sure on the request bit jusy yet?!?!?! or if this url is typed correct!!!

	//$url= 'https://openexchangerates.org/api/latest.json?app_id=0f67b20b1dd94b68aaabb87421ce8687&symbols='. $_REQUEST['currencyCode']
	//$url = 'https://api.exchangeratesapi.io/latest?symbols='. $_REQUEST['currencyCode'];
	//$url = 'https://v6.exchangerate-api.com/v6/47e5a1fc1aa02bbd3ccc8292/latest/'. $_REQUEST['currencyCode'];
	
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
	$output['data'] = $decode['currency']; //['rates']; 
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>