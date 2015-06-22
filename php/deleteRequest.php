<?php
//    Created on : May 18, 2015, 12:47 PM
//    Author     : David G Chung

require_once './BusinessRules/FriendRules.php';
require_once './Session.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$userTo = $request->userTo;

if(!$session->is_logged_in())
    die('Null user can not delete friend requests');

FriendRules::deleteRequest($session->user_id, $userTo);
