<?php

define("TABLE", "tmdb_movie");

//$rest_json = file_get_contents("php://input");
//$_POST = json_decode($rest_json, true);

require_once '../db_conn/databaseConn.php';
if($conn = connectToDatabase()) {
    $rows = getTop25($conn);
    echo json_encode($rows);
} else {
    echo json_encode("error");
}

function getTop25($conn){

    $sql = "SELECT tmdb_id, poster_path, title, elo_score FROM " . TABLE . " ORDER BY elo_score DESC LIMIT 25;";
    $result = $conn->query($sql);

    if ($result->num_rows <= 25) {
        $rows = [];
        while($row = $result->fetch_assoc()) {
            array_push($rows, $row);
        }
        return $rows;
    } else {
        //TODO: Handle error
        error_log("Error when getting old score");
        return -1;
    }

}
