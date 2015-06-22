<?php
//    Created on : May 19, 2015, 6:50 AM
//    Author     : David G Chung

require_once 'BusinessRules/UserRules.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$userId = $request->userId;

$data = UserRules::getUserData($userId);
echo json_encode($data);