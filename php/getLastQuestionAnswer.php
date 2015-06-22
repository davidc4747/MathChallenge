<?php
//    Created on : May 14, 2015, 8:54 PM
//    Author     : David G Chung

require_once 'BusinessRules/QuestionRules.php';
require_once './Session.php';

if(!$session->is_logged_in())
    die('Can not get the last QA data of a null user');

$lastQuesAns = QuestionRules::getLastQuestionAnswer($session->user_id);
echo json_encode($lastQuesAns);