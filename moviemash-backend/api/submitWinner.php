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

define("TABLE", "tmdb_movie");

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

require_once '../db_conn/databaseConn.php';
if($conn = connectToDatabase()) {
    if($_POST['notSeenLeft'] && $_POST['notSeenRight']){
        array_push($_SESSION['omitIds'], $_POST['left']['tmdb_id'], $_POST['right']['tmdb_id']);
    } else if($_POST['notSeenLeft']){
        array_push($_SESSION['omitIds'], $_POST['left']['tmdb_id']);
    } else if($_POST['notSeenRight']){
        array_push($_SESSION['omitIds'], $_POST['right']['tmdb_id']);
    } else {
        submitWinner($conn);
    }
}

function submitWinner($conn){

        $winner = new Player(
            $_POST['winningId'],
            getScoreOfMovieWithId($conn, $_POST['winningId'])
        );
        $loser = new Player(
            $_POST['losingId'],
            getScoreOfMovieWithId($conn, $_POST['losingId'])
        );

        assignNewScores($winner, $loser);
        updateNewScore($conn, $winner);
        updateNewScore($conn, $loser);

        //Add match up to played matches so that user doesn't see this pairing again.
        array_push($_SESSION['playedMatchUps'], array($_POST['winningId'], $_POST['losingId']));

}

function getScoreOfMovieWithId($conn, $id){
    $sql = "SELECT elo_score FROM ". TABLE ." WHERE tmdb_id = '$id';";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        return $row['elo_score'];
    } else {
        //TODO: Handle error
        error_log("Error when getting old score");
        return -1;
    }
}

function assignNewScores($winner, $loser){

    $K = 32;
    $winner->newScore = $winner->oldScore + $K*(1.0 - $winner->chanceOfWinningAgainst($loser));
    $loser->newScore = $loser->oldScore + $K*(0.0 - $loser->chanceOfWinningAgainst($winner));

}

function updateNewScore($conn, $player){
    $sql = "UPDATE " . TABLE . " SET elo_score = '$player->newScore' WHERE tmdb_id = '$player->id';";

    if ($conn->query($sql) === TRUE) {
        //TODO: Handle success
    } else {
        //TODO: Handle error
        error_log("Error when updating row");
    }
}

class Player{

    public int $id;
    public int $oldScore;

    function __construct($id, $oldScore) {
        $this->id = $id;
        $this->oldScore = $oldScore;
    }

    function chanceOfWinningAgainst($opponent){
        return 1/(1+pow(10, ($opponent->oldScore - $this->oldScore)/400));
    }

}
