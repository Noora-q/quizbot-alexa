var Alexa = require('alexa-sdk');
var request = require('request');

var APP_ID = undefined;
var QUESTION_TOTAL = 5;
var GOLD_MEDAL = QUESTION_TOTAL;
var SILVER_MEDAL = 4;
var BRONZE_MEDAL = 3;
var WELCOME_MESSAGE = 'Welcome to Quiz bot! Say start when you\'re ready.';
var INSTRUCTIONS_MESSAGE = 'Alright then. Let\'s begin. I will give an algebraic equation and your task is to find the value of x.';
var GENERAL_UNHANDLED_MESSAGE = 'Sorry, I didn\'t catch that, please repeat.';
var MENU_UNHANDLED_MESSAGE = 'Sorry, I didn\'t catch that, say start to begin a new quiz or exit to close Quiz bot.';
var MENU_HELP_MESSAGE = 'Say start to begin a new quiz or exit to close Quiz bot.';
var TRIVIA_HELP_MESSAGE = 'Your answer must be a number. If you didn\'t hear the question, say repeat. To go back to the main menu, say stop. To quit the game say exit.';
var EXIT_MESSAGE = 'Goodbye!';
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

function getQuestion() {
  var keys = Object.keys(questions);
  var rnd = Math.floor(Math.random() * keys.length);
  var key = keys[rnd];
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

var handlers =  {

  "LaunchRequest": function() {
    this.handler.state = states.MENU;
    this.emitWithState('NewSession');
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
    questionNumber = 1;
    score = 0;
    this.handler.state = states.TRIVIA;
    this.emitWithState('QuestionIntent', INSTRUCTIONS_MESSAGE);
  },

  "AMAZON.HelpIntent": function() {
    this.emit(':ask', MENU_HELP_MESSAGE);
  },

  "MenuIntent": function(message) {
    var alexa = this;
    var json = {
      schoolId: 10,
      studentId: 1,
      password: "gorilla652"
    }
    // studentId:   password:
    //            1          gorilla652
    //            2          fox995
    //            3          panda677
    //            4          ant970
    //            5          falcon702

    var getSessionIdOptions = {
      headers: {
        'user-agent': 'alexa'
      },
      uri: requestUri + '/auth',
      method: 'post',
      json: json
    };

    request(getSessionIdOptions, function (error, response, body){
      var sessionId = body.id;
      userId = body.userId;
      var getPlayIdOptions = {
        headers: {
          'cookie': sessionKey + '=' + sessionId,
          'user-agent': 'alexa'
        },
        uri: requestUri + '/user/' + userId + '/game/24/play',
        method: 'post',
        json: {
          level: 2
        }
      };

      request(getPlayIdOptions, function (error, response, body){
        playId = body.gamePlayId;
        var saveDataToDatabaseOptions = {
          headers: {
            'cookie': sessionKey + '=' + sessionId,
            'user-agent': 'alexa'
          },
          uri: requestUri + '/user/' + userId + '/game/24/play/' + playId,
          method: 'put',
          json: {
            settings: {},
            balance: 0,
            gameData: {},
            assets: [],
            score: score,
            timePlayed: 10,
            level: 2,
            action: 'update',
            achievements: [{
              activityId: 2,
              medal: getMedal(score),
              highScore: 60
            }]
          }
        };

        request(saveDataToDatabaseOptions, function (error, response, body){
          alexa.emit(':ask', message + 'We have just saved your results.');
        });
        // });
      });

    });
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
        this.emitWithState('MenuIntent', 'Correct! You have scored ' + score + ' out of ' + QUESTION_TOTAL);
      } else {
        this.emitWithState('QuestionIntent', 'Correct!');
      }

    } else {
      if (questionNumber > QUESTION_TOTAL) {
        this.handler.state = states.MENU;
        this.emitWithState('MenuIntent', 'Incorrect! You have scored ' + score + ' out of ' + QUESTION_TOTAL);
      } else {
        this.emitWithState('QuestionIntent', 'Incorrect!');
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
