<?php


function connectToDatabase(){
    $host = "localhost";
    $user = "admin";
    $pass = "admin";
    $database = "efficiency";

    $conn = new mysqli($host, $user, $pass, $database);
    if($conn->connect_error)
        die("conn failed: ".$conn->connect_error);

    return $conn;
}