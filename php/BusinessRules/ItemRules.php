<?php
//    Created on : Jun 04, 2015, 8:57 AM
//    Author     : David G Chung

require_once 'DataAccess/MySqlDataBase.php';

class ItemRules
{    
    public static function getItems($userId)
    {
        global $db;

        //call the store procedure
        $fname = DBConstants::SP_ITEM;
        $params = array(0=>$userId);
        return $db->function_call($fname, $params, 'select');        
    }
    
    public static function equipItem($userId, $itemId)
    {
        global $db;

        //call the store procedure
        $fname = DBConstants::SP_ITEM_EQUIP;
        $params = array($userId, $itemId);
        $db->function_call($fname, $params, 'update');        
    }
    
    public static function buyItem($userId, $itemId, $quantity)
    {
        global $db;

        //call the store procedure
        $fname = DBConstants::SP_ITEM_BUY;
        $params = array($userId, $itemId, $quantity);
        $db->function_call($fname, $params, 'update');        
    }
}

