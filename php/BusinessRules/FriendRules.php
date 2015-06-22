<?php
//    Created on : Mar 30, 2015, 7:55 PM
//    Author     : David G Chung

require_once 'DataAccess/MySqlDataBase.php';

class FriendRules
{    
    public static function getFriend($userId)
    {
        global $db;

        //call the store procedure
        $fname = DBConstants::SP_FRIEND_BY_ID;
        $params = array(0=>$userId);
        return $db->function_call($fname, $params, 'select');        
    }
    
    public static function deleteFriend($userId, $friendId)
    {
        global $db;

        //call the store procedure
        $fname = DBConstants::SP_FRIEND_DELETE;
        $params = array($userId, $friendId);
        $db->function_call($fname, $params, 'update'); 
    }
    
    public static function sendRequest($userFrom, $userTo)
    {
        global $db;

        //call the store procedure
        $fname = DBConstants::SP_FRIEND_REQUEST_SEND;
        $params = array($userFrom, $userTo);
        $db->function_call($fname, $params, 'update');  
    }
    
    public static function acceptRequest($userFrom, $userTo)
    {
        global $db;

        //call the store procedure
        $fname = DBConstants::SP_FRIEND_REQUEST_ACCEPT;
        $params = array($userFrom, $userTo);
        $db->function_call($fname, $params, 'update'); 
    }    
    public static function declineRequest($userFrom, $userTo)
    {
        global $db;

        //call the store procedure
        $fname = DBConstants::SP_FRIEND_REQUEST_DECLINE;
        $params = array($userFrom, $userTo);
        $db->function_call($fname, $params, 'update'); 
    }    
    public static function deleteRequest($userFrom, $userTo)
    {
        global $db;

        //call the store procedure
        $fname = DBConstants::SP_FRIEND_REQUEST_DELETE;
        $params = array($userFrom, $userTo);
        $db->function_call($fname, $params, 'update'); 
    }
        
    public static function getSentRequest($userId)
    {
        global $db;

        //call the store procedure
        $fname = DBConstants::SP_FRIEND_REQUEST_SENT;
        $params = array(0=>$userId);
        return $db->function_call($fname, $params, 'select'); 
    }    
    public static function getReceivedRequest($userId)
    {
        global $db;

        //call the store procedure
        $fname = DBConstants::SP_FRIEND_REQUEST_RECEIVED;
        $params = array(0=>$userId);
        return $db->function_call($fname, $params, 'select'); 
    }
}