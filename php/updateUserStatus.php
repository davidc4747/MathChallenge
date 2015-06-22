<?php
//    Created on : Jun 01, 2015, 9:22 AM
//    Author     : David G Chung

require_once './BusinessRules/UserRules.php';
require_once './Session.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$stats = $request->stats;

if(!$session->is_logged_in())
    die('Can not edit data of a null user');

$mess = UserRules::updateUserStatus($session->user_id, $stats);
echo json_encode($mess);
