<?php
//    Created on : May 22, 2015, 8:30 AM
//    Author     : David G Chung

require_once 'BusinessRules/UserRules.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$userId = $request->userId;

$data = UserRules::getUserTypeStats($userId);
echo json_encode($data);

