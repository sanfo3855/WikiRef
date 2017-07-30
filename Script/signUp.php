<?php
error_reporting(0);

session_start();

$name = $_POST['name'];
$surname = $_POST['surname'];
$user = $_POST['username'];
$password = $_POST['password'];

$arr_data = array();

$arrayUser = array(
    'name' => $name,
    'surname' => $surname,
    'username' => $user,
    'password' => $password,
);

//Get data from existing json file
$jsondata = file_get_contents("data.json");

if ($jsondata != null) {
    // converts json data into array
    $arr_data = json_decode($jsondata, true);
}

$existUser = "FALSE";
for($i=0; $i < count($arr_data); $i++){

    //echo $arr_data[$i]['username'];
    $temp = $arr_data[$i]['username'];

    if($temp == $user){
        $existUser = "TRUE";
    }
}

if ($existUser=="FALSE"){
    // Push user data to array
    array_push($arr_data, $arrayUser);

    //Convert updated array to JSON
    $jsondata = json_encode($arr_data, JSON_PRETTY_PRINT);

    $file = fopen('data.json','w+') or die("can't open file");
    fwrite($file, $jsondata);
    fclose($file);

    $_SESSION['username'] = $user;
    $_SESSION['name'] = $name;
    $_SESSION['surname'] = $surname;

    echo "REGISTERED";
} else {
    echo "NOTREGISTERED";
}

?>
