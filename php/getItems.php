<?php
//    Created on : Jun 05, 2015, 10:23 AM
//    Author     : David G Chung

require_once './BusinessRules/ItemRules.php';
require_once './Session.php';

if(!$session->is_logged_in())
    die('ERROR: User not logged in -- getItems.php');

$items = ItemRules::getItems($session->user_id);
echo json_encode($items);

