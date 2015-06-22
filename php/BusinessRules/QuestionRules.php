<?php
//    Created on : Mar 30, 2015, 7:55 PM
//    Author     : David G Chung

include_once 'DataAccess/MySqlDataBase.php';
include_once 'AnswerRules.php';

class QuestionRules
{
    public static function saveQuestion($questionData, $gameId)
    {        
        global $db;
        
        //Format input
        $timeCreated = new DateTime($questionData['DateTimeCreated']);
        $timeCreated = $timeCreated->format('Y-m-d H:i:s');    
        
        if(empty($questionData['Answer']))
           return;
        
        //Save Question
        $fname = DBConstants::SP_QUESTION_SAVE;
        $params = array("'".$questionData['QuestionType']."'", 
                    $questionData['NumAnswersDisplayed'],
                    "'$timeCreated'", 
                    $questionData['CorrectAnswer'],
                    $gameId);
        $quesId = $db->function_call($fname, $params, 'select');
        $quesId = $quesId['ques_Id'];
        
        //Save each Number
        foreach ($questionData['Nums'] as $num)
        {
            $fname = DBConstants::SP_QUESTION_SAVENUM;
            $params = array($quesId, $num);
            $db->function_call($fname, $params, 'update');
        }
        
        //Save Answer
        AnswerRules::saveAnswer($questionData['Answer'], $quesId);        
    }
    
    public static function getQuestionAnswerByUserId($userId)
    {
        global $db;    
        
        //Get a user's QA history
        $fname = DBConstants::SP_QUESTION_ANSWER_BY_USER;
        $params = array(0=>$userId);
        $result = $db->function_call($fname, $params, 'select');
        
        return $result;
    }
    
    public static function getLastQuestionAnswer($userId)
    {
        global $db;    
        
        //Get a user's last QA history
        $fname = DBConstants::SP_QUESTION_ANSWER_LAST;
        $params = array(0=>$userId);
        $result = $db->function_call($fname, $params, 'select');
        
        return $result;
    }
}