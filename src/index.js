var Alexa = require('alexa-sdk');
var APP_ID = undefined;
var states = {
    TRIVIA: "_TRIVIAMODE", // Asking trivia questions.
    START: "_STARTMODE", // Entry point, start the game.
    HELP: "_HELPMODE" // The user is asking for help.
};

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
    this.handler.state = states.TRIVIA;
    this.emitWithState('NewSession');
  },
  "AMAZON.HelpIntent": function() {
    this.emit(':ask', 'To begin the quiz, say start.');
  },
  "Unhandled": function () {
    this.emit(':ask', 'Sorry, I didn\'t catch that, say start to begin.');
  }
};

var triviaModeHandlers = Alexa.CreateStateHandler(states.TRIVIA, {

  'NewSession': function () {
    this.emit(':ask', 'Alright then. Let\'s begin. I will give an algebraic equation and your task is to find the value of x. Ready?'); // Equivalent to the Start Mode NewSession handler
  },
  "Unhandled": function () {
    this.emit(':ask', 'Sorry, I didn\'t catch that, say help if you need assistance.');
  }
});

 // 'Question 1. If 2x = 6, what is the value of x?'
