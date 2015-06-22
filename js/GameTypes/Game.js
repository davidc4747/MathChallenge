//Created on : Mar 02, 2015,4:41 PM
//Author     : David Chung
   
var Game = function()
{
    var MAX_SECS = 60;
    var MAX_POINTS = 100;    
    var correctAnswer = 0, totalScore = 0, multiplier = 1;
    var timeOutCount = 0, hasTimedout = false;
    
    var totalTime = 0;
    var multTime = 0, scoreTime = 0;
    var multiTimer, scoreTimer;
    
    var GameState = Object.freeze({UNSTARTED:1, PLAYING:2, PAUSED:3, ENDED:4});
    var curState = GameState.UNSTARTED;
    
    var gameData = new GameData();
    var quesIndex = -1;   
    
    var game = this;
    
    var nums = [];
    var quesType = '';
    
    this.answerRows = [];
    this.bars = [];
    
    this.start = function()
    { 
        try
        {
            //you can ONLY start a game that hasn't been started
            if(curState != GameState.UNSTARTED)
                return false;
            
            //start the game
            curState = GameState.PAUSED;
            game.resume();
            genProblem();
            return true;
        }
        catch(err) 
        {
            alert('ERROR Game.start(): ' + err);
        }        
    };
    
    this.end = function()
    {
        try
        {            
            //can't end a game that never started || is already over
            if(curState == GameState.UNSTARTED || curState == GameState.ENDED)
                return false;
            
            stopTimers();
            curState = GameState.ENDED;    
            return true;
        }
        catch(err) 
        {
            alert('ERROR Game.end(): ' + err);
        }
    };
    
    this.pause = function()
    { 
        //you can ONLY pause a game that's playing
        if(curState != GameState.PLAYING)
            return false;
            
        stopTimers(); 
        curState = GameState.PAUSED;
        return true;
    };
    
    this.resume = function()
    {
        //you can ONLY resume a game that's paused
        if(curState != GameState.PAUSED)
            return false;
        
        //start timers
        curState = GameState.PLAYING;
        multiTimer = setTimeout(multiTick, 100);
        scoreTimer = setTimeout(scoreTick, 1000);
        return true;        
    }; 
    
    this.checkAnswer = function(num)
    {
        //Return if the game isn't playing
        if(curState != GameState.PLAYING)
            return;
        
        //save info for db
        var answerData = new AnswerData();
        answerData.TimeToAnswer = scoreTime;
        answerData.Number = num;
        
        var isCorrect;
        if(num == correctAnswer)
        {
            //  flash green, add points, add 1 to multiplier           
            isCorrect = true;
            totalScore += this.getScore() * multiplier;
            adjustMulti(1);
            
            //set DB vars
            answerData.AnswerType = 'correct';
            answerData.Score = this.getScore();
            answerData.Multiplier = multiplier;
            game.correct();
        }
        else
        {                
            //  flash red, subtract 5 from multiplier
            isCorrect = false;
            adjustMulti(-5);
            answerData.AnswerType = 'incorrect';
            game.incorrect();
        }
        
        gameData.Questions[quesIndex].Answer = answerData;
        
        genProblem();
        timeOutCount = 0;
        return isCorrect;
    };
    
    var genProblem = function()
    {
        //Return if the game isn't playing
        if(curState != GameState.PLAYING)
            return;
        
        //set up for new problem  
        scoreTime = 0;
               
        //generate the question
        questionGenerator.genQues(totalScore);
        
        //calc correct answer
        correctAnswer = getCorrectAnswer(quesType);        
               
        //Generate answers that make the question trickier
        var answers = genAnswers(quesType, correctAnswer);
        answers.sort();
        
        //Suffle array
        var shiftNum = Math.floor(Math.random() * 9);
        for(var i = 0; i < shiftNum; i++)
            answers.push(answers.shift());
        
        //Format array so it can easily be displayed
        game.answerRows = [];
        for(var i = 0; i < 3; i++)
        {
            var row = [];
            for(var j = 0; j < 3; j++)
                row.push(answers[i * 3 + j]);
            game.answerRows.push(row);
        }
        
        //save info for db
        var quesData = new QuestionData();
        quesData.QuestionType = quesType;
        quesData.NumAnswersDisplayed = 9;
        quesData.CorrectAnswer = correctAnswer;
        for(var i=0; i < nums.length; i++)        
            quesData.Nums.push(nums[i]);
        
        gameData.Questions.push(quesData);
        quesIndex++;
        
        //Call function for child classes to use
        game.newQuestion();
    };
    
    
    var questionGenerator = {
        genQues: function(totalScore)
        {
            if(totalScore < 60000)
                this.genAdd(totalScore);
            else if(totalScore < 120000)
                this.genSub(totalScore % 50000);
            else if(totalScore < 180000)
                this.genMult(totalScore % 110000);
            else if(totalScore < 240000)
                this.genDiv(totalScore % 170000);
            else
            {
                //Randomly pick a problem
                switch(Math.floor(Math.random() * 4))
                {
                    case 0:
                        this.genAdd(totalScore % 210000);
                        break;
                    case 1:
                        this.genSub(totalScore % 210000);
                        break;
                    case 2:
                        this.genMult(totalScore % 210000);
                        break;
                    case 3:
                        this.genDiv(totalScore % 210000);
                        break;
                }    
            }
        },
        genAdd: function(totalScore)
        {
            quesType = 'addition';
            
            //At 50,000 totalScore start displaying next problems type
            //Slowly increase the change of next problem type for 10,000 socre
            //100% chance for next problem type at 60,000 totalScore
            var subChance = (totalScore - 50000) / 10000;
            if(Math.random() < subChance)
            {
                this.genSub(totalScore % 50000);
                return;
            }
            
            //equation that gradually increases 
            //the numbers that are generated
            var x = Math.pow((totalScore / 45), 0.666);            
                        
            //generate the numbers
            nums = [];
            for(var i = 0; i < this.getNumOfNums(totalScore); i++)
                nums.push(this.genNum(x, x + 25));            
        },
        genSub: function(totalScore)
        {
            quesType = 'subtraction';
            
            //At 50,000 totalScore start displaying next problems type
            //Slowly increase the change of next problem type for 10,000 socre
            //100% chance for next problem type at 60,000 totalScore
            var multChance = (totalScore - 50000) / 10000;
            if(Math.random() < multChance)
            {
                this.genMult(totalScore % 50000);
                return;
            }
            
            //equation that gradually increases 
            //the numbers that are generated
            var x = Math.pow((totalScore / 45), 0.666);            
            var difference = this.genNum(x, x + 25);

            //generate the numbers
            nums = [];
            for(var i = 1; i < this.getNumOfNums(totalScore); i++)
            {
                var num = this.genNum(0, x + 15);
                difference += num;
                nums.push(num);
            }            
            nums.push(difference);
            
            //sort high -> low
            //No negative answers until after 30,000
            if(totalScore <= 30000)
                nums.sort(function(a, b){return b-a;});
        },
        genMult: function(totalScore)
        {
            quesType = 'multiplication';
            
            //At 50,000 totalScore start displaying next problems type
            //Slowly increase the change of next problem type for 10,000 socre
            //100% chance for next problem type at 60,000 totalScore
            var divChance = (totalScore - 50000) / 10000;
            if(Math.random() < divChance)
            {
                this.genDiv(totalScore % 50000);
                return;
            }            
            
            //equation that gradually increases 
            //the numbers that are generated
            var x = Math.pow((totalScore / 45), 0.666) / 10;            
            
            //generate the numbers
            nums = [];
            for(var i = 0; i < 2; i++)
                nums.push(this.genNum(0, x + 4));       
        },
        genDiv: function(totalScore)
        {
            quesType = 'division';
            
            //equation that gradually increases 
            //the numbers that are generated
            var x = Math.pow((totalScore / 45), 0.666) / 10;            
            var quotient = this.genNum(1, 2 * x + 1);
            
            //generate the numbers
            nums = [];
            for(var i = 1; i < 2; i++)
            {
                var num = this.genNum(1, x + 4);
                quotient *= num;
                nums.push(num);
            }            
            nums.push(quotient);            
            
            //sort high -> low
            //No decimal answers until after 30,000
            if(totalScore <= 30000)
                nums.sort(function(a, b){return b-a;});
        },
        
        getNumOfNums: function(totalScore)
        {            
            //start displaying 3 number at a totalScore of 40,000
            //gradually increase the change of 3 number for the next 10,000 score
            //only display 3 number for anything over 50,000 score
            var threeNumChance = (totalScore - 40000) / 10000;
            
            //should the question generate 3 numbers or 2?
            var numOfNums;            
            if(Math.random() < threeNumChance)
                numOfNums = 3;
            else
                numOfNums = 2;
            return numOfNums;
        },
        genNum: function(min, max)
        {
            //validate input
            min = min || 1;
            max = max || 100;
            if(max < min)
                throw "Max cannot be less than min (" + min + ", " + max + ")";

            //Generate number
            return Math.floor(Math.random() * (max - min) + min);
        }
    };
    
    var genAnswers = function(questionType, correctAnswer)
    {
        var answers = []; 
        switch(questionType)
        {
            case 'addition':
            case 'subtraction':
                for(var i = -10; i <= 10; i+= 10)
                    for(var j = -1; j <= 1; j++)
                        answers.push(correctAnswer + i + j);
                break;
                
            case 'multiplication':
                answers.push(correctAnswer);
                for(var i in nums)
                    for(var j = nums[i] - 2; j <= nums[i] + 2; j++)
                        if(j != nums[i])
                            answers.push(j * nums[(i+1) % nums.length]);
                
                break;
                
            case 'division':
                var sqrt =  Math.sqrt(nums[0]);
                var count = 0;
                function pushAnswer(num)
                {
                    //dont add if it's already an answer
                    if(answers.indexOf(num) == -1)
                    {
                        count++;
                        answers.push(num);
                    }
                }
                              
                pushAnswer(correctAnswer);
                //get all multiples of num[0] and add them to answer
                for(var i = 1; i <= sqrt && count < 9; i++)                
                    if(nums[0] % i == 0)
                    {
                        pushAnswer(i);
                        pushAnswer(i / nums[0]);
                        pushAnswer(nums[0] / i);
                    }
                
                //if there arn't enough multiples
                //use the same loop from multiplication
                for(var i in nums)                
                    for(var j = nums[i] - 3; j <= nums[i] + 3 && count < 9; j++)
                    {
                        var num = j / nums[(i+1) % nums.length];
                        pushAnswer(num);
                        
                        num = nums[(i+1) % nums.length] / j;
                        pushAnswer(num);
                        
                    }
                
                break;
        }    
        return answers;
    };
    
    var adjustMulti = function(num)
    {
        if(num > 0)
        {
            multTime = 0;
        }
        else
        {
            //TODO: flash mult bar
        }
        
        if (multiplier + num <= 0)
            multiplier = 1;
        else
            multiplier += num;      
    };
    
    var resetMulti = function()
    {
        multTime = 0;
        multiplier = 1;
    };
    
    var stopTimers = function()
    {        
        clearTimeout(multiTimer);
        clearTimeout(scoreTimer);
        multiTimer = scoreTimer = null;  
    };
    
    //Functions for child classes to use
    this.correct = function(){};
    this.incorrect = function(){};
    this.timeout = function(){};
    this.newQuestion = function(){};
    //---
    
    this.isUnstarted = function(){ return (curState == GameState.UNSTARTED); };
    this.isActive = function(){ return curState == GameState.PLAYING || curState == GameState.PAUSED; };
    this.isPaused = function(){ return (curState == GameState.PAUSED); };
    this.hasEnded = function(){ return (curState == GameState.ENDED); };
    
    this.getTotalScore = function(){ return totalScore; };
    
    this.getScore = function ()
    {
        return Math.floor(MAX_POINTS * ((MAX_SECS - scoreTime) / MAX_SECS));
    };
    this.getScorePerc = function()
    {
        var perc = this.getScore() / MAX_POINTS;
        perc = Math.floor(perc * 100);
        return perc;        
    };
    
    this.getMulti = function() { return multiplier; };
    this.getMultiPerc = function() 
    { 
        var totalTime = (MAX_SECS / multiplier) * 1000;
        var perc = (totalTime - multTime * 100) / (totalTime);
        perc = Math.floor(perc * 100);
        return (perc <= 0) ? 1.0 : perc;
    };
    
    this.hasTimedout = function()
    {
        if(hasTimedout)
        {
            hasTimedout = false;
            return true;
        }
        return false;
    };
    
    this.setGameName = function(value)
    {
        gameData.Type = value;
    };
    this.getGameData = function() 
    {
        var tempData = gameData;
        gameData = {};
        return tempData;
    };
    
    var getCorrectAnswer = function(questionType)
    {
        var correctAnswer;
        switch(questionType)
        {
            case 'addition':
                correctAnswer = nums[0];
                for(var i=1; i < nums.length; i++)        
                    correctAnswer += nums[i];                
                break;
                
            case 'subtraction':
                correctAnswer = nums[0];
                for(var i=1; i < nums.length; i++)        
                    correctAnswer -= nums[i];
                break;
                
            case 'multiplication':
                correctAnswer = nums[0];
                for(var i=1; i < nums.length; i++)        
                    correctAnswer *= nums[i];
                break;
                
            case 'division':
                correctAnswer = nums[0];
                for(var i=1; i < nums.length; i++)        
                    correctAnswer /= nums[i];
                break;
        }        
        return correctAnswer;
    };
    
    this.getQuestionString = function()
    {
        var sign = getSign(quesType);
        
        var str = '';
        if(nums.length > 0)
        {
            str = nums[0].toString();
            for(var i=1; i < nums.length; i++)
                str += ' ' + sign + ' ' + nums[i];
        }
        return str;      
    };
    
    var getSign = function(questionType)
    {
        switch(questionType)
        {
            case 'addition':
                return '+';
            case 'subtraction':
                return '-';
            case 'multiplication':
                return '*';
            case 'division':
                return '/';
        }
    };
    
    //---Timers--- 
    var multiTick = function ()
    {
        //only tick if the game in playing
        if(curState != GameState.PLAYING)
            return;
        
        if(multiplier > 1)
            multTime++;
        
        //calc totalTime
        var totalTime = (MAX_SECS / multiplier) * 1000;
        
        //if mult timed out
        if(totalTime - multTime * 100 <= 0)
        {
            multTime = 0;
            adjustMulti(-1);
        }
        
        multiTimer = setTimeout(multiTick, 100);
    };

    var scoreTick = function ()
    {
        //only tick if the game in playing
        if(curState != GameState.PLAYING)
            return;
        
        //update timer
        scoreTime++;
        
        //if question times out
        if(game.getScore() <= 0) 
        {
            //save info for db
            var answerData = new AnswerData();
            answerData.AnswerType = 'timeout';
            gameData.Questions[quesIndex].Answer = answerData;
            
            //timout logic
            adjustMulti(-5);
            hasTimedout = true;
            game.timeout();
            genProblem();
            
            //Pause game if you're away
            timeOutCount++;
            if(timeOutCount == 3)
            {
                game.pause();
                timeOutCount = 0;
                return;
            }
        }
        
        scoreTimer = setTimeout(scoreTick, 1000); 
    };
};