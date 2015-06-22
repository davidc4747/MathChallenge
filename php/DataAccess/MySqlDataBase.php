<?php
//    Created on : Mar 13, 2015, 12:24 PM
//    Author     : David G Chung

include_once 'DBConstants.php';

class MySqlDataBase
{
    private $con;
    
    function __construct()
    {
        $this->open();
    }
    
    private function open()
    {
        //Connect to db
        $this->con = mysqli_connect(DBConstants::DB_HOST, DBConstants::DB_USER, DBConstants::DB_PASS, DBConstants::DB);
        if (mysqli_connect_errno())        
            die("Failed to connect to MySQL: " . mysqli_connect_error() . '('.mysqli_connect_errno().')'); 
    }
    
    private function close()
    {
        //Close $connection, return
        if(isset($this->con))
        {
            mysqli_close($this->con);
            unset($this->con);
        }
    }
    
    public function query($sql)
    {
        //Run query
        $result = mysqli_query($this->con, $sql);//echo "<br/>$sql  ";
        if(!$result)
            die("Database query failed. ");        
        return $result;
    }
    
    public function escale_value($str)
    {
        return mysqli_real_escape_string($this->con, $str);
    }
    
    public function fetch_assoc($result)
    {
        return mysqli_fetch_assoc($result);
    }
    
    public function insert_id()
    {
        return mysqli_insert_id($this->con);
    }
    
    public function function_call($funcName, $params=array(), $actionType='')
    {
        $this->open();
        
        //validate input
        $actionType = strtoupper($actionType);
        if($actionType != 'SELECT' && $actionType != 'UPDATE')
            return null;
        
        //Create sql parameters
        $sql = '';
        foreach ($params as $param)
            $sql .= "$param,";
        
        //Call function
        $sql = "CALL `$funcName`(" . rtrim($sql, ",") . ");";
        $result = $this->query($sql);
        
        //Create array off ALL the rows
        $objs = array();
        if($actionType == 'SELECT' && $result != null)
            while($row = $this->fetch_assoc($result))
                $objs[] = $row;
                
        $this->close();
        if (count($objs) == 1)        
            return $objs[0];     
        else
            return $objs;
    }
}

$db = new MySqlDataBase();