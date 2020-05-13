<?php
session_start();
if(!isset($_SESSION['playedMatchUps']))
    $_SESSION['playedMatchUps'] = array();
if(!isset($_SESSION['omitIds']))
    $_SESSION['omitIds'] = array();

//TODO: Dont know if we need these headers. Maybe issues with CORS
//header('Access-Control-Allow-Origin: *');
//header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE');
//header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

define("TABLE", "tmdb_movie");

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

require_once 'databaseConn.php';
if($conn = connectToDatabase()) {

    //TODO: Most of the omitIds code has not been tested properly

    if($_POST['notSeenLeft'] && $_POST['notSeenRight']){
        //Not seen either movie, so get two random movies
        $movies = getTwoRandomMovies($conn);
    } else if($_POST['notSeenLeft']){
        //Not seen the left movie, so keep the right and get an opponent for it
        $movies = keepOneMovieAndGetOpponent($conn, false);
    } else if ($_POST['notSeenRight']){
        //Not seen the right movie, so keep the left and get an opponent for it
        $movies = keepOneMovieAndGetOpponent($conn, true);
    } else {
        //User has clicked a poster instead of a "Not Seen" button
        if ($_POST['mode'] === "King of the Hill") {
            //Mode is King of the Hill
            //So keep the winning movie, and get an opponent for it.
            if ($_POST['winningId'] === $_POST['left']['tmdb_id']) {
                $movies = keepOneMovieAndGetOpponent($conn, true);
            } else if ($_POST['winningId'] === $_POST['right']['tmdb_id']) {
                $movies = keepOneMovieAndGetOpponent($conn, false);
            } else {
                //TODO: Handle error. This should never happen
            }
        } else if ($_POST['mode'] === "Random") {
            //And mode is Random, so get two random movies
            $movies = getTwoRandomMovies($conn);
        } else {
            //TODO: Handle error. This should never happen
        }
    }

    echo json_encode($movies);

}

function getTwoRandomMovies($conn){

    $omitIds = $_SESSION['omitIds'];

    $left = getRandomMovie(
        $conn,
        $omitIds
    );
    foreach (getListOfAlreadyPlayedOpponents($left['tmdb_id']) as $opponentId)
        array_push($omitIds, $opponentId);
    $right = getOpponent(
        $conn,
        $left,
        $omitIds
    );

    return array("left" => $left, "right" => $right);
}

function keepOneMovieAndGetOpponent($conn, $isLeftMovie){

    $omitIds = $_SESSION['omitIds'];

    if($isLeftMovie){
        $left = $_POST['left'];
        foreach (getListOfAlreadyPlayedOpponents($left['tmdb_id']) as $opponentId)
            array_push($omitIds, $opponentId);
        $right = getOpponent(
            $conn,
            $left,
            $omitIds
        );
    } else{
        $right = $_POST['right'];
        foreach (getListOfAlreadyPlayedOpponents($right['tmdb_id']) as $opponentId)
            array_push($omitIds, $opponentId);
        $left = getOpponent(
            $conn,
            $right,
            $omitIds
        );
    }

    return array("left" => $left, "right" => $right);

}

/**
 * Returns a list of movie ids that the given movie has not already played against.
 * This list will always have the given id as the first id returned.
 *
 * @param $leftId
 * @return array
 */
function getListOfAlreadyPlayedOpponents($id){
    $omitIds = array();
    array_push($omitIds, $id);
    foreach ($_SESSION['playedMatchUps'] as $match){
        if($match[0] == $id)
            array_push($omitIds, $match[1]);
        else if($match[1] == $id)
            array_push($omitIds, $match[0]);
    }
    return $omitIds;
}

function getRandomMovie($conn, $omitIds){

    // SQL Statement not efficient.
    // Maybe better SQL found here: https://stackoverflow.com/questions/4329396/mysql-select-10-random-rows-from-600k-rows-fast
    if(empty($omitIds)){
        $sql = "SELECT * FROM " . TABLE . " ORDER BY RAND() LIMIT 1;";
    } else {
        $sqlOmitIds = '(' . join(',', $omitIds) . ')';
        $sql = "SELECT * FROM " . TABLE . " WHERE tmdb_id NOT IN $sqlOmitIds ORDER BY RAND() LIMIT 1;";
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
    $minScore = $challenger['elo_score'] - $maxScoreDifference;
    $maxScore = $challenger['elo_score'] + $maxScoreDifference;

    $sql = "SELECT * 
            FROM " . TABLE . " 
            WHERE elo_score >= $minScore 
              AND elo_score <= $maxScore 
              AND tmdb_id NOT IN $sqlOmitIds 
            ORDER BY rand() 
            LIMIT 1;";

    $result = $conn->query($sql);

    if ($result->num_rows == 0) {
        return getRandomMovie($conn, array($challenger['tmdb_id']));
    } else if ($result->num_rows == 1) {
        return $result->fetch_assoc();
    } else {
        //TODO: Handle error
        error_log("Error when getting old score");
        return -1;
    }

}
