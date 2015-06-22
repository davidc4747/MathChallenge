<?php
//    Created on : May 04, 2015, 11:40 PM
//    Author     : David G Chung

require_once './BusinessRules/UserRules.php';
require_once './Session.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$curPass = $request->curPass;
$newPass = $request->newPass;
$confirmPass = $request->confirmPass;

if(!$session->is_logged_in())
    die('Can not update password of a null user');

$mess = UserRules::updatePass($session->user_id, $curPass, $newPass, $confirmPass);
echo json_encode($mess);