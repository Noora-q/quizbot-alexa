var Alexa = require('alexa-sdk');
var request = require('request');
var api = require('./api.js');

var APP_ID = undefined;
var QUESTION_TOTAL = 5;
var GOLD_MEDAL = QUESTION_TOTAL;
var SILVER_MEDAL = 4;
var BRONZE_MEDAL = 3;
var WELCOME_MESSAGE = '<speak>Welcome to <emphasis level="moderate">quiz</emphasis>bot. Say start when you\'re ready.</speak>';
var INSTRUCTIONS_MESSAGE = '<speak>Alright then. Let\'s begin. I will give an algebraic equation and your task is to find the value of x.</speak>';
var GENERAL_UNHANDLED_MESSAGE = '<speak>Sorry, I didn\'t catch that, please repeat.</speak>';
var MENU_UNHANDLED_MESSAGE = '<speak>Sorry, I didn\'t catch that, say start to begin a new quiz or exit to close <emphasis level="moderate">quiz</emphasis>bot.</speak>';
var MENU_HELP_MESSAGE = '<speak>Say start to begin a new quiz or exit to close <emphasis level="moderate">quiz</emphasis>bot.</speak>';
var TRIVIA_HELP_MESSAGE = '<speak>Your answer must be a number. If you didn\'t hear the question, say repeat. To go back to the main menu, say stop. To quit the game say exit.</speak>';
var EXIT_MESSAGE = '<speak>Goodbye!</speak>';
var questionNumber;
var states = {
  TRIVIA: "_TRIVIAMODE",
  MENU: "_MENUMODE"
};
var requestUri = 'http://api-a70.mangahigh.com';
var sessionKey = 'session_a70';
var questions = require('./questions')
var currentQuestion;
var score;
var usedKeys = [];

var correctAnswerMessages = ['Right!','Correct!', 'That is the right answer!', 'Woohoo!', 'Awesome!', 'Great job!', 'Well done!'];
// var CORRECT_ANSWER_MESSAGE = correctAnswerMessages[Math.floor(Math.random() * correctAnswerMessages.length)];

var incorrectAnswerMessages = ['Wrong!','Incorrect!','That is not the right answer!', 'That is incorrect!'];
// var INCORRECT_ANSWER_MESSAGE = incorrectAnswerMessages[Math.floor(Math.random() * incorrectAnswerMessages.length)];


function getQuestion() {
  var keys = Object.keys(questions);
  var rnd = Math.floor(Math.random() * keys.length);
  for ( i = 0; i < usedKeys.length; i++ ){
    console.log(keys[rnd])
    console.log("rnd: ", rnd)
    console.log("usedKeys[i]: ", usedKeys[i])
    if (rnd == usedKeys[i]) {
      console.log("hellothere");
      return getQuestion();
    }
  }
  var key = keys[rnd];
  usedKeys.push(rnd)
  console.log("Asked question: ", key)
  return key;
}

function getMedal(score) {
  if (score === GOLD_MEDAL) {
    return 'G';
  } else if (score >= SILVER_MEDAL) {
    return 'S';
  } else if (score >= BRONZE_MEDAL) {
    return 'B';
  } else {
    return null;
  }
}

exports.handler = function(event, context, callback){
  var alexa_one = Alexa.handler(event, context);
  alexa_one.registerHandlers(handlers, menuHandlers, triviaModeHandlers);
  alexa_one.appId = APP_ID;
  alexa_one.execute();
};

var userId;
var userSessionId;
var gameSessionId

var handlers =  {

  "LaunchRequest": function() {
    var alexa = this;
    this.handler.state = states.MENU;

    api.login(10, 1, "gorilla652", function (playerId, sessionId) {
        userId = playerId;
        userSessionId = sessionId;
        alexa.emitWithState('NewSession');
      }
    );
  },

  "UnhandledIntent": function() {
    this.emit(':ask', GENERAL_UNHANDLED_MESSAGE);
  },

  "Unhandled": function() {
    this.emit(':ask', GENERAL_UNHANDLED_MESSAGE);
  }
};

var menuHandlers = Alexa.CreateStateHandler(states.MENU, {

  "NewSession": function () {
    this.emit(':ask', WELCOME_MESSAGE);
  },

  "AMAZON.StartOverIntent": function() {
    var alexa = this;
    questionNumber = 1;
    score = 0;
    this.handler.state = states.TRIVIA;
    api.getGameSessionId(
        1,
        userSessionId,
        userId,
        function  (gameSessionId2) {
          gameSessionId = gameSessionId2;
          alexa.emitWithState('QuestionIntent', INSTRUCTIONS_MESSAGE);
        }
    );
  },

  "AMAZON.HelpIntent": function() {
    this.emit(':ask', MENU_HELP_MESSAGE);
  },

  "MenuIntent": function(message) {
    var alexa = this;
    if (questionNumber > QUESTION_TOTAL) {
      api.sendResults(1, userSessionId, userId, score, gameSessionId, getMedal(score), function() {
        alexa.emit(':ask', message + ' We have just saved your results.');
      });
    } else {
      alexa.emit(':ask', MENU_HELP_MESSAGE);
    };
  },

  "AMAZON.CancelIntent": function() {
    this.emit(':tell', EXIT_MESSAGE);
  },

  "UnhandledIntent": function() {
    this.emit(':ask', MENU_UNHANDLED_MESSAGE);
  },

  "Unhandled": function() {
    this.emit(':ask', MENU_UNHANDLED_MESSAGE);
  }
});

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
      if (questionNumber > QUESTION_TOTAL) {
        this.handler.state = states.MENU;
        this.emitWithState('MenuIntent', correctAnswerMessages[Math.floor(Math.random() * correctAnswerMessages.length)] + ' You have scored ' + score + ' out of ' + QUESTION_TOTAL);
      } else {
        this.emitWithState('QuestionIntent', correctAnswerMessages[Math.floor(Math.random() * correctAnswerMessages.length)]);
      }

    } else {
      if (questionNumber > QUESTION_TOTAL) {
        this.handler.state = states.MENU;
        this.emitWithState('MenuIntent', incorrectAnswerMessages[Math.floor(Math.random() * incorrectAnswerMessages.length)] + ' You have scored ' + score + ' out of ' + QUESTION_TOTAL);
      } else {
        this.emitWithState('QuestionIntent', incorrectAnswerMessages[Math.floor(Math.random() * incorrectAnswerMessages.length)]);
      }
    }
  },

  "AMAZON.RepeatIntent": function() {
    this.emit(':ask', currentQuestion);
  },

  "AMAZON.HelpIntent": function() {
    this.emit(':ask', TRIVIA_HELP_MESSAGE);
  },

  "AMAZON.StopIntent": function() {
    this.handler.state = states.MENU;
    this.emitWithState('MenuIntent', "");
  },

  "AMAZON.CancelIntent": function() {
    this.emit(':tell', EXIT_MESSAGE);
  },

  "UnhandledIntent": function() {
    this.emit(':ask', GENERAL_UNHANDLED_MESSAGE);
  },

  "Unhandled": function() {
    this.emit(':ask', GENERAL_UNHANDLED_MESSAGE);
  }

});
