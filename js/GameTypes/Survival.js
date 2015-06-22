//Created on : Mar 09, 2015, 6:16 PM
//Author     : David Chung

var Survival = function()
{
    Game.call(this);
    var MAX_LIVES = 20;
    var lives = 3, livesGained = 0;
    
    var game = this;
    this.barUrl = 'html/screens/gameBars/survival.html';
    this.setGameName('survival');
    
    var start = this.start;
    this.start = function()
    {
        if(start.call(this))
        {
            this.bars = {
                lives: {
                    style: {},
                    title: '',
                    text: ''
                }
            };
            displayLives();
        }
    };
    
    this.correct = function()
    {
        //add 1 life every 10,000 points
        if(this.getTotalScore() - 10000 * (livesGained + 1) >= 0)
        {
            livesGained++;
            lives++;
            
            //Clamp lives
            if(lives >= MAX_LIVES)
                lives = MAX_LIVES;
            displayLives();
        }
        
    };
    
    this.incorrect = function()
    {
        //Remove a life when you answer wrong
        lives--;
        displayLives();
        
        //Game Over
        if(lives <= 0)
            game.end();
        
    };
    
    this.timeout = function()
    {
        //Remove a life when you timout
        lives--;
        displayLives();
        
        //Game Over
        if(lives <=0)
            game.end();        
    };
    
    var displayLives = function()
    {        
        try
        {            
            //Display proper lives
            var perc = lives / MAX_LIVES;
            perc *= 100;
            game.bars = {
                lives: { 
                    style: { width: perc + '%'},
                    title: Math.floor(perc) + '%',
                    text: lives + ' Lives'
                }
            };
        }
        catch(err)
        {
            alert('Suvival.displayLives(): ' + err);
        }
    };
    
};