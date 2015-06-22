//Created on : Mar 17, 2015, 7:00 AM
//Author     : David Chung

//---Users---
var UserData = function()
{
    this.Id = -1;
    this.UserName = "";
    this.LastLogin = new Date().toISOString();
};

//---Game---
var GameData = function()
{
    this.Questions = [];
};

//---Question---
var QuestionData = function()
{
    this.Answer = null;
    this.Nums = [];
    this.QuestionType = '';
    this.NumAnswersDisplayed = 9;
    this.DateTimeCreated = new Date().toISOString();
};

//---Answer---
var AnswerData = function()
{
    this.TimeToAnswer = 60;
    this.Score = 0;
    this.Multiplier = 1;
    this.Number = 0;
    this.AnswerType = '';
    this.PowerUp = '';//TODO:
};