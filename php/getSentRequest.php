<?php
//    Created on : May 18, 2015, 11:20 PM
//    Author     : David G Chung

require_once './BusinessRules/FriendRules.php';
require_once './Session.php';

if(!$session->is_logged_in())
    die('Can not get requests sent by a null user');

$requests = FriendRules::getSentRequest($session->user_id);
echo json_encode($requests);
