//Created on : Apr 27, 2015, 11:35 PM
//Author     : David G Chung

pauseMenu.controller('PauseController', function($scope, pauseManager, gameManager, Session)
{
    $scope.pauseManager = pauseManager;
    $scope.tabsArray = pauseManager.tabsArray;
    $scope.currentTab = pauseManager.currentTab;
    $scope.isHidden = pauseManager.isHidden;
    $scope.showMenu = false;
    
    $scope.$watch(function() { return pauseManager.currentTab; }, 
        function(newValue) { $scope.currentTab = newValue; });
        
    $scope.$watch(function() { return pauseManager.isHidden; },
        function(newValue) 
        {
            $scope.isHidden = newValue; 
            $scope.showMenu = false;
        });
        
    $scope.$watch(function() { return Session.isLoggedin(); },
        function(newValue) { $scope.enabled = newValue; });
    
    $scope.enabled = false;
    
    $scope.enable = function() { $scope.enabled = true; };
    $scope.disable = function() { $scope.enabled = false; };
    
    $scope.show = function(tab)
    {
        $scope.showMenu = false;
        if($scope.enabled)
            pauseManager.show(tab);
    };   
    
    $scope.hide = function() { pauseManager.hide(); };
    
    window.onbeforeunload = function()
    {
        //log out the user
        Session.logout();
    };
});
pauseMenu.service('pauseManager', function(gameManager, profileData, $timeout)
{
    var tabs = {
        pauseMenu: {
            isActive: false,
            class: 'pause-menu',
            title: 'Pause Menu',
            content: 'html/tabs/pause-menu.html'
        },
        profile: {
            isActive: false,
            class: 'profile',
            title: 'Your Profile',
            content: 'html/tabs/profile.html'
        },
        shop: {
            isActive: false,
            class: 'shop',
            title: 'Item Shop',
            content: 'html/tabs/shop.html'
        },
        friends: {
            isActive: false,
            class: 'friends',
            title: 'Friends List',
            content: 'html/tabs/friends.html'
        },
        history: {
            isActive: false,
            class: 'history',
            title: 'Game History',
            content: 'html/tabs/history.html'
        },
        settings: {
            isActive: false,
            class: 'settings',
            title: 'Settings',
            content: 'html/tabs/settings.html'
        }
    };
    this.tabsArray = [tabs.pauseMenu, tabs.profile,
                        tabs.shop, tabs.friends, 
                        tabs.history, tabs.settings];
    var pauseScreens = {
        login: {
            content: 'html/pauseScreens/login.html'
        },
        scoreCard: {
            content: 'html/pauseScreens/score-card.html'
        },
        pleaseLogin: {
            content: 'html/pauseScreens/pleaseLogin.html'
        },
        userStats: {
            content: 'html/pauseScreens/userStats.html'
        },
        register: {
            content: 'html/pauseScreens/register.html'
        },
        forgotPass: {
            content: 'html/pauseScreens/forgotPass.html'
        }
    };
    
    this.currentTab = pauseScreens.login;
    this.isHidden = true;
    
    this.show = function(tab)
    { 
        this.isHidden = false;
        gameManager.pause();
        if(tab != null && tab != this.currentTab)
        {
            //switch the tabs
            this.currentTab.isActive = false;
            tab.isActive = true;
            
            this.currentTab = tab;
            $timeout.cancel(profileData.chartTimer);
        }
    };
    this.hide = function() 
    { 
        this.isHidden = true; 
        gameManager.resume();
    };
    
    this.showLogin = function() { this.show(pauseScreens.login); };
    this.showScoreCard = function() { this.show(tabs.pauseMenu); this.show(pauseScreens.scoreCard); };
    this.showPleaseLogin = function() { this.show(pauseScreens.pleaseLogin); };
    this.showUserStats = function() { this.show(pauseScreens.userStats); };
    this.showRegister = function() { this.show(pauseScreens.register); };
    this.showForgotPass = function() { this.show(pauseScreens.forgotPass); };
    
    this.showPauseMenu = function() { this.show(tabs.pauseMenu); };
    this.showProfile = function() { this.show(tabs.profile); };
    this.showShop = function() { this.show(tabs.shop); };
    this.showAchieve = function() { this.show(tabs.achieve); };
    this.showFriends = function() { this.show(tabs.friends); };
    this.showHistory = function() { this.show(tabs.history); };
    this.showSettings = function() { this.show(tabs.settings); };
});

pauseMenu.service('Session', function($repo)
{
    var user = null;
    var loggedin = false;
    
    var self = this;
    this.User = {};
    
    this.login = function(username, password, callback)
    {
        $repo.login({uName: username, pWord: password },
        function(data)
        {
            //if the user exsits
            if(data.User_Id != null)
            {
                user = data;
                loggedin = true;
                
                self.User = {
                    Id: user.User_Id,
                    UserName: user.UserName,
                    Email: user.Email,
                    Age: user.Age        
                };          
            }
            callback();
        });
    };
    
    this.logout = function(callback)
    {
        $repo.logout(callback);
        user = null;
        loggedin = false;
    };
    
    this.isLoggedin = function()
    {
        return loggedin;
    };
    
});


mainScreen.controller('MainController', function($scope, $timeout, mainManager, pauseManager, gameManager, Session)
{
    $scope.screens = {
        main: { 
            title: 'Math Challenge',
            class: 'menu',
            content: 'html/screens/main.html'
        },
        game: { 
            title: '-- + --',
            class: 'answers',
            content: 'html/screens/game.html'
        }
    };
    $scope.screen = $scope.screens.main;
        
    $scope.$watch(function() { return mainManager.backgroundColor; }, 
        function(newVal) { $scope.$parent.backgroundColor = newVal; });
        
    $scope.$watch(function() { return gameManager.isPaused(); }, 
        function(newVal) 
        { 
            if(newVal)
                pauseManager.show();             
        });
        
    $scope.mainManager = mainManager;
    $scope.gameManager = gameManager;
    
    var clickEnabled = true;
    
    $scope.startSurvival = function() { newGame(new Survival()); };
    $scope.startBlitz = function() { newGame(new Blitz()); };
    $scope.startEndless = function() { newGame(new Endless()); };
    
    $scope.showPause = function() { pauseManager.show(); };
    
    $scope.checkAnswer = function(e, num)
    {
        if(!clickEnabled)
            return;
        clickEnabled = false;
                
        //save score and multi for animation
        var score = gameManager.getScore();
        var multi = gameManager.getMulti();

        //Check Answer
        var isCorrect = gameManager.checkAnswer(num);
        if(isCorrect)
        {
            //flash background red, play some other animations
            mainManager.flashScreen('#54B500');
            mainManager.animateAddScore(score, multi);
            
            //Decide which word to use
            var totalPoints = score * multi;
            var str = '';
            if(totalPoints < 100)
                str = 'Nice';
            else if(totalPoints < 250)
                str = 'Good';
            else if(totalPoints < 625)
                str = 'Great';
            else if(totalPoints < 1562.5)
                str = 'Awesome';
            else if(Math.random() < 0.5)
                str = 'Amazing';
            else
                str = 'Outstanding';
            
            //Add the dom element at the correct position
            mainManager.animateWord(str, e.clientX, e.clientY);
        }
        else
        {
            //flash background red
            mainManager.flashScreen('#D30000');            
        }
        $scope.screen.title = gameManager.getQuestionString();

        //re-enable click
        setTimeout(function() { clickEnabled = true; }, 500);
    };
    
    var newGame = function(inGame)
    {
        gameManager.newGame(inGame);
        $scope.screen = $scope.screens.game;
        $scope.screen.title = gameManager.getQuestionString();
        
        $timeout(renderGameScreen, 100);   
    };
    
    var renderGameScreen = function()
    {        
        //check if question timed out  
        if(gameManager.hasTimedout())
        {
            mainManager.flashScreen('#000');
            $scope.screen.title = gameManager.getQuestionString();
        }
        
        //Check if game ened
        if(gameManager.hasEnded())
        {
            if(Session.isLoggedin())
            {
                //Save Game
                gameManager.saveGame(function(data)
                {
//                    console.log('saveGame: ' + data); 
                    pauseManager.showScoreCard();//Display final stats
                });
            }
            else
            {
                //Ask play to login
                pauseManager.showPleaseLogin();
            }
            
            
            //go back to home 
            $scope.screen = $scope.screens.main;            
            return;
        }        
        
        if(gameManager.isActive())
            $timeout(renderGameScreen, 100);
    };
});

mainScreen.service('mainManager', function($timeout, measureText)
{   
    this.backgroundColor = '';
    this.titleColor = '';
    this.hideGrid = false;
    this.displayScore = 0;
    
    var self = this;
    var backgroundFlashing = false;
    
    this.animateWord = function(str, x, y)
    {
        var word = $('<div></div>')
                    .attr('class', 'word-ani')
                    .text(str);
        
        var strWidth = measureText(word.text(), word.css('font'));
        word.css({  top:  y - (word.height() / 2), 
                    left: x - (strWidth / 2)});
                
        $('body').append(word);
        setTimeout(function() 
        {
            word.remove();
        }, 1000);
    };
    this.animateAddScore = function(score, multi)
    {
        //create #added move element
        var addedMove = $('<div></div>').attr('class', 'move-ani');
        addedMove.html('+' + score);
        addedMove.css({color: 'gold', top: $('#added .label').offset().top, left: $('#added .label').offset().left});
        $('body').append(addedMove);

        //create #mult move element
        var multiMove = $('<div></div>').attr('class', 'move-ani');
        multiMove.html('x' + multi);
        multiMove.css({color: 'cornflowerblue', top: $('#multi .label').offset().top, left: $('#multi .label').offset().left});
        $('body').append(multiMove);

        //measure strings
        var addWidth = measureText(addedMove.text(), addedMove.css('font'));
        var multiWidth = measureText(multiMove.text(), multiMove.css('font'));

        //set addedMove's destination, animate;
        addedMove.animate(
        {
            top: $('#info').offset().top + $('#info').height(),
            left: $('#info').offset().left + $('#info').width() - addWidth - multiWidth
        }, 700);

        //set multiMove's destination, animate
        multiMove.animate(
        {
            top: $('#info').offset().top + $('#info').height(),
            left: $('#info').offset().left + $('#info').width() - multiWidth
        }, 700);

        //pause to allow player to read the score, then disappear
        setTimeout(function() 
        {
            //combine mutiMove and addMove to display one score
            addedMove.remove();
            multiMove.html('+' + (score * multi));
            multiMove.css({color: 'gold'});
            multiWidth = measureText(multiMove.text(), multiMove.css('font'));

            //adjust position, animate
            multiMove.css({ left: $('#info').offset().left + $('#info').width() - multiWidth });
            multiMove.animate({ top: $('#info').offset().top }, 1500);
        }, 1401); 
        setTimeout(function() 
        {
            //end animation
            multiMove.remove();
            refreshScore(self.displayScore + (score * multi));
        }, 2501);
    };
    var refreshScore = function(newVal)
    {
        //animate the score increase
        var increment = (newVal - self.displayScore) / 50;//0.25 mins
        var updateScoreDisplay = function()
        {
            self.displayScore = Math.floor(self.displayScore + increment);
            if(self.displayScore < newVal)
                $timeout(updateScoreDisplay, 5);
        };
        updateScoreDisplay();
    };
        
    this.flashScreen = function(bodyColor)
    {
        //return if the screen is already flashing
        if(backgroundFlashing)
            return;
        backgroundFlashing = true;
        
        //hide
        var tempColor = self.backgroundColor;
        self.backgroundColor = bodyColor;
        self.titleColor = bodyColor;
        self.hideGrid = true;
        
        $timeout(function()
        {
            //show
            backgroundFlashing = false;
            self.backgroundColor = tempColor;
            self.titleColor = '';
            self.hideGrid = false;
        }, 600);
    };
});
mainScreen.service('gameManager', function($repo)
{
    var saved = true;
    var game = new Game();
    
    this.getAnswerRows =function() { return game.answerRows; };
    this.getbarUrl = function() { return game.barUrl; };
    this.getBars = function() { return (game.isActive()) ? game.bars : []; };
    
    this.checkAnswer = function(num) { return game.checkAnswer(num); };
    
    this.start = function() 
    { 
        game.start();
        
        //Change user status to gaming
        $repo.updateUserStatus({ stats: 'gaming' });
    };
    this.end = function() 
    { 
        game.end();
        
        //Change user status to online
        $repo.updateUserStatus({ stats: 'online' });
    };
    this.pause =  function() { game.pause(); };
    this.resume = function() { game.resume(); };
    
    this.isUnstarted = function() { return game.isUnstarted(); };
    this.isActive = function() { return game.isActive(); };
    this.isPaused = function() { return game.isPaused(); };
    this.hasEnded = function() { return game.hasEnded(); };
    this.hasTimedout = function() { return game.hasTimedout(); };
    
    this.getTotalScore = function() { return game.getTotalScore(); };
    
    this.getScore = function() { return game.getScore(); };
    this.getScorePerc = function() { return game.getScorePerc(); };
    
    this.getMulti = function() { return game.getMulti(); };
    this.getMultiPerc = function() { return game.getMultiPerc(); };
    
    this.getQuestionString = function() { return game.getQuestionString(); };
    
    this.newGame = function(inGame) 
    {
        //don't change games while one is still running
        if(game.isActive())
            return;
        
        //Start the new game
        game = inGame;
        this.start();
        saved = false;
        
        //this.bars = game.bars;
        this.answerRows = game.answerRows;
    };
    
    this.reset = function()
    {
        game = new Game(); 
    };
    
    this.saveGame = function(callback)
    {
        //don't save a game that never started
        if(!this.isUnstarted())
        {
            $repo.saveGame({ gData: game.getGameData() }, callback);
            saved = true;        
            this.reset();//Reset Screen  
        }
        else
        {
            callback(null);
        }   
        
        //Change user status to online
        $repo.updateUserStatus({ stats: 'online' });
    };
    
    this.isSaved = function () { return saved; };
});
mainScreen.directive('progressBar', function($timeout, d3, measureText)
{
    return {
        restrict: 'C',
        scope: {
            value: '@',
            percent: '@'
        },
        template:                 
                '<div class="progress" ng-style="progressStyle">' +
                    '<div class="bar" ng-style="barStyle"></div>' +
                    '<div class="label" style="float: {{labelFloat}}">{{before}}{{value}}</div>' + 
                '</div>',
        link: function($scope, element, attrs)
        {
            
            var reverseAlign = function(align)
            {
                if(align == 'left')
                    return 'right';
                else if(align == 'right')
                    return 'left';
            };
            
            var updateStyles = function()
            {
                //Styles
                $scope.progressStyle = { 
                    'color': $scope.color,
                    'width': $scope.percent + '%',
                    'float': reverseAlign($scope.align)
                };
                $scope.barStyle = { 
                    'background-color': $scope.color
                };
            };
            
            //init Attributes
            $scope.color = attrs.color;
            $scope.percent = attrs.percent;
            $scope.value = attrs.value || $scope.percent;
            $scope.align = attrs.align || 'left';
            $scope.labelFloat = $scope.align;
            $scope.before = attrs.before;
            
            if(attrs.flash)
                $scope.flash = JSON.parse(attrs.flash);
            if(attrs.fade)
                $scope.fade = JSON.parse(attrs.fade);           
            
            updateStyles();
            
            //Watchers
            $scope.$watch('color', function(newValue)
            {
                updateStyles();
            });
            $scope.$watch('percent', function(newValue)
            {
                //animate color if there is one
                if(attrs.flash)
                    flash(newValue);
                else if(attrs.fade)
                    fade(newValue);
                
                //adjust label if needed
                var width = measureText($scope.before + $scope.value, element.css('font'));        
                $scope.labelFloat = (element.width() * newValue / 100 < width) ? reverseAlign($scope.align) : attrs.align;
                
                updateStyles();
            });
            
            var flash = function(perc)
            {
                var flashArray = $scope.flash;
                var curIndex = -1;
                
                //find current Index
                for(var i = 0; i < flashArray.length; i++)
                {
                    var colorBreakPoint = flashArray[i][0];                    
                    if(perc > colorBreakPoint)                    
                        curIndex = i;
                }
                
                //flash or change color according to the number of 
                //colors in the array
                var timeouts = [];
                if(curIndex != -1)
                {
                    if(flashArray[curIndex].length == 2)
                    {
                        $scope.color = flashArray[curIndex][1];

                        //stop all tiemrs
                        for(var timeoutIndex in timeouts)                    
                            $timeout.cancel(timeouts[timeoutIndex]);
                    }
                    else
                    {
                        //alternate colors                        
                        var flashCount = flashArray[curIndex].length - 1;
                        var waitTime = Math.floor(1000 / flashCount);

                        $scope.color = flashArray[curIndex][1];
                        for(var j = 1; j < flashCount; j++)
                        {
                            //set timers to change the color
                            (function(curColor)
                            {
                                timeouts.push($timeout(function() 
                                {$scope.color = curColor; }, j * waitTime));
                            })(flashArray[curIndex][j+1]);
                        }                    
                    }
                }
                
            };
            
            var fade = function(perc)
            {
                var values = [];
                var colors = [];
                for(var i = 0; i < $scope.fade.length; i++)
                {
                    values.push($scope.fade[i][0]);
                    colors.push($scope.fade[i][1]);
                }                            
                        
                var colorScale = d3.scale.linear()
                    .domain(values)
                    .range(colors);
                        
                $scope.color = colorScale(perc);
            };
        }
    };
});



pauseMenu.controller('ScoreCardController', function($scope, $repo, Session, toArray, range)
{
    $repo.getLastData(function(data)
    {
        $scope.gData = data;
        $scope.gData.starRange = range($scope.gData.Stars);
                
        
        var quesData = [data.Incorrect, data.Timeout, data.Correct];
        var gradeData = [data.Grade];
        
        //Create grade chart
        var gradeWidth = $('#grade').width(),
            gradeHeight = $('#grade').height(),
            outerRadius = Math.min(gradeWidth, gradeHeight) * .5 - 10,
            innerRadius = outerRadius * .6;
    
        var color = d3.scale.linear()
            .domain([0, 25, 50, 75])
            .range(['#d62728','#ff7f0e', '#2ca02c', '#1f77b4']);

        var arc = d3.svg.arc()
            .startAngle(0)
            .endAngle(function(d) { return (d/100) * 2 * Math.PI; })
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);

        var svg = d3.select("#grade").append("svg")
            .attr("width", gradeWidth)
            .attr("height", gradeHeight);
    
        var gradeChart = svg.selectAll('path')            
            .data(gradeData)
            .enter().append("g")
                .attr("class", "arc")
                .attr("transform", "translate(" + gradeWidth / 2 + "," + gradeHeight / 2 + ")");
        
        gradeChart.append('path')
            .transition()
            .ease('elastic')
                .duration(5000)
                .attrTween("d", function(d) 
                {
                    var i = d3.interpolateNumber(0, d);
                    return function(t) { d = i(t); return arc(d); };
                })
                .attrTween("fill", function(d) 
                {
                    var i = d3.interpolateNumber(0, d);
                    return function(t) { d = i(t); return color(d); };
                });
        
        gradeChart.append('text')
                .text('0%')
                .style('font-size', '2em')
                .attr('y', function() { return $(this).height()/3;  })  
            .transition()
            .ease('elastic')
                .duration(5000)
                .tween('text', function(d)
                {
                    var i = d3.interpolateRound(0, d);     
                    var txt = d3.select(this);
                    return function(t)
                    { 
                        var text = i(t) + '%'; 
                        this.textContent = text;
                        txt.attr('x', -$(this).width()/2);
                    };
                });
                
        //Create question type graphs
        var barColors = ['#d62728', '#000', '#2ca02c'];
        
        var quesStatWidth = $('#question-stats').width(),
            quesStatHeight = $('#question-stats').height();
    
        var widthScale = d3.scale.linear()
            .domain([0, d3.sum(quesData)])
            .range([0, quesStatWidth]);             
             
        svg = d3.select('#question-stats').append('svg')
            .attr('width', quesStatWidth)
            .attr('height', quesStatHeight);
        
        var quesBar = svg.selectAll('rect')
            .data(quesData)
            .enter().append('g');
        
        quesBar.append('rect')
                .attr('x', function(d,i)
                {
                    var pos = 0;
                    for(var j=0; j<=i;j++)
                        pos += widthScale((j-1<0) ? 0 : quesData[j-1]);
                    return pos + widthScale(d)/2;
                })
                .attr('width', 0)
                .attr('height', quesStatHeight)
                .attr('fill', function(d, i) { return barColors[i]; })
            .transition().duration(3200)
            .ease('bounce')
                .attr('x', function(d,i)
                {
                    var pos = 0;
                    for(var j=0; j<=i;j++)
                        pos += widthScale((j-1<0) ? 0 : quesData[j-1]);
                    return pos;
                })
                .attr('width', function(d) { return widthScale(d); });
        
        quesBar.append('text')                
                .text('00')
                .attr('fill', 'white')
                .attr('x', function(d,i)
                {
                    var pos = 0;
                    for(var j=0; j<=i;j++)
                        pos += widthScale((j-1<0) ? 0 : quesData[j-1]);
                    return pos + widthScale(d)/2 - $(this).width()/2;
                })
                .attr('y', function() { return quesStatHeight/2 + $(this).height()/3; })
            .transition()
            .duration(3200)
                .tween('text', function(d)
                {
                    var i = d3.interpolateRound(0, d);    
                    return function(t) 
                    { 
                        var text = (i(t) == 0) ? '' : i(t);
                        this.textContent = text; 
                    };
                });
        
    });
    
    if(Session.isLoggedin())
    {
        $repo.getTopFive(function(data)
        {
            $scope.topScores = toArray(data);
            //console.log($scope.topScores);
        });
    }
    
    $repo.getLastQuestionAnswer(function(data)
    {
        $scope.questions = toArray(data);
    });
    
});
pauseMenu.directive('tweenNum', function($timeout, $filter) 
{
    return{
        restrict: 'A',
        replace: false,
        scope: { 'tween-num': '@' },
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        link: function($scope, element, attrs)
        {
            var value, speed, duration, increment, decimals;
            var curVal = 0;
            
            var calculate = function () 
            {
                duration = parseInt(attrs.duration) || 2200;//2.2 secs
                speed =  parseInt(attrs.speed) || 100;// 0.1 sec intervals
                
                decimals = parseInt(attrs.decimals) || 0;
                value = parseFloat(attrs.tweenNum) || 0;

                var steps = Math.ceil(duration / speed);
                increment = (value / steps);
                //console.log('start: ' + value + ', decimal: ' + decimals);
            };
            
            var tick = function()
            {
                curVal += increment;
                if(curVal < value)
                    $timeout(tick, speed);                
                else
                    curVal = value;
                
                
                var numberFilter = $filter('number');
                element[0].textContent = numberFilter(curVal, decimals);
            };
            
            attrs.$observe('tweenNum', function (val) 
            {
                if(val)
                {
                    calculate();
                    tick();
                }
            });
        }
    };
});

pauseMenu.controller('LoginController', function($scope, $timeout, pauseManager, gameManager, Session)
{
    $scope.userName = '';
    $scope.password = '';
    $scope.Mess = '';
    
    $scope.attemptLogin = function()
    {        
        Session.login($scope.userName, $scope.password,
            function()
            {
                if(Session.isLoggedin())
                {            
                    $scope.enable();
                    $scope.userName = '';
                    $scope.password = '';
                    if(gameManager.hasEnded() && !gameManager.isSaved())
                    {
                        gameManager.saveGame(function()
                        {
                            pauseManager.showScoreCard();                            
                        });
                    }
                    else
                    {
                        pauseManager.showPauseMenu();//for testing
                    }
                }
                else
                {
                    $scope.Mess = 'Invalid username or password';
                    $timeout(function() { $scope.Mess = ''; }, 10000);
                    
                }
            });
        
    };
//    $scope.attemptLogin();//for testing
});
pauseMenu.controller('RegisterController', function($scope, $timeout, $repo, pauseManager)
{
    $scope.user = {
        name: '',
        pass:'',
        confirmPass: ''
    };
    
    $scope.register = function()
    {
        $repo.register($scope.user, 
        function(data)
        {
            $scope.mess = data;
            console.log(data);
            
            $timeout(function()
            {
                if(data.Type == 'success')
                    pauseManager.showLogin();
                
            }, 1000);
        });
    };
});
pauseMenu.controller('ForgotController', function($scope, $repo)
{
    $scope.name = '';
    
    $scope.sendEmail = function()
    {
        $repo.recoverPass({ name: $scope.name },
        function(data)
        {
            $scope.mess = data;
        });
    };
});


pauseMenu.controller('PauseMenuController', function($scope, gameManager, pauseManager, Session)
{
    $scope.resumeGame = function()
    {
        gameManager.resume();
        pauseManager.hide();
    };
    
    $scope.quitGame = function()
    {
        gameManager.end();
        pauseManager.hide();  
    };    
    
    $scope.logout = function()
    {
        Session.logout(function(data)
        {
            console.log(data);
            pauseManager.showLogin();
        });
    };
});

pauseMenu.value('profileData', {});
pauseMenu.controller('ProfileController', function($scope, $timeout, $repo, pauseManager, Session, profileData, range, toArray, d3)
{
    $scope.stats = [];
    $scope.achieves = [];
    $scope.games = [];
    $scope.gameTypes = [];
    
    //decide if your view another user's profile or your own
    var curUserId = (profileData.user) ? profileData.user.User_Id : Session.User.Id;
    
    //get user data from DB
    $repo.getUserData({ userId: curUserId },
    function(data) 
    {
        delete data.Email;
        $scope.user = data;
        
        //display the right amount and color of star
        $scope.stars = range($scope.user.Stars);
    
        profileData.user = null;
        $scope.user.CreatedOn = new Date($scope.user.CreatedOn.replace(' ', 'T'));
    });
    
    //create graph
    $repo.getUserTypeStats({ userId: curUserId },
    function(data)
    {
        //make sure data is an array
        for(var i = 0; i < data.length; i++)
            data[i].Data = toArray(data[i].Data);
        
        $scope.chartData = data;
        $scope.dataIndex = 2;
        
        var isAnimating = false;
        
        //init vars
        var width = d3.select('#partition').node().getBoundingClientRect().width,
            height = d3.select('#partition').node().getBoundingClientRect().height,
            outerRadius = Math.min(width, height) * 0.5 - 10,
            innerRadius = outerRadius * 0.6;
        
        var color = d3.scale.category10();
        var arcColors = [
            ['#1f77b4', '#ff7f0e', ' #9467bd'],
            ['#31a354', '#756bb1', '#636363'],
            ['#2ca02c', '#d62728', '#222']
        ];
                    
        var arc = d3.svg.arc();
            
        var pie = d3.layout.pie()
            .value(function(d) { return d.Count; })
            .sort(null);
        
        var tooltip = d3.select("#partition").append("div")   
            .attr("class", "tooltip")               
            .style("opacity", 0);
        
        //create the basic graph
        var svg = d3.select("#partition").append("svg")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function()
                {
                    $timeout.cancel(profileData.chartTimer);
                })
            .on("mouseout", function()
                {
                    profileData.chartTimer = $timeout(transition, 10000);
                });
        
        var g = svg.selectAll(".profile-arc")
            .data(arcs(data[$scope.dataIndex].Data, data[($scope.dataIndex + 1) % data.length].Data))            
          .enter().append("g")
            .attr("class", "profile-arc")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .attr("fill", function(d, i) { return arcColors[($scope.dataIndex + 1) % data.length][i] || color(i); })
            .on("mouseover", function(d) 
                {
                    d3.selectAll(".profile-arc")
                        .style("opacity", 0.3);
                    
                    d3.selectAll(".profile-arc:hover")
                        .style("opacity", 1);
                    
                    tooltip.html(d.data.Name + ': ' + d.data.Count)
                        .style("opacity", 0.9);
                })
            .on("mousemove", function() 
                {
                    var rec = d3.select("#partition").node().getBoundingClientRect();
                    tooltip.style("left", (d3.event.pageX - rec.left - 8) + "px")     
                        .style("top", (d3.event.pageY - rec.top + 23) + "px"); 
                })
            .on("mouseout", function() 
                {
                    d3.selectAll(".profile-arc")
                        .style("opacity", 1);
                    
                    tooltip.html('')
                        .style("opacity", 0.0);
                });
    
        g.append("path")
            .attr("d", arc);
                
        g.append("text")
            .attr("fill", "white")
            .style("text-anchor", "middle")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .text(function(d) 
            { 
                var nextData = data[($scope.dataIndex + 1) % data.length].Data;
                var total = d3.sum(nextData, function(da) { return da.Count; });
                return Math.floor(d.data.Count / total * 100) + '%'; 
            });
                
        //start transition
        transition();

        function arcs(data0, data1) 
        {
            var arcs0 = null,
                arcs1 = null,
                i = -1,
                arc;
                
            var nullData = { Name: '', Count:0 },
                tempData0 = [],
                tempData1 = [];
           
            while (++i < Math.max(data0.length, data1.length)) 
            {
                tempData0.push(data0[i] || nullData);
                tempData1.push(data1[i] || nullData);
            }
            i = -1;
            
            arcs0 = pie(tempData0);
            arcs1 = pie(tempData1);
            while (++i < tempData0.length) 
            {
                arc = arcs0[i];
                arc.innerRadius = innerRadius;
                arc.outerRadius = outerRadius;
                arc.next = arcs1[i];
            }
            
            return arcs0;
        }

        function transition() 
        {
            if(isAnimating)
                return;
            isAnimating = true;
            
            var nextIndex = ($scope.dataIndex + 1) % data.length;
            var path = d3.selectAll(".profile-arc > path")
                .data(arcs(data[$scope.dataIndex].Data, data[nextIndex].Data));
            d3.selectAll(".profile-arc")
                .data(arcs(data[$scope.dataIndex].Data, data[nextIndex].Data));
            d3.selectAll(".profile-arc > text").text('');

            // Wedges split into two rings.
            var t0 = path.transition()
                .duration(700)
                .attr("fill", function(d, i) { return arcColors[nextIndex][i] || color(i); })
                .attrTween("d", tweenArc(function(d, i) 
                {
                    return {
                      innerRadius: i & 1 ? innerRadius : (innerRadius + outerRadius) / 2,
                      outerRadius: i & 1 ? (innerRadius + outerRadius) / 2 : outerRadius
                    };
                }));

            // Wedges translate to be centered on their final position.
            var t1 = t0.transition()
                .attrTween("d", tweenArc(function(d, i) 
                {
                    var a0 = d.next.startAngle + d.next.endAngle,
                        a1 = d.startAngle - d.endAngle;
                    return {
                      startAngle: (a0 + a1) / 2,
                      endAngle: (a0 - a1) / 2
                    };
                }));

            // Wedges then update their values, changing size.
            var t2 = t1.transition()
                .attrTween("d", tweenArc(function(d, i) 
                {
                    return {
                      startAngle: d.next.startAngle,
                      endAngle: d.next.endAngle
                    };
                }));

            // Wedges reunite into a single ring.
            var t3 = t2.transition()
                .attrTween("d", tweenArc(function(d, i) 
                {
                    return {
                        innerRadius: innerRadius,
                        outerRadius: outerRadius
                    };
                }));
                        
            $timeout(function()
            {
                //the transition has finished, switch the data to next graph
                var nextData = data[($scope.dataIndex + 2) % data.length].Data;
                var newArcs = arcs(data[nextIndex].Data, nextData);
                var total = d3.sum(data[nextIndex].Data, function(da) { return da.Count; });
                
                d3.selectAll(".profile-arc")
                    .data(newArcs);
                d3.selectAll(".profile-arc > path")
                    .data(newArcs);
                d3.selectAll(".profile-arc > text")
                    .data(newArcs)
                    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                    .text(function(d) 
                    {
                        return Math.floor(d.data.Count / total * 100) + '%'; 
                    });
                    
                isAnimating = false;
            }, 2800);
            
            $scope.dataIndex = nextIndex;
            profileData.chartTimer = $timeout(transition, 15000);
        }

        function tweenArc(b) 
        {
            return function(a, i) 
            {
                var d = b.call(this, a, i), i = d3.interpolate(a, d);
                for (var k in d) a[k] = d[k]; // update data
                return function(t) { return arc(i(t)); };
            };
        }
        
        $scope.nextChart = function()
        {
            $timeout.cancel(profileData.chartTimer);
            transition();
            $timeout.cancel(profileData.chartTimer);
        };
    });
    
    //get recent games
    $repo.getUserHistory({ userId: curUserId }, 
    function(data)
    {
        $scope.games = toArray(data);
    });
    
    //get gametype data
    $repo.getGameTypeData({ userId: curUserId }, 
    function(data)
    {
        $scope.gameTypes = toArray(data);
    });
    
    //click events
    $scope.showStats = function()
    {
        profileData.user = $scope.user;
        pauseManager.showUserStats();
    };
});
pauseMenu.controller('UserStatsController', function($scope, pauseManager, profileData, $sce)
{
    $scope.user = profileData.user;
    profileData.user = null;
    $scope.trust = $sce.trustAsHtml;
    
    var imgSrc = $scope.user.Avatar;
    $scope.user.Avatar = '<img src="' + imgSrc + '" />';    
    
    $scope.backToProfile = function()
    {
        $scope.user.Avatar = imgSrc;
        profileData.user = $scope.user;
        pauseManager.showProfile();
    };
});

pauseMenu.controller('ShopController', function($scope, $repo, Session, toArray)
{
    $scope.avatars = [];
    $scope.showPreview = false;
    $scope.previewItem = {
        img: '',
        Name: '',
        Price: 0,
        Descrip: null
    };
    $scope.itemSectionData = [];
    $scope.quantity = 1;
    $scope.curEnergy = 0;
    
    $repo.getUserData({ userId: Session.User.Id },
        function(data) 
        {
            $scope.curEnergy = data.Energy;
            $scope.curAvatar = data.Avatar_Id;
        });
    
    $repo.getItems({}, 
        function(data)
        {
            var items = toArray(data);            
            var itemSectionIndex = -1;
            //Format data to be displayed
            for(var i in items)
            {
                if($scope.itemSectionData[itemSectionIndex] == null ||
                    $scope.itemSectionData[itemSectionIndex].title != items[i].ItemType_Name)                
                {
                    $scope.itemSectionData.push({
                        title: items[i].ItemType_Name,
                        data: []
                    });
                    itemSectionIndex++;
                }
                items[i].isMax = items[i].Count >= items[i].MaxCount;
                $scope.itemSectionData[itemSectionIndex].data.push(items[i]);                
            }
        });
    
    $scope.preview = function(inItem)
    {
        if(inItem == null)
        {
            $scope.showPreview = $scope.previewItem.isActive = false;
            return;
        }
        
        $scope.previewItem = inItem;
        
        //Switch active item
        $scope.showPreview = inItem.isActive = !inItem.isActive;
        $scope.itemSectionData.forEach(function(section)
        {
            section.data.forEach(function(item)
            {
                if(inItem != item)
                    item.isActive = false;                
            });
        });
        
        $scope.quantity = 1;
    };
    
    $scope.buy = function(item)
    {
        //if you cant hold any more of this item
        if(item.isMax)
        {            
            switch(item.MaxType)
            {
                case 'equip':
                    //tell DB to change avatar to this item
                    $repo.equipItem({ itemId: item.Item_Id });
                    break;
                case 'max':
                    //do nothing..
                    break;
            }
        }
        else
        {
            //check if you have the funds
            if($scope.curEnergy >= item.Price * $scope.quantity)
            {
                //buy the item    
                $repo.buyItem({ itemId: item.Item_Id, quantity: $scope.quantity });
                
                //update the display
                $scope.curEnergy -= item.Price * $scope.quantity;  
                item.Count = parseInt(item.Count) + $scope.quantity;        
                item.isMax = item.Count >= item.MaxCount;
            }
            else
            {
                alert('Insufficient funds');
            }        
        }
    };
    
});

pauseMenu.controller('FriendController', function($scope, $repo, profileData, pauseManager, toArray, range)
{
    $scope.friendSearch = '';
    $scope.isSearching = false;
    
    $scope.friends = [];
    $scope.receivedRequests = [];
    $scope.sentRequests = [];

    $scope.searchUser = function()
    {
        
        $scope.isSearching = $scope.friendSearch != '';
        if(!$scope.isSearching)
        {
            //get user's friends
            $repo.getFriend(function(data)
            {
                //Make sure the data is an array
                $scope.friends = toArray(data); 
                
                $scope.friends.forEach(function(friend)
                {
                    friend.starRange = range(friend.Stars);
                });
            });
            
            //get pending requets
            $repo.getReceivedRequest(function(data)
            {
                //Make sure the data is an array
                $scope.receivedRequests = toArray(data);
            });
            
            $repo.getSentRequest(function(data)
            {
                //Make sure the data is an array
                $scope.sentRequests = toArray(data);
            });         
        }        
        else
        {
            //hide pending requests
            $scope.receivedRequests = [];
            $scope.sentRequests = [];
            
            //get search results
            $repo.searchUser({ userName: $scope.friendSearch },
            function(data)
            {
                //Make sure the data is an array
                $scope.friends = toArray(data);
            });
        }
        
    };
    $scope.searchUser();    
      
    $scope.deleteFriend = function(friend)
    {
        $repo.deleteFriend({friendId: friend.User_Id},
        function() { $scope.searchUser(); });
    };
    
    $scope.sendRequest = function(friend)
    {
        $repo.sendFriendRequest({userTo: friend.User_Id},
        function()
        {
            $scope.friendSearch = '';
            $scope.searchUser();
        });
    };
    $scope.acceptRequest = function(friend)
    {
        $repo.acceptRequest({userFrom: friend.User_Id},
        function(data) { $scope.searchUser(); console.log(data); });
    };
    $scope.declineRequest = function(friend)
    {
        $repo.declineRequest({userFrom: friend.User_Id},
        function() { $scope.searchUser(); });
    };
    $scope.deleteRequest = function(friend)
    {
        $repo.deleteRequest({userTo: friend.User_Id},
        function() { $scope.searchUser(); });
    };
    
    $scope.showProfile = function(friend)
    {
        profileData.user = friend;
        pauseManager.showProfile();
    };
    
    $scope.selectFriend = function(inFriend)
    {
        $scope.friends.forEach(function(friend)
        {
            friend.isActive = false;
        });
        $scope.receivedRequests.forEach(function(friend)
        {
            friend.isActive = false;
        });
        $scope.sentRequests.forEach(function(friend)
        {
            friend.isActive = false;
        });
        
        if(inFriend)
            inFriend.isActive = true;
    };
    
});
pauseMenu.directive('friendCard', function()
{
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: 'html/directive/friend-card.html'
    };
});

pauseMenu.controller('HistoryController', function($scope, $filter, $repo, Session, toArray, range)
{
    //fill the page
    $repo.getUserHistory({ userId: Session.User.Id }, 
    function(data)
    {
        $scope.games = toArray(data);

        //Create Graph
        $repo.getQuestionAnswer(function(data)
        {
            data = toArray(data);
            
            //Display Graph
            var parseDate = d3.time.format('%Y-%m-%d %H:%M:%S').parse;
            for(var i in $scope.games)
            {
                var chartData = [];
                $scope.games[i].starRange = range($scope.games[i].Stars);
                var game = $scope.games[i];
                
                //find every QA that belongs to the game
                for(var j in data)
                {
                    if(game.Game_Id == data[j].Game_Id)
                    {                        
                        //fill chartData with only the data I need, format data
                        chartData.push({
                            date: parseDate(data[j].Question_DateTime), 
                            score: (+data[j].Score * +data[j].Multiplier)
                        });
                    }
                }

                //Create the Line Chart
                var width = $('.game-stats-' + game.Game_Id).outerWidth(true),
                    height = $('.game-stats-' + game.Game_Id).outerHeight(true);

                var xScale = d3.time.scale()
                    .domain(d3.extent(chartData, function(d) { return d.date; }))
                    .range([0, width]);

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(chartData, function(d) { return d.score; })])
                    .range([height - 10, 10]);

                var line = d3.svg.line()
                    .x(function(d) { return xScale(d.date); })
                    .y(function(d) { return yScale(d.score); });

                var area = d3.svg.area()
                    .x(function(d) { return xScale(d.date); })
                    .y0(height)
                    .y1(function(d) { return yScale(d.score); });
                
                var svg = d3.select('.game-chart-' + game.Game_Id)
                    .append('svg')
                        .attr('class', 'game-chart-svg')
                    .datum(chartData);

                svg.append('path')
                    .attr('class', 'line')
                    .style('fill', 'none')
                    .style('stroke', 'steelblue')
                    .style('stroke-width', '1.5px')
                    .style('stroke-opacity', 0.4)
                    .attr('d', line);

                svg.append('path')
                    .attr('class', 'area')
                    .style('fill', 'steelblue')
                    .style('fill-opacity', 0.4)
                    .attr('d', area);
                
                game.Stars = $filter('number')(game.Stars / 2, 0);
                game.isOpen = false;
                
                game.StartTime = new Date(game.StartTime.replace(' ', 'T'));            
                var dateFiler = (new Date().getDate() == game.StartTime.getDate()) ?  'h:mm a' : 'MMM d, yyyy';
                game.StartTime = $filter('date')(game.StartTime, dateFiler);
            }
        });
    });
        
    $scope.expand = function(inGame)
    {
        inGame.isOpen = !inGame.isOpen;
        $scope.games.forEach(function(game)
        {
            if(inGame != game)
                game.isOpen = false;
        });
    };
    
});

pauseMenu.controller('SettingsController', function($scope, $timeout, $repo, Session)
{
    $scope.temp = {
        UserName: Session.User.UserName,
        Email: Session.User.Email,
        Age: parseInt(Session.User.Age)
    };
    $scope.pass = {
        cur: '',
        new: '',
        confirmNew: ''
    };
    $scope.userResult = {
        Mess: '',
        MessType: ''
    };
    $scope.passResult = {
        Mess: '',
        MessType: ''
    };
    
    $scope.updateUser = function()
    {
        
        $repo.updateUser({ 
            userName: $scope.temp.UserName,
            email: $scope.temp.Email,
            age: $scope.temp.Age }, 
        function(data)
        {
            $scope.userResult = data;
            $timeout(function() { $scope.userResult.Mess = ''; }, 10000);           
        });
        
    };
    
    $scope.updatePass = function()
    {
        $repo.updatePass({ 
            curPass: $scope.pass.cur,
            newPass: $scope.pass.new,
            confirmPass: $scope.pass.confirmNew },
        function(data)
        {
            $scope.passResult = data;
            $scope.pass.cur = '';
            $scope.pass.new = '';
            $scope.pass.confirmNew = '';
            $timeout(function() { $scope.passResult.Mess = ''; }, 10000);   
        });
    };
});