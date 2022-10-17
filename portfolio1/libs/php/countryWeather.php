<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
    
    $executionStartTime = microtime(true) / 1000;
    
   //Open Weather API
    //$url='http://api.openweathermap.org/data/2.5/weather?'.'&appid=4d5ab8a2e54f4fc6266e34bcf9c514ab';
	
	$url='https://api.openweathermap.org/data/2.5/weather?lat=55.9533&lon=3.1883'.'&appid=4d5ab8a2e54f4fc6266e34bcf9c514ab';

	//$url='https://api.openweathermap.org/data/2.5/weather?lat='.$_REQUEST['lat'].'&lon='.$_REQUEST['lon'].'&appid=4d5ab8a2e54f4fc6266e34bcf9c514ab';

	//$url='http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}'.'&appid=4d5ab8a2e54f4fc6266e34bcf9c514ab';

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
     $output['data'] = $decode; //['weather'];  //['current'];
	
     header('Content-Type: application/json; charset=UTF-8');

     echo json_encode($output); 

?>
