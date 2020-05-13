<?php

function connectToDatabase(){

    $cred = json_decode(file_get_contents(__DIR__ . "/db.config"), true);
    try {
        // Create connection
        $conn = mysqli_connect($cred['host'], $cred['username'], $cred['password'], $cred['database']);
        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }
        return $conn;
    } catch (Exception $e) {
        echo 'Caught exception: ', $e->getMessage(), "\n";
    }

    return null;

}