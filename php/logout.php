<?php
//    Created on : Mar 30, 2015, 10:47 PM
//    Author     : David G Chung

require_once './BusinessRules/UserRules.php';
require_once './Session.php';

//send logout message to db, and session
UserRules::logout($session->user_id);
$session->logout();