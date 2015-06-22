<?php
//    Created on : Apr 24, 2015, 12:50 PM
//    Author     : David G Chung

require_once 'BusinessRules/QuestionRules.php';
require_once './Session.php';

if(!$session->is_logged_in())
    die('Can not get the QA history of a null user');

$QuesAns = QuestionRules::getQuestionAnswerByUserId($session->user_id);
echo json_encode($QuesAns);