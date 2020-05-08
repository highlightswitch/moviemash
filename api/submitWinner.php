<?php
//TODO: Dont know if we need these headers. Maybe issues with CORS
//header('Access-Control-Allow-Origin: *');
//header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE');
//header('Access-Control-Allow-Headers: *');

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

require_once 'databaseConn.php';
$conn = connectToDatabase();

test($conn, null);

function temp($conn){

    if (empty($_POST['winningId']) || empty($_POST['losingId'])){

        die('PHP: Attempting to submit winner. winningId or losingId is not set.');

    } else {
        // set response code - 200 OK
        http_response_code(200);

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

        echo("success");
    }
}

function getScoreOfMovieWithId($conn, $id){
    $sql = "SELECT score FROM movie WHERE id = '$id';";
    $result = $conn->query($sql);

    if ($result->num_rows = 1) {
        $row = $result->fetch_assoc();
        return $row['score'];
    } else {
        //TODO: Handle error
        return -1;
    }
}

function assignNewScores($winner, $loser){

    $winner->newScore = $winner->oldScore + 100;
    $loser->newScore = $loser->oldScore - 100;

}

function updateNewScore($conn, $player){
    $sql = "UPDATE movie SET score = '$player->newScore' WHERE id = '$player->id';";

    if ($conn->query($sql) === TRUE) {
        //TODO: Handle success
    } else {
        //TODO: Handle error
    }
}

function test($conn, $player){
    $sql = "UPDATE movie SET score = 5 WHERE id = 1;";

    if ($conn->query($sql) === TRUE) {
        //TODO: Handle success
    } else {
        //TODO: Handle error
        error_log($conn->error);
    }
}

class Player{

    public $id;
    public $oldScore;
    public $newScore;

    function __construct($id, $oldScore) {
        $this->id = $id;
        $this->oldScore = $oldScore;
    }

}
