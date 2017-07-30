<?php
error_reporting(0);
$searchTerm = $_GET['searchTermTwit'];

$consumer_key = '9j70vn7DoEj425Av5fg5vFsNJ';
$consumer_secret = 'mY7GIxRySb0aafE1za5DSo5K0lFCorXvkG5MujYEFiD9RmIRI4';
$access_token = '876436822079016960-XPRE5HEblkRVogoqCU931a8cNY1g5Fj';
$access_token_secret = 'ZLp3K6tL3Ziq9WtrgfJGh0WcvNkydqyc2Q2H5zujJK7vo';

require "../twitteroauth/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

$connection = new TwitterOAuth($consumer_key, $consumer_secret, $access_token, $access_token_secret);

$querySpace = [
    "q" => $searchTerm,
    "lang" => "en",
    "count" => "100",
];

$tweets = $connection->get("search/tweets", $querySpace);

$jsonTweets = json_encode($tweets);

echo ($jsonTweets);

?>
