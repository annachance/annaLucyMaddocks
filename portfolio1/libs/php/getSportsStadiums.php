<?php

$curl = curl_init();

// API Football- Sports Stadium 
curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://v3.football.api-sports.io/venues/country',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
    'x-rapidapi-key: b1be36c737db8d7ff02c87af61c62fdf',
    'x-rapidapi-host: v3.football.api-sports.io'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
?>