<?php
//    Created on : May 18, 2015, 9:38 PM
//    Author     : David G Chung

require_once './BusinessRules/FriendRules.php';
require_once './Session.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$userTo = $request->userTo;

if(!$session->is_logged_in())
    die('Request can not be send from a null user');

echo FriendRules::sendRequest($session->user_id, $userTo);

