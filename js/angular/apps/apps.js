//Created on : Apr 27, 2015, 11:35 PM
//Author     : David G Chung

var pauseMenu = angular.module('pauseMenu', []);
var mainScreen = angular.module('mainScreen', []);

var mathChall = angular.module('mathChallenge', [
    'pauseMenu',
    'mainScreen'
]);

mathChall.filter('capitalize', function() 
{
    return function(input) 
    {
        if (input != null)
        {
            input = input.toLowerCase();            
            return input.substring(0,1).toUpperCase() + input.substring(1);
        }
        return 'undefined';
    };
});

mathChall.factory('$repo', function($http, jquery)
{
    var unsavedGames = [];
    return {
        login: function(postData, callback) 
        {
            var request = $http({
                method: "post",
                url: 'php/login.php',
                data: postData
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error logging in: ' + err);            
            });
        },
        logout: function(callback) 
        {
            jquery.ajax({
                type: 'POST',
                async: false,
                url: 'php/logout.php',
                success: callback,
                error: function(err)
                {
                    console.log('Error logging out: ' + err);
                }
            });          
        },
        register: function(postData, callback) 
        {
            var request = $http({
                method: "post",
                url: 'php/register.php',
                data: postData
            });
            request.success(callback);
            request.error(function()
            {
                console.log('register() error');            
            });            
        },
        recoverPass: function(postData, callback)
        {
            var request = $http({
                method: "post",
                url: 'php/recoverPass.php',
                data: postData
            });
            request.success(callback);
            request.error(function()
            {
                console.log('recoverPass() error');            
            });            
        },
        
        saveGame: function(postData, callback) 
        {
            var self = this;
            var request = $http({
                method: "post",
                url: 'php/saveGame.php',
                data: postData
            });
            request.success(function(data)
            {
                callback(data);
                
                for(var i in unsavedGames)
                {
                    self.saveGame(unsavedGames[i]);
                }
            });
            request.error(function()
            {
                unsavedGames.push(postData);
                console.log('saveGame() error');            
            });
        },
        getTopFive: function(callback) 
        {
            $http.post('php/getTopFive.php')
            .success(callback)
            .error(function(err)
            {
                console.log('Error retrieving high scores: ' + err);            
            });            
        },
        getUserHistory: function(postData, callback) 
        {
            var request = $http({
                method: "post",
                url: 'php/getHistory.php',
                data: postData
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error retrieving data for graphs: ' + err);            
            });
        },
        getQuestionAnswer: function(callback) 
        {
            $http.post('php/getQuestionAnswer.php')
            .success(callback)
            .error(function(err)
            {
                console.log('Error retrieving data for graphs: ' + err);            
            });        
        },
        getLastData: function(callback)
        {
            $http.post('php/getLastData.php')
            .success(callback)
            .error(function(err)
            {
                console.log('Error retrieving last game data: ' + err);            
            });  
        },
        getLastQuestionAnswer: function(callback)
        {
            $http.post('php/getLastQuestionAnswer.php')
            .success(callback)
            .error(function(err)
            {
                console.log('Error retrieving last Question data: ' + err);            
            });              
        },
        getGameTypeData: function(postData, callback)
        {
            var request = $http({
                method: "post",
                url: 'php/getGameTypeData.php',
                data: postData
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error getGameTypeData(): ' + err);            
            });
        },
        
        getUserData: function(postData, callback)
        {
            var request = $http({
                method: "post",
                url: 'php/getUserData.php',
                data: postData
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error getUserData(): ' + err);            
            });    
            
        },
        getUserTypeStats: function(postData, callback)
        {
            
            var request = $http({
                method: "post",
                url: 'php/getUserTypeStats.php',
                data: postData
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error getUserTypeStats(): ' + err);            
            });  
        },
        updateUserStatus: function(postData, callback)
        {
            var request = $http({
                method: "post",
                url: 'php/updateUserStatus.php',
                data: postData
            });
            request.success(callback || function() {});
            request.error(function(err)
            {
                console.log('Error updateUserStatus(): ' + err);            
            });
        },
        updateUser: function(postData, callback)
        {
            var request = $http({
                method: "post",
                url: 'php/updateUser.php',
                data: postData
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error updating user info: ' + err);            
            });
            
        },
        updatePass: function(postData, callback)
        {
            var request = $http({
                method: "post",
                url: 'php/updatePass.php',
                data: postData
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error updating password: ' + err);            
            });
        },
        searchUser: function(postData, callback)
        {
            var request = $http({
                method: "post",
                url: 'php/searchUser.php',
                data: postData
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error searching for users: ' + err);            
            });            
        },
        
        sendFriendRequest: function(postData, callback)
        {
            var request = $http({
                method: "post",
                url: 'php/sendFriendRequest.php',
                data: postData
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error in sendFriendRequest(): ' + err);            
            }); 
        },
        
        acceptRequest: function(postData, callback)
        {
            var request = $http({
                method: "post",
                url: 'php/acceptRequest.php',
                data: postData
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error in acceptRequest(): ' + err);            
            });         
        },
        declineRequest: function(postData, callback)
        {
            var request = $http({
                method: "post",
                url: 'php/declineRequest.php',
                data: postData
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error in declineRequest(): ' + err);            
            });            
        },
        deleteRequest: function(postData, callback)
        {
            var request = $http({
                method: "post",
                url: 'php/deleteRequest.php',
                data: postData
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error in deleteRequest(): ' + err);            
            });         
        },
        
        getSentRequest: function(callback)
        {
            var request = $http({
                method: "post",
                url: 'php/getSentRequest.php'
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error in getSentRequest(): ' + err);            
            });            
        },
        getReceivedRequest: function(callback)
        {
            var request = $http({
                method: "post",
                url: 'php/getReceivedRequest.php'
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error in getReceivedRequest(): ' + err);            
            });            
        },
        
        getFriend: function(callback)
        {
            var request = $http({
                method: "post",
                url: 'php/getFriend.php'
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error in getFriend(): ' + err);            
            });             
        },
        deleteFriend: function(postData, callback)
        {            
            var request = $http({
                method: "post",
                url: 'php/deleteFriend.php',
                data: postData
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error in deleteFriend(): ' + err);            
            });    
        },
        
        getItems: function(postData, callback)
        {
            var request = $http({
                method: "post",
                url: 'php/getItems.php',
                data: postData
            });
            request.success(callback);
            request.error(function(err)
            {
                console.log('Error in getItems(): ' + err);            
            });             
        },
        equipItem: function(postData, callback)
        {
            var request = $http({
                method: "post",
                url: 'php/equipItem.php',
                data: postData
            });
            request.success(callback || function(){});
            request.error(function(err)
            {
                console.log('Error in equipItem(): ' + err);            
            });             
        },
        buyItem: function(postData, callback)
        {
            var request = $http({
                method: "post",
                url: 'php/buyItem.php',
                data: postData
            });
            request.success(callback || function(){});
            request.error(function(err)
            {
                console.log('Error in buyItem(): ' + err);            
            });            
        }
        
    };
});


mathChall.value('toArray', function(obj)
{
    if(obj.constructor !== Array)
        obj = [obj];
    return obj;
});

mathChall.value('measureText', function(text, font)
{
    font = font || $('body').css('font');
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    ctx.font = font; 
    var str = text;
    return ctx.measureText(str).width;
});

mathChall.value('range', function(num)
{
    var range = [];
    for (var i=0; i<num; i++)
      range.push(i);
    return range;
});

mathChall.value('d3', d3);
mathChall.value('jquery', angular.element);