<?php
//TODO: Dont know if we need these headers. Maybe issues with CORS
//header('Access-Control-Allow-Origin: *');
//header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE');

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

if (empty($_POST['winningId']) || empty($_POST['losingId'])){
    echo("test <script>console.log('PHP: Attempting to submit winner. winningId or losingId is not set.');</script>");
    die();
} else {
    // set response code - 200 OK
    http_response_code(200);
    echo("success");
}
