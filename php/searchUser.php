<?php
//    Created on : May 15, 2015, 10:54 PM
//    Author     : David G Chung

require_once './BusinessRules/UserRules.php';
require_once './Session.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$userName = $request->userName;

if(!$session->is_logged_in())
    die('Null user attempting to search');

$users = UserRules::searchUser($session->user_id, $userName);
echo json_encode($users);

