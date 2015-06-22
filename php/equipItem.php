<?php
//    Created on : Jun 08, 2015, 7:55 AM
//    Author     : David G Chung

require_once './BusinessRules/ItemRules.php';
require_once './Session.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$itemId = $request->itemId;

if(!$session->is_logged_in())
    die('ERROR: User not logged in -- equipItem.php');

ItemRules::equipItem($session->user_id, $itemId);
