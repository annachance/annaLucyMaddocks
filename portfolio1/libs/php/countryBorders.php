<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
   
   $result = file_get_contents('countryBorders.geo.json');

   $border = json_decode($result,true);

   $countries = [];

  for ($i = 0; $i < count($border['features']); $i++) {
    if ($border['features'][$i]['properties']['iso_a2'] == ) 

  };

   $output['status']['code'] = "200";
   $output['status']['name'] = "ok";
   $output['status']['description'] = "success";
   $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

   $output['data']['border'] = $border;
   
   header('Content-Type: application/json; charset=UTF-8');

   echo json_encode($output);

?>  
