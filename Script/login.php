<?php
error_reporting(0);
session_start();

$arr_data = array();

$user = $_POST['username'];
$password = $_POST['password'];

$jsondata = file_get_contents("data.json");

if ($jsondata != null) {
    // converts json data into array
    $arr_data = json_decode($jsondata, true);
}

$existUser = "FALSE";
for($i=0; $i < count($arr_data); $i++){

    $tempUser = $arr_data[$i]['username'];
    $tempPsw = $arr_data[$i]['password'];
    $tempName = $arr_data[$i]['name'];
    $tempSurname = $arr_data[$i]['surname'];

    if(($tempUser == $user) && ($tempPsw == $password) ){
        $existUser = "TRUE";
        $_SESSION['username'] = $tempUser;
        $_SESSION['name'] = $tempName;
        $_SESSION['surname'] = $tempSurname;
        $stringUser = $tempName." ".$tempSurname;
    }
}


if ($existUser == "TRUE"){
    echo $stringUser;
} else {
    echo "NOTLOGIN";
}

?>