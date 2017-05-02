var request = require('request');


module.exports = {};

var requestUri = 'https://api-a70.mangahigh.com';
var sessionKey = 'session_a70';
var gameId = 24

/**
 * @param {number}   schoolId
 * @param {number}   studentId
 * @param {string}   password
 * @param {callback} callback
 */
module.exports.login = function (schoolId, studentId, password, callback) {
  var loginJSON = {
    headers: {
      'user-agent': 'alexa'
    },
    uri: requestUri + '/auth',
    method: 'post',
    json: {
      schoolId: schoolId,
      studentId: studentId,
      password: password
    }
  }

  request(loginJSON, function (error, response, body) {
    callback(body.userId, body.id);
  });
}


module.exports.getGameSessionId = function (levelId, userSessionId, userId, callback) {
  var gameStartJSON = {
      headers: {
        'cookie': sessionKey + '=' + userSessionId,
        'user-agent': 'alexa'
      },
      uri: requestUri + '/user/' + userId + '/game/' + gameId + '/play',
      method: 'post',
      json: {
        level: levelId
      }
    }

    request(gameStartJSON, function (error, response, body){
      //console.log(gameStartJSON);

      callback(
        body.gamePlayId
      );
    })
};

module.exports.sendResults = function (levelId, userSessionId, userId, score, gamePlayId, medal, callback) {
      var sendResultsJSON = {
        headers: {
          'cookie': sessionKey + '=' + userSessionId,
          'user-agent': 'alexa'
        },
        uri: requestUri + '/user/' + userId + '/game/' + gameId + '/play/' + gamePlayId,
        method: 'put',
        json: {
          settings: {},
          balance: 0,
          gameData: {},
          assets: [],
          score: score,
          timePlayed: 10,
          level: levelId,
          action: 'update',
          achievements: [{
            activityId: levelId,
            medal: medal,
            highScore: 60
          }]
        }
      }

      request(sendResultsJSON, function (error, response, body){
        callback()
      });
    };
