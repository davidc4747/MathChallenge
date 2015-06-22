//Created on : Mar 09, 2015, 11:58 PM
//Author     : David Chung
   
var Endless = function()
{
    Game.call(this);
    var correct = 0, incorrect = 0, timedOut = 0, totalQues = -1;
    
    var game = this;
    this.barUrl = 'html/screens/gameBars/endless.html';
    this.setGameName('endless');
    
    var start = this.start;
    this.start = function()
    {
        if(start.call(this))
        {
            this.bars = {
                correct: { 
                    Id: '',
                    style: {},
                    title: '',
                    text: ''
                },
                timeout: { 
                    Id: '',
                    style: {},
                    title: '',
                    text: ''
                },
                incorrect: { 
                    Id: '',
                    style: {},
                    title: '',
                    text: ''
                }
            };
        }
    };
    
    this.correct = function()
    {
        correct++;
    };
    this.incorrect = function()
    {
        incorrect++;
    };
    this.timeout = function()
    {
        timedOut++;
    };
    
    this.newQuestion = function()
    {
        totalQues++;
        reCalcSummary();
    };
    
    var reCalcSummary = function()
    {
        if(totalQues <= 0)
            return;
        
        //update bars
        game.bars = {
            correct: { 
                Id: '',
                style: {width: correct * 100 / totalQues + '%'},
                title: 'Correct: ' + correct,
                text: Math.floor(correct * 100 / totalQues) + '%'
            },
            timeout: { 
                Id: '',
                style: {width: timedOut * 100 / totalQues + '%'},
                title: 'Timed Out: ' + timedOut,
                text: Math.floor(timedOut * 100 / totalQues) + '%'
            },
            incorrect: { 
                Id: '',
                style: {width: incorrect * 100 / totalQues + '%'},
                title: 'Incorrect: ' + incorrect,
                text: Math.floor(incorrect * 100 / totalQues) + '%'
            }
        };
    };
};