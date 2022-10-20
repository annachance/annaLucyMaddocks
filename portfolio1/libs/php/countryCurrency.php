<?php

        ini_set('display_errors', 'On');
	error_reporting(E_ALL);
    
	$executionStartTime = microtime(true) / 1000;

        //Open Exchange Rates API
        $url = 'https://openexchangerates.org/api/latest.json?app_id=30266cba1d97439cb23025bccb6285c8&symbols='; 

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

	$output['data'][$_REQUEST['currencyCode']] = $decode['rates'][$_REQUEST['currencyCode']]; 

	$output['data']['GBP'] = $decode['rates']['GBP'];
	$output['data']['EUR'] = $decode['rates']['EUR'];
	$output['data']['USD'] = $decode['rates']['USD'];

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
