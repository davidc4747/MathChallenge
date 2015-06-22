<?php
//    Created on : Mar 28, 2015, 9:35 PM
//    Author     : David G Chung

require_once './BusinessRules/UserRules.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$uName = $request->name;
$pass = $request->pass;
$repass = $request->confirmPass;

//Get user object from db 
$mess = UserRules::register($uName, $pass, $repass);

//echo it as JSON for javascript to use
echo json_encode($mess);
