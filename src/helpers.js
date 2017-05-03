var GOLD_MEDAL = 5;
var SILVER_MEDAL = 4;
var BRONZE_MEDAL = 3;

exports.getQuestion = function(questions, usedKeys) {
  var keys = Object.keys(questions);
  var rnd = Math.floor(Math.random() * keys.length);
  for ( i = 0; i < usedKeys.length; i++ ){
    if (rnd == usedKeys[i]) {
      return exports.getQuestion(questions, usedKeys);
    }
  }
  var key = keys[rnd];
  usedKeys.push(rnd);
  return key;
};

exports.getMedal = function(score) {
  if (score === GOLD_MEDAL) {
    return 'G';
  } else if (score >= SILVER_MEDAL) {
    return 'S';
  } else if (score >= BRONZE_MEDAL) {
    return 'B';
  } else {
    return null;
  }
};

exports.getAnswerReply = function(answerMessages) {
  return answerMessages[Math.floor(Math.random() * answerMessages.length)];
};
