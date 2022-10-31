<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$curl = curl_init();

//AeroDataBox Rapid API- Airports
curl_setopt_array($curl, [
    CURLOPT_URL => 'https://aerodatabox.p.rapidapi.com/airports/search/location/'.$_REQUEST['lat'].'/'.$_REQUEST['lng'].'/km/100/20?withFlightInfoOnly=false',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => [
        "X-RapidAPI-Host: aerodatabox.p.rapidapi.com",
        "X-RapidAPI-Key: 5632b46c6emsh480a2114b4bf7ddp10d6f6jsn49fb514166b3"
    ],
]);

$response = curl_exec($curl);

$err = curl_error($curl);

curl_close($curl);

$decode = json_decode($response);

if ($err) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['error'] = $err;
} else {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $decode;
}

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

?>
