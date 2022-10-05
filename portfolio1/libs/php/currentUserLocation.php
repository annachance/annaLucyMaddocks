<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
//Geonames- Country Codes API
$url='http://api.geonames.org/countryCode?lat=47.03&lng=10.2' . $_REQUEST['lat'] . '+' . $_REQUEST['lng'] . '&country=' . $_REQUEST['country'] . '&username=anna_chance&style=full';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);	

$countryCode;

for ($i = 0; $i < count($decode['components']); $i++) {
  if ($decode['components'][$i]['lat']['lng'] == $_REQUEST['ISO_3166-1_alpha-2']) {
	$countryCode = $decode['components'][$i]['country'];
  } 
};

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode['country'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 

?> 
