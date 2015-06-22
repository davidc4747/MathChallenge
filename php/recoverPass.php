<?php
//    Created on : Mar 28, 2015, 11:35 PM
//    Author     : David G Chung

require_once './BusinessRules/UserRules.php';

//get post data from site
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$uName = $request->name;

//Get user object from db 
$mess = UserRules::recoverPass($uName);

if(isset($mess['Email']))
{
    //wrap lines are longer than 70 characters
    $msg = "Username: " . $mess['UserName'] . "  " . "Password: " . $mess['Password'];
    $msg = wordwrap($msg, 70);
    
    if(mail($mess['Email'], "Math Challenge -- password request", $msg))
    {
        echo json_encode(array('Type'=> 'success', 'Text'=> 'An email was send'));        
    }
    else
    {
        echo json_encode(array('Type'=> 'error', 'Text'=> 'A system error has occurred'));        
    }
}
else
{
    echo json_encode(array('Type'=> 'error', 'Text'=> 'We do not have an email for this account'));
}

