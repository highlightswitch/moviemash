<?php
echo "<html><head></head><body>attempt:";
if($conn = connectToDatabase()){
    echo "<br />Success</body></html>";
}

function connectToDatabase(){

    try {
        // Create connection
        $conn = mysqli_connect("localhost", "admin", "admin", "moviemash");
        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }

        return $conn;
    } catch (Exception $e) {
        echo 'Caught exception: ', $e->getMessage(), "\n";
    }

}