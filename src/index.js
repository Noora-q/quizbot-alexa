var Alexa = require('alexa-sdk');
var APP_ID = undefined;
var states = {
    QUIZ: "_QUIZMODE", // Asking quiz questions.
    START: "_STARTMODE", // Entry point, start the game.
};

var HELP_MESSAGE = 'I will give some algebraic equations and your task is to find the values of x. To begin the quiz, say start.';

exports.handler = function(event, context, callback){
  var alexa_one = Alexa.handler(event, context);
  alexa_one.registerHandlers(newSessionHandlers, quizModeHandlers);
  alexa_one.appId = APP_ID;
  alexa_one.execute();
};

var newSessionHandlers = {

  "LaunchRequest": function () {
    // this.handler.state = states.START;
    this.emit(':ask', 'Welcome to Quiz bot! Say start when you\'re ready.');
  },
  "AMAZON.StartOverIntent": function() {
    this.handler.state = states.QUIZ;
    this.emitWithState('NewSession');
  },
  "AMAZON.HelpIntent": function() {
    this.emit(':ask', HELP_MESSAGE);
  },
  "Unhandled": function () {
    this.emit(':ask', 'Sorry, I didn\'t catch that, say start to begin.');
  }
};

var quizModeHandlers = Alexa.CreateStateHandler(states.QUIZ, {

  "NewSession": function () {
    this.emit(':ask', 'Alright then. Let\'s begin. I will give an algebraic equation and your task is to find the value of x. Ready?'); // Equivalent to the Start Mode NewSession handler
  },
  "AMAZON.YesIntent": function () {
    this.emit(':ask', 'Question one. If 2x = 6, what is the value of x?');
  },
  "AMAZON.NoIntent": function () {
    this.emit(':ask', 'Say help if you need assistance, or stop to exit the quiz.');
  },
  "AnswerIntent": function() {
    var guessAnswer = parseInt(this.event.request.intent.slots.Answer.value);
    var correctAnswer = 'Answer';
    
    if (guessAnswer === correctAnswer) {
      this.emit(':tell', "That is correct.");
    } else {
      this.emit(':tell', "Wrong answer. The correct is 3.");
    }
  },
  "Unhandled": function () {
    this.emit(':ask', 'Sorry, I didn\'t catch that, say help if you need assistance.');
  }

});
