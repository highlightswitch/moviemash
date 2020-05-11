<?php

$rest_json = file_get_contents("./tmdbTest.json");
$_POST = json_decode($rest_json, true);

require_once '../api/databaseConn.php';
if($conn = connectToDatabase()) {
    for($i = 0; $i <= 10; $i++){
        $tmdbId = $_POST['results'][$i]['id'];
        $title = $_POST['results'][$i]['title'];
        $poster = $_POST['results'][$i]['poster_path'];
        insertMovie($conn, $tmdbId, $title, $poster);
    }
}

function insertMovie($conn, $tmdbId, $title, $poster){
    $sql = "INSERT INTO tmdb_movie(tmdb_id, title, poster, score) VALUES ('$tmdbId', '$title', '$poster', 1000);";

    if ($conn->query($sql) === TRUE) {
        //TODO: Handle success
    } else {
        //TODO: Handle error
        error_log("Error when inserting movie with id: " . $tmdbId);
    }
}
