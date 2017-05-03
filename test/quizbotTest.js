var bst = require('bespoken-tools');

var sinon = require('sinon');
var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var server = null;
var alexa = null;



beforeEach(function (done) {
  server = new bst.LambdaServer('index.js', 10000, true);
  alexa = new bst.BSTAlexa('http://localhost:10000',
  '../speechAssets/IntentSchema.json',
  '../speechAssets/Utterances.txt');
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

describe('launching the quiz (Menu handlers)', function (done){

  it('launches and then asks user choose a level', function (done) {
    alexa.launched(function (error, payload) {
      assert.include(payload.response.outputSpeech.ssml, 'Welcome to <emphasis level="reduced">quiz bot</emphasis>! Say level one for beginner. Say level two for intermediate, or <break time="0.05s"/>say exit to close <phoneme alphabet="ipa" ph="kwɪz.bɒt">Quizbot</phoneme>.');
      done();
    });
  });

  it('can reply with help message when the user asks for help', function (done) {
    alexa.launched(function (error, payload) {
      alexa.spoken('help', function (error, payload) {
        assert.include(payload.response.outputSpeech.ssml, 'Say level one for beginner. Say level two for intermediate, or <break time="0.05s"/>say exit to close <phoneme alphabet="ipa" ph="kwɪz.bɒt">Quizbot</phoneme>.');
        done();
      });
    });
  });

  it('can reply with the unhandled message when it doesn\'t understand the user\'s request', function (done) {
    alexa.launched(function (error, payload) {
      alexa.spoken('Test', function (error, payload) {
        assert.include(payload.response.outputSpeech.ssml, 'Sorry, I didn\'t catch that. Say level one for beginner. Say level two for intermediate, or <break time="0.05s"/>say exit to close <phoneme alphabet="ipa" ph="kwɪz.bɒt">Quizbot</phoneme>.');
        done();
      });
    });
  });

  it('can reply with a start message when the user wants to start the game', function (done) {
    alexa.launched(function(error, payload) {
      alexa.spoken('Start', function (error, payload) {
        assert.include(payload.response.outputSpeech.ssml, 'Alright, Let\'s begin. I will give an algebraic equation and your task is to find the value of x.');
        done();
      });
    });
  });
});

describe('playing the quiz (Trivia handlers)', function (done){
  it('can ask the first question', function (done) {
    // Stub randomness
    // function getQuestion() {
    //   return 'If 2x = 6, what is the value of x?';
    // }
    // var questionSpy = spy
    // sinon.stub(Object, 'getQuestion').returns('If 2x = 6, what is the value of x?');
    alexa.launched(function(error, payload) {
      alexa.spoken('Start', function (error, payload) {
        assert.include(payload.response.outputSpeech.ssml, 'Question 1.');
        done();
      });
    });
  });

  it('moves onto the second question after the user answers the first', function(done) {
    alexa.launched(function(error, payload) {
      alexa.spoken('Start', function (error, payload) {
        assert.include(payload.response.outputSpeech.ssml, 'Question 1.');
        alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
          assert.include(payload.response.outputSpeech.ssml, 'Question 2.');
          // alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
          //   assert.include(payload.response.outputSpeech.ssml, 'Question 3.');
          //   alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
          //     assert.include(payload.response.outputSpeech.ssml, 'medal');
          done();
          //   });
          // });
        });
      });
    });
  });

  it('moves onto the third question after the user answers the second', function(done) {
    alexa.launched(function(error, payload) {
      alexa.spoken('Start', function (error, payload) {
        assert.include(payload.response.outputSpeech.ssml, 'Question 1.');
        alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
          assert.include(payload.response.outputSpeech.ssml, 'Question 2.');
          alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
            assert.include(payload.response.outputSpeech.ssml, 'Question 3.');
            done();
          });
        });
      });
    });
  });

  it('moves onto the third question after the user answers the second', function(done) {
    alexa.launched(function(error, payload) {
      alexa.spoken('Start', function (error, payload) {
        assert.include(payload.response.outputSpeech.ssml, 'Question 1.');
        alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
          assert.include(payload.response.outputSpeech.ssml, 'Question 2.');
          alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
            assert.include(payload.response.outputSpeech.ssml, 'Question 3.');
            alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
              assert.include(payload.response.outputSpeech.ssml, 'Question 4.');
              done();
            });
          });
        });
      });
    });
  });

  it('can complete a quiz', function(done) {
    alexa.launched(function(error, payload) {
      alexa.spoken('Start', function (error, payload) {
        assert.include(payload.response.outputSpeech.ssml, 'Question 1.');
        alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
          assert.include(payload.response.outputSpeech.ssml, 'Question 2.');
          alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
            assert.include(payload.response.outputSpeech.ssml, 'Question 3.');
            alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
              assert.include(payload.response.outputSpeech.ssml, 'Question 4.');
              alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
                assert.include(payload.response.outputSpeech.ssml, 'Question 5.');
                alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
                  assert.include(payload.response.outputSpeech.ssml, 'You have scored');
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  it('asks level 1 questions if the user sets the level to 1 on the menu', function(done) {
    alexa.launched(function(error, payload) {
      alexa.intended('LevelIntent', {"Level": "1"}, function(error, payload) {
        assert.include(payload.response.outputSpeech.ssml, 'x');
        done();
      });
    });
  });

  it('asks level 2 questions if the user sets the level to 2 on the menu', function(done) {
    alexa.launched(function(error, payload) {
      alexa.intended('LevelIntent', {"Level": "2"}, function(error, payload) {
        assert.include(payload.response.outputSpeech.ssml, 'x +');
        done();
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
