<?php

$curl = curl_init();
//** needs work!! */
//Covid-19 Rapid API -- works for all but not a specific country yet!!
curl_setopt_array($curl, [
	CURLOPT_URL => 'https://covid-193.p.rapidapi.com/statistics'.$_REQUEST['country'],
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"X-RapidAPI-Host: covid-193.p.rapidapi.com",
		"X-RapidAPI-Key: 8e6bb9039fmsh89d0bd5feef444fp1e9e79jsn0a8cfb52a8ad"
	],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
	echo "cURL Error #:" . $err;
} else {
	echo $response;
}

$decode = json_decode($result,true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $decode["results"];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 

?>