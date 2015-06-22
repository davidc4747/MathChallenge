<?php
//    Created on : May 04, 2015, 9:50 PM
//    Author     : David G Chung

require_once './BusinessRules/UserRules.php';
require_once './Session.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$userName = $request->userName;
$email = $request->email;
$age = $request->age;

if(!$session->is_logged_in())
    die('Can not edit data of a null user');

$mess = UserRules::updateUser($session->user_id, $userName, $email, $age);
echo json_encode($mess);