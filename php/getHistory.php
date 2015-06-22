<?php
//    Created on : Apr 24, 2015, 12:50 PM
//    Author     : David G Chung

require_once 'BusinessRules/GameRules.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$userId = $request->userId;

$hist = GameRules::getHistory($userId);
echo json_encode($hist);