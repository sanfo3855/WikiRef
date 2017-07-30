<?php
error_reporting(0);
/**
 * Created by PhpStorm.
 * User: sanfe
 * Date: 7/12/2017
 * Time: 2:20 AM
 */

$operation = $_GET['operation'];

if($operation=="create"){
    $json = $_POST['annotation'];
    $json = str_replace("%26", "&", $json);
    $import = file_get_contents("dbannote.json");
    if(strlen($import)!=0){
        $decodedDBannote = json_decode($import, true);
        $dbAnnoteMaxId = 0;
        foreach ($decodedDBannote["DB"] as $all){
            if($all['annotation']['id'] > $dbAnnoteMaxId) {
                $dbAnnoteMaxId = $all['annotation']['id'];
            }
        }
        $dbAnnoteNewId = $dbAnnoteMaxId+1;
        $json = substr($json, 0, -1) ;
        $json = $json . ',"id":"' . $dbAnnoteNewId .'"}';
        $annUpdated=substr($import,0,-3).'},{"annotation":'.$json.'}]}';
        file_put_contents('dbannote.json', $annUpdated);
        echo $json;
    } else {
        $json = substr($json, 0, -1);
        $json=$json.',"id":"1"}';
        $annUpdated= '{"DB":[{"annotation":'.$json.'}]}';
        file_put_contents('dbannote.json', $annUpdated);
        echo $json;
    }
} else if($operation=="delete"){
    $json=$_POST['annotation'];
    $json=str_replace("%26", "&", $json);
    $import = file_get_contents('dbannote.json');
    $jsonToDelete= json_decode($json, true);
    $decodeDBannote= json_decode($import, true);
    $count=1;
    $json=str_replace("/", "\/", $json);
    foreach ($decodeDBannote['DB'] as $all) {
        if (json_encode($all['annotation'])===$json and $count===1 and count($decodeDBannote['DB'])!=1) {
            $afterDeleteJson= str_replace( '{"annotation":'.json_encode($all['annotation']).'},', "" , json_encode($decodeDBannote));
            file_put_contents('dbannote.json', $afterDeleteJson);
            echo $afterDeleteJson;
        }
        if (json_encode($all['annotation'])===$json and $count===1 and count($decodeDBannote['DB'])===1) {
            file_put_contents('dbannote.json', "");
            echo '{"DB":"null"}';
        }
        if (json_encode($all['annotation'])===$json and $count!=1 and $count<=count($decodeDBannote['DB']) ) {
            $afterDeleteJson= str_replace( ',{"annotation":'.json_encode($all['annotation']).'}', "" , json_encode($decodeDBannote));
            file_put_contents('dbannote.json', $afterDeleteJson);
            echo $afterDeleteJson;
        }
        $count=$count+1;
    }
} else if($operation=="update"){
    $json=$_POST['annotation'];
    $json=str_replace("%26", "&", $json);
    $import = file_get_contents('dbannote.json');
    $jsonToDelete= json_decode($json, true);
    $decodeDBannote= json_decode($import, true);
    foreach ($decodeDBannote['DB'] as $all) {
        if( $all['annotation']['id']===$jsonToDelete['id']) {
            $annToUpdate= json_encode($all['annotation']);
            $annToUpdate=str_replace("\/", "/", $annToUpdate);
            $annUpdated=str_replace($annToUpdate, $json, $import);
            file_put_contents('dbannote.json', $annUpdated);
            echo $json;
        }
    }
} else if($operation=='search'){
    $page=$_GET['page'];
    $user=$_GET['user'];
    $import=file_get_contents("dbannote.json");
    if(strlen($import)!=0){
        $decodedDBannote = json_decode($import, true);
        $result = '';
        $numAnnote = 0;
        foreach ($decodedDBannote["DB"] as $all){
            if($all['annotation']['page']==$page){
                if($all['annotation']['user']==$user OR $all['annotation']['permissions']['read'][0]==null){
                    if($numAnnote===0)
                        $result = $result . '' . json_encode($all['annotation']);
                    if($numAnnote>0)
                        $result = $result . ',' . json_encode(($all['annotation']));
                    $numAnnote++;
                }
            }
        }
        echo '[' . $result . ']';
    } else {
        echo '[]';
    }
}