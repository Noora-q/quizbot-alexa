var Alexa = require('alexa-sdk');
var request = require('request');

var APP_ID = undefined;
var QUESTION_TOTAL = 5;
var GOLD_MEDAL = QUESTION_TOTAL;
var SILVER_MEDAL = 4;
var BRONZE_MEDAL = 3;
var GENERAL_UNHANDLED_MESSAGE = 'Sorry, I didn\'t catch that, please repeat.';
var MENU_UNHANDLED_MESSAGE = 'Sorry, I didn\'t catch that, say start to begin a new game or exit to close Quiz bot.'
var questionNumber;
var states = {
  TRIVIA: "_TRIVIAMODE",
  MENU: "_MENUMODE"
};
var requestUri = 'http://api-b90.mangahigh.com';
var sessionKey = 'session_b90';
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
    return 'G'
  } else if (score >= SILVER_MEDAL) {
    return 'S'
  } else if (score >= BRONZE_MEDAL) {
    return 'B'
  } else {
    return null
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
    this.handler.state = states.MENU
    this.emitWithState('NewSession')
  },

  "UnhandledIntent": function() {
    this.emit(':ask', GENERAL_UNHANDLED_MESSAGE)
  },

  "Unhandled": function() {
    this.emit(':ask', GENERAL_UNHANDLED_MESSAGE);
  }
}

var menuHandlers = Alexa.CreateStateHandler(states.MENU, {

  "NewSession": function () {
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
    var alexa = this;
var json = {
  schoolId: 363305,
  studentId: 'alice',
  password: "password"
}

var x = {
  headers: {
    'user-agent': 'alexa'
  },
  uri: requestUri + '/auth',
  method: 'post',
  json: json
}

request(x, function (error, response, body){
  // console.log("error: " + error)
  // console.log("response: ", response)
  // console.log("body: ", body)
  var sessionId = body.id;
  userId = body.userId
  console.log(sessionId);
  // var y = {
  //   headers: {
  //     'cookie': sessionKey + '=' + sessionId,
  //     'user-agent': 'alexa'
  //   },
  //   uri: requestUri + '/user/' + userId,
  //   method: 'get'
  // }
  //
  //
  // request(y, function (error, response, body){
  //   console.log(body);
  //   // Not necessary
    var z = {
      headers: {
        'cookie': sessionKey + '=' + sessionId,
        'user-agent': 'alexa'
      },
      uri: requestUri + '/user/' + userId + '/game/21/play',
      method: 'post',
      json: {
        level: 2
      }
    }
    request(z, function (error, response, body){
      console.log(body)
      playId = body.gamePlayId;

      var a = {
        headers: {
          'cookie': sessionKey + '=' + sessionId,
          'user-agent': 'alexa'
        },
        uri: requestUri + '/user/' + userId + '/game/21/play/' + playId,
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
      }

      request(a, function (error, response, body){
        alexa.emit(':ask', message + 'We have just saved your results.')
      });
    // });
  });

});
  },

  "AMAZON.StopIntent": function() {

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
        this.emitWithState('MenuIntent', 'Correct! You have scored ' + score + ' out of ' + QUESTION_TOTAL + '. You got a ' + getMedal(score) + ' medal!');
      } else {
        this.emitWithState('QuestionIntent', 'Correct!');
      }

    } else {
      if (questionNumber > QUESTION_TOTAL) {
        this.handler.state = states.MENU;
        this.emitWithState('MenuIntent', 'Incorrect! You have scored ' + score + ' out of ' + QUESTION_TOTAL + '. You got a ' + getMedal(score) + ' medal!');
      } else {
        this.emitWithState('QuestionIntent', 'Incorrect!');
      }
    }
  },

  // TODO add help intent

  "AMAZON.StopIntent": function() {
    this.handler.state = states.MENU;
    this.emitWithState('MenuIntent', "");
  },

  "UnhandledIntent": function() {
    this.emit(':ask', GENERAL_UNHANDLED_MESSAGE)
  },

  "Unhandled": function() {
    this.emit(':ask', GENERAL_UNHANDLED_MESSAGE);
  }

});
