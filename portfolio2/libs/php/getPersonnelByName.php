<?php

    // example use from browser 
    // http://localhost/companydirectory/libs/php/getPersonnelByName.php?searchTerm=Tamarra

    // remove next two lines for production

    ini_set("display_errors", "On");
    error_reporting(E_ALL);

    // Gets Personnel Info By Name
    // Works!
    $executionStartTime = microtime(true);

    include "config.php";

    header("Content-Type: application/json; charset=UTF-8");

    $conn = new mysqli($cd_host,$cd_user,$cd_password,$cd_dbname,$cd_port,$cd_socket);

    if (mysqli_connect_errno()) {

    $output["status"]["code"] = "300";
    $output["status"]["name"] = "failure";
    $output["status"]["description"] = "database unavailable";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit();
    
    }

    $searchTerm = "%" . $_REQUEST["searchTerm"] . "%";

    $sqlStr = "SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p
            LEFT JOIN department d ON (p.departmentID = d.id) LEFT JOIN location l ON (d.locationID = l.id)
            WHERE (p.firstName LIKE '$searchTerm' OR p.lastName LIKE '$searchTerm' OR d.name LIKE '$searchTerm' OR l.name LIKE '$searchTerm')";

    $query = $conn->query($sqlStr);

    if (!$query) {

    $output["status"]["code"] = "400";
    $output["status"]["name"] = "executed";
    $output["status"]["description"] = "query failed";
    $output["data"] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit();

    }

    $personnel = [];

    while ($row = mysqli_fetch_assoc($query)) {

    array_push($personnel, $row);

    }

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"]["personnel"] = $personnel;

    mysqli_close($conn);

    echo json_encode($output);

?>