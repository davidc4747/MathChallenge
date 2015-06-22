<?php
//    Created on : Mar 30, 2015, 7:55 PM
//    Author     : David G Chung

require_once 'DataAccess/MySqlDataBase.php';

class UserRules
{    
    public static function login($username, $password)
    {
        global $db;
        $username = $db->escale_value($username);
        $password = $db->escale_value($password);

        //call the store procedure
        $fname = DBConstants::SP_USER_LOGIN;
        $params = array("'$username'", "'$password'");
        return $db->function_call($fname, $params, 'select');        
    }
    
    public static function logout($id)
    {
        global $db;

        //call the store procedure
        $fname = DBConstants::SP_USER_LOGOUT;
        $params = array(0=>"$id");
        $db->function_call($fname, $params, 'update');        
    }
    
    public static function register($username, $pass, $repass)
    {        
        global $db;
        $username = $db->escale_value($username);
        $pass = $db->escale_value($pass);
        $repass = $db->escale_value($repass);

        //call the store procedure
        $fname = DBConstants::SP_USER_REGISTER;
        $params = array("'$username'", "'$pass'", "'$repass'");
        return $db->function_call($fname, $params, 'select');
    }
    
    public static function updateUserStatus($userId, $status)
    {
        global $db;
        $status = $db->escale_value($status);
        
        //call the store procedure
        $fname = DBConstants::SP_USER_UPDATE_STATUS;
        $params = array($userId, "'$status'");
        $db->function_call($fname, $params, 'update');
    }
    
    public static function updateUser($userId, $userName, $email, $age)
    {
        global $db;
        $userName = $db->escale_value($userName);
        $email = $db->escale_value($email);
        
        //call the store procedure
        $fname = DBConstants::SP_USER_UPDATE_INFO;
        $params = array($userId, "'$userName'", "'$email'", $age);
        return $db->function_call($fname, $params, 'select');        
    }
    
    public static function updatePass($userId, $curPass, $newPass, $confirmPass)
    {
        global $db;
        $curPass = $db->escale_value($curPass);
        $newPass = $db->escale_value($newPass);
        $confirmPass = $db->escale_value($confirmPass);
        
        //call the store procedure
        $fname = DBConstants::SP_USER_UPDATE_PASS;
        $params = array($userId, "'$curPass'", "'$newPass'", "'$confirmPass'");
        return $db->function_call($fname, $params, 'select'); 
    }
    
    public static function searchUser($userId, $userName)
    {
        global $db;
        $userName = $db->escale_value($userName);
        
        //call the store procedure
        $fname = DBConstants::SP_USER_SEARCH;
        $params = array($userId, "'$userName'");
        return $db->function_call($fname, $params, 'select'); 
    }
    
    public static function getUserData($userId)
    {
        global $db;
        
        //call the store procedure
        $fname = DBConstants::SP_USER_DATA;
        $params = array(0=>$userId);
        return $db->function_call($fname, $params, 'select');         
    }
    
    //This function has special code 
    //  to allow it to return a data set
    public static function getUserTypeStats($userId)
    {        
        global $db;
                
        $result = array();
        
        //get GameType Stats
        $fname = DBConstants::SP_USER_GAME_TYPE_STATS;
        $params = array(0=>$userId);
        $result[] = array('Title' => 'Game Type', 'Data' => $db->function_call($fname, $params, 'select'));
        
        //get QuestionType Stats
        $fname = DBConstants::SP_USER_QUES_TYPE_STATS;
        $params = array(0=>$userId);
        $result[] = array('Title' => 'Question Type', 'Data' => $db->function_call($fname, $params, 'select'));
        
        //get AnswerType Stats
        $fname = DBConstants::SP_USER_ANSR_TYPE_STATS;
        $params = array(0=>$userId);
        $result[] = array('Title' => 'Answer Type', 'Data' => $db->function_call($fname, $params, 'select'));        
        
        return $result;
    }
    
    public static function recoverPass($name)
    {
        global $db;
        $name = $db->escale_value($name);

        //call the store procedure
        $fname = DBConstants::SP_USER_BY_NAME;
        $params = array(0=>"'$name'");
        return $db->function_call($fname, $params, 'select');        
    }
    
    public static function saveaddEnergyGame($userId)
    {
        global $db;

        //call the store procedure
        $fname = DBConstants::SP_USER_ADD_ENERGY;
        $params = array(0=>$userId);
        $db->function_call($fname, $params, 'update');   
        
    }
}