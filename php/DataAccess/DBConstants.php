<?php
//    Created on : Mar 13, 2015, 12:24 PM
//    Author     : David G Chung

class DBConstants
{
//    const DB_HOST = 'mysql.chung.special-topics.net';
//    const DB = 'chungdb';
//    const DB_USER = 'dchung14';
//    const DB_PASS = 'Chung6616';
    
    const DB_HOST = 'localhost';
    const DB = 'mathchallenge';
    const DB_USER = 'root';
    const DB_PASS = '';
    
    //DB user constatns
    const SP_USER_BY_NAME = 'sp_UserByName';
    const SP_USER_LOGIN = 'sp_UserLogin';
    const SP_USER_LOGOUT = 'sp_UserLogout';
    const SP_USER_REGISTER = 'sp_UserRegister';
    const SP_USER_UPDATE_STATUS = 'sp_UserUpdateStatus';
    const SP_USER_UPDATE_INFO = 'sp_UserUpdateInfo';
    const SP_USER_UPDATE_PASS = 'sp_UserUpdatePass';
    const SP_USER_SEARCH = 'sp_UserSearch';
    const SP_USER_DATA = 'sp_UserData';
    const SP_USER_GAME_TYPE_STATS = 'sp_UserGameTypeStats';    
    const SP_USER_QUES_TYPE_STATS = 'sp_UserQuesTypeStats';
    const SP_USER_ANSR_TYPE_STATS = 'sp_UserAnsrTypeStats';
    const SP_USER_ADD_ENERGY = 'sp_UserAddEnergy';
    
    //DB friend constants
    const SP_FRIEND_BY_ID = 'sp_FriendByUserId';
    const SP_FRIEND_DELETE = 'sp_FriendDelete';
    
    //DB FriendRequest constants
    const SP_FRIEND_REQUEST_SEND = 'sp_FriendRequestSend';
    const SP_FRIEND_REQUEST_RECEIVED = 'sp_FriendRequestReceived';
    const SP_FRIEND_REQUEST_SENT = 'sp_FriendRequestSent';
    const SP_FRIEND_REQUEST_ACCEPT = 'sp_FriendRequestAccept';
    const SP_FRIEND_REQUEST_DECLINE = 'sp_FriendRequestDecline';
    const SP_FRIEND_REQUEST_DELETE = 'sp_FriendRequestDelete';
    
    //DB game constants
    const SP_GAME_SAVE = 'sp_GameSave';
    const SP_GAME_TOP = 'sp_GameTopFive';
    const SP_GAME_USER_HISTORY = 'sp_GameByUserId';
    const SP_GAME_LAST_DATA = 'sp_GameLastData';
    const SP_GAME_TYPE_DATA = 'sp_GameTypeData';
    
    //DB Question constants
    const SP_QUESTION_SAVE = 'sp_QuestionSave';
    const SP_QUESTION_SAVENUM = 'sp_QuestionSaveNum';
    const SP_QUESTION_ANSWER_BY_USER = 'sp_QuestionAnswerByUserId';
    const SP_QUESTION_ANSWER_LAST = 'sp_QuestionAnswerLast';
    
    //DB Answer constants
    const SP_ANSWER_SAVE = 'sp_AnswerSave';
        
    //DB Item constants
    const SP_ITEM = 'sp_Item';
    const SP_ITEM_EQUIP = 'sp_ItemEquip';
    const SP_ITEM_BUY = 'sp_ItemBuy';
}