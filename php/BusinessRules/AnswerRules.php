<?php
//    Created on : Mar 30, 2015, 7:55 PM
//    Author     : David G Chung

include_once 'DataAccess/MySqlDataBase.php';

class AnswerRules
{
    public static function saveAnswer($data, $questionId)
    {        
        global $db;
        
        //call the store procedure
        $fname = DBConstants::SP_ANSWER_SAVE;
        $params = array($data['TimeToAnswer'],
                    $data['Score'],
                    $data['Multiplier'],
                    $data['Number'],
                    "'".$data['AnswerType']."'",
                    "'".$data['PowerUp']."'",
                    $questionId);
        $db->function_call($fname, $params, 'update');        
    }
}