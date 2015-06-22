<?php
//    Created on : Mar 24, 2015, 8:57 PM
//    Author     : David G Chung

require_once 'BusinessRules/UserRules.php';
require_once 'BusinessRules/GameRules.php';
require_once './Session.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata, true);
$gData = $request['gData'];

if(!$session->is_logged_in())
    die('Can not save a game to a null user');

//ask db to save the game data
GameRules::saveGame($gData, $session->user_id);

//add energy to user's inventory
UserRules::saveaddEnergyGame($session->user_id);