<?php
//TODO: Dont know if we need these headers. Maybe issues with CORS
//header('Access-Control-Allow-Origin: *');
//header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE');
//header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

require_once 'databaseConn.php';
if($conn = connectToDatabase()) {
    $left = getRandomMovie($conn, array());
    $right = getOpponent($conn, $left, array($left['id']));
    echo json_encode(array("left"=>$left, "right"=>$right));
}

function getRandomMovie($conn, $omitIds){

    // SQL Statement not efficient.
    // Maybe better SQL found here: https://stackoverflow.com/questions/4329396/mysql-select-10-random-rows-from-600k-rows-fast
    if(empty($omitIds)){
        $sql = "SELECT * FROM movie ORDER BY RAND() LIMIT 1;";
    } else {
        $sqlOmitIds = '(' . join(',', $omitIds) . ')';
        $sql = "SELECT * FROM movie WHERE id NOT IN $sqlOmitIds ORDER BY RAND() LIMIT 1;";
    }
    $result = $conn->query($sql);

    if ($result->num_rows == 0) {
        //TODO: Handle error
        return -1;
    } else if ($result->num_rows == 1) {
        return $result->fetch_assoc();
    } else {
        //TODO: Handle error
        error_log("Error when getting old score");
        return -1;
    }

}

function getOpponent($conn, $challenger, $omitIds){

    $sqlOmitIds = '(' . join(',', $omitIds) . ')';

    $maxScoreDifference = 300;
    $minScore = $challenger['score'] - $maxScoreDifference;
    $maxScore = $challenger['score'] + $maxScoreDifference;

    $sql = "SELECT * 
            FROM movie 
            WHERE score >= $minScore 
              AND score <= $maxScore 
              AND id NOT IN $sqlOmitIds 
            ORDER BY rand() 
            LIMIT 1;";

    $result = $conn->query($sql);

    if ($result->num_rows == 0) {
        return getRandomMovie($conn, array($challenger['id']));
    } else if ($result->num_rows == 1) {
        return $result->fetch_assoc();
    } else {
        //TODO: Handle error
        error_log("Error when getting old score");
        return -1;
    }

}
