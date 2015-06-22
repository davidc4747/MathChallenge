<?php
//    Created on : Apr 6, 2015, 8:01 PM
//    Author     : David G Chung

require_once 'BusinessRules/GameRules.php';
require_once './Session.php';

//ask db to save the game data
if(!$session->is_logged_in())
    die('Can not get the top five scores of a null user');

$scores =  GameRules::getTopFive($session->user_id);
echo json_encode($scores);