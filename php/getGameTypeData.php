<?php
//    Created on : May 19, 2015, 2:15 PM
//    Author     : David G Chung

require_once 'BusinessRules/GameRules.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$userId = $request->userId;

$data = GameRules::getGameTypeData($userId);
echo json_encode($data);

