var Alexa = require('alexa-sdk');
var APP_ID = undefined;
var QUESTION_TOTAL = 5
var questionNumber
var states = {
  TRIVIA: "_TRIVIAMODE", // Asking trivia questions.
  START: "_STARTMODE", // Entry point, start the game.
  HELP: "_HELPMODE" // The user is asking for help.
};
var questions = {"If 2x = 6, what is the value of x?": ['3', '6', '2.5', '12'], 'If 10x = 10, what is the value of x?': ['1', '10', '100', '1000']}

exports.handler = function(event, context, callback){
  var alexa_one = Alexa.handler(event, context);
  alexa_one.registerHandlers(newSessionHandlers, triviaModeHandlers);
  alexa_one.appId = APP_ID;
  alexa_one.execute();
};

var newSessionHandlers = {

  "LaunchRequest": function () {
    this.emit(':ask', 'Welcome to Quiz bot! Say start when you\'re ready.');
  },
  "AMAZON.StartOverIntent": function() {
    questionNumber = 1
    this.handler.state = states.TRIVIA;
    this.emitWithState('QuestionIntent', "Alright then. Let\'s begin. I will give an algebraic equation and your task is to find the value of x.");
  },
  "AMAZON.HelpIntent": function() {
    this.emit(':ask', 'To begin the quiz, say start.');
  },
  "Unhandled": function() {
    this.emit(':ask', 'Sorry, I didn\'t catch that, say start to begin.');
  }
};
var currentQuestion
var score = 0
function getQuestion() {
  var keys = Object.keys(questions);
  var rnd = Math.floor(Math.random() * keys.length);
  var key = keys[rnd];
  return key;
}

var triviaModeHandlers = Alexa.CreateStateHandler(states.TRIVIA, {

  "QuestionIntent": function(lastQuestionResult) {
    currentQuestion = getQuestion();
    this.emit(':ask', lastQuestionResult + 'Question ' + questionNumber + '. ' + currentQuestion);
    questionNumber++;
  },

  "AnswerIntent": function() {
    var guessAnswer = this.event.request.intent.slots.Answer.value;
    var correctAnswer = questions[currentQuestion][0];
    if (guessAnswer === correctAnswer) {
      score++;
      if (questionNumber === QUESTION_TOTAL + 1) {
        this.handler.state = "";
        this.emit(':ask', 'Correct! You have scored ' + score + ' out of ' + QUESTION_TOTAL);
      } else {
        this.emitWithState('QuestionIntent', 'Correct!');
      };

    } else {
      this.emitWithState('QuestionIntent', 'Incorrect!');
    }
  },

  "AMAZON.StopIntent": function() {
    this.handler.state = "";
    this.emitWithState('LaunchRequest')
  },

  "Unhandled": function() {
    this.emit(':ask', 'Sorry, I didn\'t catch that, say help if you need assistance.');
  }

});
