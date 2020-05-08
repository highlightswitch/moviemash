<?php
//TODO: Dont know if we need these headers. Maybe issues with CORS
//header('Access-Control-Allow-Origin: *');
//header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE');
//header('Access-Control-Allow-Headers: *');

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

require_once 'databaseConn.php';
if($conn = connectToDatabase()) {
    submitWinner($conn);
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

}

function getScoreOfMovieWithId($conn, $id){
    $sql = "SELECT score FROM movie WHERE id = '$id';";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        return $row['score'];
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
    $sql = "UPDATE movie SET score = '$player->newScore' WHERE id = '$player->id';";

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
