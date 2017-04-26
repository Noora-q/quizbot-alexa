var bst = require('bespoken-tools');
var assert = require('chai').assert;

var server = null;
var alexa = null;

beforeEach(function (done) {
    server = new bst.LambdaServer('./src/index.js', 10000, true);
    alexa = new bst.BSTAlexa('http://localhost:10000',
                             './speechAssets/IntentSchema.json',
                             './speechAssets/Utterances.txt');
    server.start(function() {
        alexa.start(function (error) {
            if (error !== undefined) {
                console.error("Error: " + error);
            } else {
                done();
            }
        });
    });
});

afterEach(function(done) {
    alexa.stop(function () {
        server.stop(function () {
            done();
        });
    });
});

it('Launches and then asks user to start', function (done) {
  // Launch the skill via sending it a LaunchRequest
  alexa.launched(function (error, payload) {
    assert.include(payload.response.outputSpeech.ssml, 'Welcome to Quiz bot! Say start when you\'re ready.');

   // Emulate the user saying 'Help'
    alexa.spoken('help', function (error, payload) {
      assert.include(payload.response.outputSpeech.ssml, 'To begin the quiz, say start.');

    // Emulate the user saying 'Help'
      alexa.spoken('Test', function (error, payload) {
       assert.include(payload.response.outputSpeech.ssml, 'Sorry, I didn\'t catch that, say start to begin.');

       // Emulate the user saying 'Start'
       alexa.spoken('Start', function (error, payload) {
         assert.include(payload.response.outputSpeech.ssml, 'Alright then. Let\'s begin. I will give an algebraic equation and your task is to find the value of x. Ready?');

         alexa.spoken('Yes', function (error, payload){
          assert.include(payload.response.outputSpeech.ssml, 'Question one. If 2x = 6, what is the value of x?');

          alexa.spoken('No', function (error, payload){
           assert.include(payload.response.outputSpeech.ssml, 'Say help if you need assistance, or stop to exit the quiz.');

           done();
           });
         });
        });
      });
    });
  });
});
