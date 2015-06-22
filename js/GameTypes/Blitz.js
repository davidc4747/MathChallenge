//Created on : Mar 09, 2015, 2:47 PM
//Author     : David Chung

var Blitz = function()
{
    Game.call(this);
    var TOTAL_TIME = 150000;//2.5 mins
    var gameTime = 0;
    var gameTimer;
    
    var game = this;
    this.barUrl = 'html/screens/gameBars/blitz.html';
    this.setGameName('blitz');
    
    var start = this.start;
    this.start = function()
    {
        if(start.call(this))
        {           
            this.bars = {
                timer: {
                    style: {},
                    title: '',
                    text: ''
                }
            };
        }
    };
    
    var end = this.end;
    this.end = function()
    {
        if(end.call(this))
        {
            stopTimer();
        }
    };
    
    var pause = this.pause;
    this.pause = function()
    {
        //call Game.pause, stop timer
        if(pause.call(this))
        {
            stopTimer();
        }
    };
    
    var resume = this.resume;
    this.resume = function()
    {
        //call Game.resume, start timer        
        if(resume.call(this) && gameTimer == null)
        {
            gameTimer = setTimeout(gameTick, 100);      
        }
    };
    
    var stopTimer = function()
    {
        clearTimeout(gameTimer);
        gameTimer = null;        
    };
    
    var gameTick = function()
    {
        gameTime += 100;
        
        //display time remaining
        var perc = (TOTAL_TIME - gameTime) / TOTAL_TIME;
        perc *= 100;
        game.bars = {
            timer: { 
                Id: 'timer',
                style: {width: perc + '%'},
                title: Math.floor(perc) + '%',
                text: ((TOTAL_TIME - gameTime) / 1000).toFixed(1) + ' Seconds'
            }
        };
            
        //end the game when time runs out
        if(TOTAL_TIME - gameTime <= 0)
        {
            game.end();
            return;
        }
        
        gameTimer = setTimeout(gameTick, 100);
    };
};