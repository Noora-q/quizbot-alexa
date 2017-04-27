var Alexa = require('alexa-sdk');
var APP_ID = undefined;
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
    this.handler.state = states.TRIVIA;
    this.emitWithState('QuestionIntent');
  },
  "AMAZON.HelpIntent": function() {
    this.emit(':ask', 'To begin the quiz, say start.');
  },
  "Unhandled": function () {
    this.emit(':ask', 'Sorry, I didn\'t catch that, say start to begin.');
  }
};
var questionIndex
var triviaModeHandlers = Alexa.CreateStateHandler(states.TRIVIA, {

  // "NewSession": function () {
  //   this.emit(':ask', 'Alright then. Let\'s begin. I will give an algebraic equation and your task is to find the value of x. Ready?'); // Equivalent to the Start Mode NewSession handler
  // },

  "QuestionIntent": function () {
    questionIndex = Math.floor(Math.random())
    // console.log(randomQuestion)
    this.emit(':ask', 'Question one. ' + questions[questionIndex][0])

  // "AMAZON.NoIntent": function () {
  //   this.emit(':ask', 'Say help if you need assistance, or stop to exit the quiz.')
  },

  "AnswerIntent": function() {
    var guessAnswer = this.event.request.intent.slots.Answer.value;
    var correctAnswer = questions[questionIndex][1]
    if (guessAnswer === correctAnswer) {
      this.emit(':tell', "That is correct.")
    } else {
      this.emit(':tell', "Wrong answer. The correct is " + correctAnswer)
    }
  },

  "Unhandled": function () {
    this.emit(':ask', 'Sorry, I didn\'t catch that, say help if you need assistance.');
  }

});
