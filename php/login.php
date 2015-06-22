<?php
//    Created on : Mar 13, 2015, 1:03 PM
//    Author     : David G Chung

require_once './BusinessRules/UserRules.php';
require_once './Session.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$uName = $request->uName;
$pass = $request->pWord;

//Get user object from db 
$user = UserRules::login($uName, $pass);
$session->login($user);

//echo it as JSON for javascript to use
echo json_encode($user);