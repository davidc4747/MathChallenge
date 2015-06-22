<?php
//    Created on : Mar 30, 2015, 7:55 PM
//    Author     : David G Chung

include_once 'DataAccess/MySqlDataBase.php';
include_once 'BusinessRules/QuestionRules.php';

class GameRules
{
    public static function saveGame($gameData, $userId)
    {
        global $db;
        
        $type = $gameData['Type'];
        
        //Save Game
        $fname = DBConstants::SP_GAME_SAVE;
        $params = array($userId, "'$type'");
        $gameId = $db->function_call($fname, $params, 'select');
        $gameId = $gameId['game_Id'];
        
        //Save each question
        foreach ($gameData['Questions'] as $question)
            QuestionRules::saveQuestion ($question, $gameId);        
    }
    
    public static function getTopFive($userId)
    {
        global $db;
        
        //get top Five
        $fname = DBConstants::SP_GAME_TOP;
        $params = array(0=>$userId);
        $result = $db->function_call($fname, $params, 'select');
        
        return $result;
    }
    
    public static function getHistory($userId)
    {
        global $db;    
        
        //Get a user's history
        $fname = DBConstants::SP_GAME_USER_HISTORY;
        $params = array(0=>$userId);
        $result = $db->function_call($fname, $params, 'select');
        
        return $result;
    }
    
    public static function getLastData($userId)
    {
        global $db;    
        
        //Get a getLastData
        $fname = DBConstants::SP_GAME_LAST_DATA;
        $params = array(0=>$userId);
        $result = $db->function_call($fname, $params, 'select');
        
        return $result;        
    }
    
    public static function getGameTypeData($userId)
    {
        global $db;    
        
        //Get a getLastData
        $fname = DBConstants::SP_GAME_TYPE_DATA;
        $params = array(0=>$userId);
        return $db->function_call($fname, $params, 'select');
    }
}