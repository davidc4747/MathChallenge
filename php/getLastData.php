<?php
//    Created on : Apr 24, 2015, 12:50 PM
//    Author     : David G Chung

require_once 'BusinessRules/GameRules.php';
require_once './Session.php';

if(!$session->is_logged_in())
    die('Can not get the last game data of a null user');

$lastData = GameRules::getLastData($session->user_id);
echo json_encode($lastData);