var Alexa = require('alexa-sdk');
var APP_ID = undefined;
var GAME_STATES = {
    TRIVIA: "_TRIVIAMODE", // Asking trivia questions.
    START: "_STARTMODE", // Entry point, start the game.
    HELP: "_HELPMODE" // The user is asking for help.
};

exports.handler = function(event, context, callback){
  var alexa_one = Alexa.handler(event, context);
  alexa_one.registerHandlers(newSessionHandlers, helloHandler);
  alexa_one.appId = APP_ID;
  alexa_one.execute();
};

var newSessionHandlers = {

  "LaunchRequest": function () {
    this.emit(':ask', 'Welcome to Quiz bot! Say start when you\'re ready.');
  },
  "AMAZON.StartOverIntent": function() {

    this.emit(':tell', 'Alright! Let\'s get started!');
  },
  "AMAZON.HelpIntent": function() {
      this.emit(':ask', 'To begin the quiz, say start.');
  },
  "Unhandled": function () {
      this.emit(':ask', 'Sorry, I didn\'t catch that, say start to begin.');
  }
};

var helloHandler = Alexa.CreateStateHandler(states.GUESSMODE, {
  "HelloIntent": function() {
    this.emit(':tell', 'This is the hello handler');
  }
};

 // 'Question 1. If 2x = 6, what is the value of x?'
