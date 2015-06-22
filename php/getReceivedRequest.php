<?php
//    Created on : May 18, 2015, 11:22 PM
//    Author     : David G Chung

require_once './BusinessRules/FriendRules.php';
require_once './Session.php';

if(!$session->is_logged_in())
    die('Can not get requests received by a null user');

$requests = FriendRules::getReceivedRequest($session->user_id);
echo json_encode($requests);

