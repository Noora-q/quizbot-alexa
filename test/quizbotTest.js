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

describe('launching the quiz', function (done){

  it('launches and then asks user to start', function (done) {
    // Launch the skill via sending it a LaunchRequest
    alexa.launched(function (error, payload) {
      assert.include(payload.response.outputSpeech.ssml, 'Welcome to Quiz bot! Say start when you\'re ready.');
      done();
    });
  });

  it('can reply with a help message when the user asks for help', function (done) {
    // Emulate the user saying 'Help'
    alexa.spoken('help', function (error, payload) {
      assert.include(payload.response.outputSpeech.ssml, 'To begin the quiz, say start.');
      done();
    });
  });

  it('can reply with a help message when it doesn\'t understand the user\'s request', function (done) {
    // Emulate the user saying 'Help'
    alexa.spoken('Test', function (error, payload) {
      assert.include(payload.response.outputSpeech.ssml, 'To begin the quiz, say start.');
      done();
    });
  });
});

describe('starting the quiz', function (done){

  it('can reply with a start message when the user wants to start the game', function (done) {
    // Emulate the user saying 'Start'
    alexa.launched(function(error, payload) {
      alexa.spoken('Start', function (error, payload) {
        assert.include(payload.response.outputSpeech.ssml, 'Alright then. Let\'s begin. I will give an algebraic equation and your task is to find the value of x. Ready?');
        done();
      });
    });
  });

  it('can ask the first question when the user is ready to start', function (done) {
    alexa.launched(function(error, payload) {
      alexa.spoken('Start', function (error, payload) {
        alexa.spoken('Yes', function (error, payload){
          assert.include(payload.response.outputSpeech.ssml, 'Question one. If 2x = 6, what is the value of x?');
          done();
        });
      });
    });
  });

  it('it can offer help if the user is not ready to start', function (done) {
    alexa.launched(function(error, payload) {
      alexa.spoken('Start', function (error, payload) {
        alexa.spoken('No', function (error, payload){
          assert.include(payload.response.outputSpeech.ssml, 'Say help if you need assistance, or stop to exit the quiz.');
          done();
        });
      });
    });
  });
});

// describe('dealing with user answers', function(done){
//
//   it('can confirm a correct answer', function (done) {
//     alexa.launched(function(error, payload) {
//       alexa.spoken('Start', function (error, payload) {
//         alexa.spoken('Yes', function (error, payload){
//           alexa.spoken('Answer', function (error, payload){
//             // console.log('PURPLE')
//             // console.log(payload)
//             // console.log('guessAnswer')
//             // // console.log(parseInt(this.event.request.intent.slots.number.value))
//             assert.include(payload.response.outputSpeech.ssml, 'That is correct.')
//             done();
//           });
//         });
//       });
//     });
//   });
// });
