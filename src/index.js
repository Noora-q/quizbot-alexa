var Alexa = require('alexa-sdk');
var APP_ID = undefined;
var QUESTION_TOTAL = 5;
var GOLD_MEDAL = QUESTION_TOTAL;
var SILVER_MEDAL = 4;
var BRONZE_MEDAL = 3;
var questionNumber;
var states = {
  TRIVIA: "_TRIVIAMODE", // Asking trivia questions.
  START: "_STARTMODE", // Entry point, start the game.
  HELP: "_HELPMODE" // The user is asking for help.
};
var questions = require('./questions')
var currentQuestion;
var score;

function getQuestion() {
  var keys = Object.keys(questions);
  var rnd = Math.floor(Math.random() * keys.length);
  var key = keys[rnd];
  return key;
}

function getMedal(score) {
  if (score === GOLD_MEDAL) {
    return 'Gold'
  } else if (score >= SILVER_MEDAL) {
    return 'Silver'
  } else if (score >= BRONZE_MEDAL) {
    return 'Bronze'
  }
}

exports.handler = function(event, context, callback){
  var alexa_one = Alexa.handler(event, context);
  this.handler.state = states.MENU
  alexa_one.registerHandlers(newSessionHandlers, triviaModeHandlers);
  alexa_one.appId = APP_ID;
  alexa_one.execute();
};


var newSessionHandlers = {

  "LaunchRequest": function () {
    this.emit(':ask', 'Welcome to Quiz bot! Say start when you\'re ready.');
  },
  "AMAZON.StartOverIntent": function() {
    questionNumber = 1;
    score = 0;
    this.handler.state = states.TRIVIA;
    this.emitWithState('QuestionIntent', "Alright then. Let\'s begin. I will give an algebraic equation and your task is to find the value of x.");
  },
  "AMAZON.HelpIntent": function() {
    this.emit(':ask', 'To begin the quiz, say start.');
  },
  "MenuIntent": function(message) {
    this.emit(':ask', message + ' say start to begin a new game.')
  },
  "Unhandled": function() {
    this.emit(':ask', 'Sorry, I didn\'t catch that, say start to begin.');
  }
};


var triviaModeHandlers = Alexa.CreateStateHandler(states.TRIVIA, {

  "QuestionIntent": function(lastQuestionResult) {
    currentQuestion = getQuestion();
    this.emit(':ask', lastQuestionResult + ' Question ' + questionNumber + '. ' + currentQuestion);
    questionNumber++;
  },

  "AnswerIntent": function() {

    var guessAnswer = this.event.request.intent.slots.Answer.value;
    var correctAnswer = questions[currentQuestion][0];

    if (guessAnswer === correctAnswer) {
      score++;
      // TODO Fix this.
      if (questionNumber > QUESTION_TOTAL) {
        this.handler.state = "";
        this.emitWithState('MenuIntent', 'Correct! You have scored ' + score + ' out of ' + QUESTION_TOTAL);
      } else {
        this.emitWithState('QuestionIntent', 'Correct!');
      }

    } else {
      if (questionNumber > QUESTION_TOTAL) {
        this.handler.state = "";
        this.emitWithState('MenuIntent', 'Incorrect! You have scored ' + score + ' out of ' + QUESTION_TOTAL);
      } else {
        this.emitWithState('QuestionIntent', 'Incorrect!');
      }
    }
  },

  "AMAZON.StopIntent": function() {
    this.handler.state = "";
    this.emitWithState('MenuIntent', "");
  },

  "Unhandled": function() {
    this.emit(':ask', 'Sorry, I didn\'t catch that, say help if you need assistance.');
  }

});
