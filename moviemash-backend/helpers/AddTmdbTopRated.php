<?php

require_once '../db_conn/databaseConn.php';
if ($conn = connectToDatabase()) {
    error_log("Success connecting to database");
    for($i = 1; $i < 51; $i++){
        $rest_json = file_get_contents("http://api.themoviedb.org/3/movie/top_rated?api_key=aa648c1311924884ef722848e62f8b64&language=en-US&page=$i");
        $decoded = json_decode($rest_json, true);
        foreach ($decoded['results'] as $movie_decoded){
            if($movie_decoded['vote_count'] > 999){
                $movie = createMovieEntry($movie_decoded);
                insertMovie($conn, $movie);
            }
        }
        error_log("Page " . $i . "done (each page has 25 movies on it)");
    }
} else {
    error_log("Error connecting to database");
}

function createMovieEntry($movie_decoded){
    $movie = array();
    $movie['tmdb_id'] = $movie_decoded['id'];
    $movie['title'] = htmlentities($movie_decoded['title'], ENT_QUOTES);
    $movie['poster_path'] = "https://image.tmdb.org/t/p/w500" . $movie_decoded['poster_path'];
    $movie['release_date'] = $movie_decoded['release_date'];
    $movie['popularity'] = $movie_decoded['popularity'];
    $movie['vote_count'] = $movie_decoded['vote_count'];
    $movie['vote_average'] = $movie_decoded['vote_average'];
    return $movie;
}

function insertMovie($conn, $movie){
    $sql = "INSERT INTO tmdb_movie(tmdb_id, elo_score, title, poster_path, release_date, popularity, vote_count, vote_average) 
            VALUES (".$movie['tmdb_id'].", 1000, '".$movie['title']."', '".$movie['poster_path']."', '".$movie['release_date']."', '".$movie['popularity']."', '".$movie['vote_count']."', '".$movie['vote_average']."');";

    if ($conn->query($sql) === TRUE) {
        //TODO: Handle success
    } else {
        //TODO: Handle error
        error_log("Error when inserting movie with id: " . $movie['tmdb_id']);
        error_log("Query: " . $sql);
    }
}

//This is unused since the daily export is 500,000+ movies long and most movies, no one has heard of.
function addDailyExport($conn){
    $handle = fopen("path/to/file", "r");
    if ($handle) {
        while (($line = fgets($handle)) !== false) {
            $line_decoded = json_decode($line);
            $rest_json = file_get_contents("http://api.themoviedb.org/3/movie/" . $line_decoded->id . "?api_key=aa648c1311924884ef722848e62f8b64&language=en-US");
            $movie_decoded = json_decode($rest_json, true);
            $movie = createMovieEntry($movie_decoded);
            insertMovie($conn, $movie);
        }
        fclose($handle);
    } else {
        //TODO: Handle error
        error_log("Error reading line");
    }
}