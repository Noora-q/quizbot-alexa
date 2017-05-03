var bst = require('bespoken-tools');

var sinon = require('sinon');
var chai = require('chai');
var spies = require('chai-spies');

var questions1 = require("../src/questions1");
var questions2 = require("../src/questions2");

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

  //redundant?
  it('can reply with a start message when the user wants to start the game', function (done) {
    alexa.launched(function(error, payload) {
      alexa.spoken('Start', function (error, payload) {
        assert.include(payload.response.outputSpeech.ssml, 'Alright, Let\'s begin. I will give an algebraic equation and your task is to find the value of x.');
        done();
      });
    });
  });

  it('asks level 1 questions if the user sets the level to 1 on the menu', function(done) {
    alexa.launched(function(error, payload) {
      var keys = Object.keys(questions1);
      var randomStub = sinon.stub(Math, "random").returns(0/keys.length);
      alexa.intended('LevelIntent', {"Level": "1"}, function(error, payload) {
        randomStub.restore();
        assert.include(payload.response.outputSpeech.ssml, '1x = 1');
        done();
      });
    });
  });

  it('asks level 2 questions if the user sets the level to 2 on the menu', function(done) {
    alexa.launched(function(error, payload) {
      var keys = Object.keys(questions2);
      var randomStub = sinon.stub(Math, "random").returns(0/keys.length);
      alexa.intended('LevelIntent', {"Level": "2"}, function(error, payload) {
        randomStub.restore();
        assert.include(payload.response.outputSpeech.ssml, '2x + 1 = 5');
        done();
      });
    });

    it('can allow user to exit the game', function (done) {
      alexa.launched(function(error, payload) {
        alexa.spoken('exit', function (error, payload){
          assert.equal(payload.response.shouldEndSession, true);
          done();
        });
      });
    });
  });
});

describe('playing the quiz (Trivia handlers)', function (done){

  describe('Level 1', function() {

    it('can ask the first question', function (done) {
      var keys = Object.keys(questions1);
      var randomStub = sinon.stub(Math, "random").returns(0/keys.length);
      alexa.launched(function(error, payload) {
        alexa.intended('LevelIntent', {"Level": "1"}, function(error, payload) {
          randomStub.restore();
          assert.include(payload.response.outputSpeech.ssml, '1x = 1');
          done();
        });
      });
    });

    it('moves onto the second question after the user answers the first', function(done) {
      var keys = Object.keys(questions1);
      var randomStub = sinon.stub(Math, "random").returns(0/keys.length);
      alexa.launched(function(error, payload) {
        alexa.intended('LevelIntent', {"Level": "1"}, function(error, payload) {
          randomStub.restore();
          assert.include(payload.response.outputSpeech.ssml, '1x = 1');

          var randomStub1 = sinon.stub(Math, "random").returns(1/keys.length);
          alexa.intended('AnswerIntent', {"Answer": "1"}, function(error, payload) {
            randomStub1.restore();

            assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 2. <break time="0.35s"/>1x = 2');
            done();
          });
        });
      });
    });

    it('moves onto the third question after the user answers the second', function(done) {
      var keys = Object.keys(questions1);
      var randomStub = sinon.stub(Math, "random").returns(0/keys.length);
      alexa.launched(function(error, payload) {
        alexa.intended('LevelIntent', {"Level": "1"}, function(error, payload) {
          randomStub.restore();
          assert.include(payload.response.outputSpeech.ssml, '1x = 1');

          var randomStub1 = sinon.stub(Math, "random").returns(1/keys.length);
          alexa.intended('AnswerIntent', {"Answer": "1"}, function(error, payload) {
            randomStub1.restore();
            assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 2. <break time="0.35s"/>1x = 2');

            var randomStub2 = sinon.stub(Math, "random").returns(2/keys.length);
            alexa.intended('AnswerIntent', {"Answer": "2"}, function(error, payload) {
              randomStub2.restore();
              assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 3. <break time="0.35s"/>1x = 3');
              done();
            });
          });
        });
      });
    });

    it('moves onto the fourth question after the user answers the third', function(done) {
      var keys = Object.keys(questions1);
      var randomStub = sinon.stub(Math, "random").returns(0/keys.length);
      alexa.launched(function(error, payload) {
        alexa.intended('LevelIntent', {"Level": "1"}, function(error, payload) {
          randomStub.restore();
          assert.include(payload.response.outputSpeech.ssml, '1x = 1');

          var randomStub1 = sinon.stub(Math, "random").returns(1/keys.length);
          alexa.intended('AnswerIntent', {"Answer": "1"}, function(error, payload) {
            randomStub1.restore();
            assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 2. <break time="0.35s"/>1x = 2');

            var randomStub2 = sinon.stub(Math, "random").returns(2/keys.length);
            alexa.intended('AnswerIntent', {"Answer": "2"}, function(error, payload) {
              randomStub2.restore();
              assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 3. <break time="0.35s"/>1x = 3');

              var randomStub3 = sinon.stub(Math, "random").returns(3/keys.length);
              alexa.intended('AnswerIntent', {"Answer": "3"}, function(error, payload) {
                randomStub3.restore();
                assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 4. <break time="0.35s"/>1x = 4');
                done();
              });
            });
          });
        });
      });
    });

    it('moves onto the fifth question after the user answers the fourth', function(done) {
      var keys = Object.keys(questions1);
      var randomStub = sinon.stub(Math, "random").returns(0/keys.length);
      alexa.launched(function(error, payload) {
        alexa.intended('LevelIntent', {"Level": "1"}, function(error, payload) {
          randomStub.restore();
          assert.include(payload.response.outputSpeech.ssml, '1x = 1');

          var randomStub1 = sinon.stub(Math, "random").returns(1/keys.length);
          alexa.intended('AnswerIntent', {"Answer": "1"}, function(error, payload) {
            randomStub1.restore();
            assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 2. <break time="0.35s"/>1x = 2');

            var randomStub2 = sinon.stub(Math, "random").returns(2/keys.length);
            alexa.intended('AnswerIntent', {"Answer": "2"}, function(error, payload) {
              randomStub2.restore();
              assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 3. <break time="0.35s"/>1x = 3');

              var randomStub3 = sinon.stub(Math, "random").returns(3/keys.length);
              alexa.intended('AnswerIntent', {"Answer": "3"}, function(error, payload) {
                randomStub3.restore();
                assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 4. <break time="0.35s"/>1x = 4');

                var randomStub4 = sinon.stub(Math, "random").returns(4/keys.length);
                alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
                  randomStub3.restore();
                  assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 5. <break time="0.35s"/>1x = 5');
                  done();
                });
              });
            });
          });
        });
      });
    });


    it('can complete a quiz', function(done) {
      var keys = Object.keys(questions1);
      var randomStub = sinon.stub(Math, "random").returns(0/keys.length);
      alexa.launched(function(error, payload) {
        alexa.intended('LevelIntent', {"Level": "1"}, function(error, payload) {
          randomStub.restore();
          assert.include(payload.response.outputSpeech.ssml, '1x = 1');

          var randomStub1 = sinon.stub(Math, "random").returns(1/keys.length);
          alexa.intended('AnswerIntent', {"Answer": "1"}, function(error, payload) {
            randomStub1.restore();
            assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 2. <break time="0.35s"/>1x = 2');

            var randomStub2 = sinon.stub(Math, "random").returns(2/keys.length);
            alexa.intended('AnswerIntent', {"Answer": "2"}, function(error, payload) {
              randomStub2.restore();
              assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 3. <break time="0.35s"/>1x = 3');

              var randomStub3 = sinon.stub(Math, "random").returns(3/keys.length);
              alexa.intended('AnswerIntent', {"Answer": "3"}, function(error, payload) {
                randomStub3.restore();
                assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 4. <break time="0.35s"/>1x = 4');

                var randomStub4 = sinon.stub(Math, "random").returns(4/keys.length);
                alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
                  randomStub3.restore();
                  assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 5. <break time="0.35s"/>1x = 5');

                  alexa.intended('AnswerIntent', {"Answer": "5"}, function(error, payload) {
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

    it('can allow the user to ask for help mid game', function(done){
      alexa.launched(function(error, payload){
        alexa.intended('LevelIntent', {"Level": "1"}, function(error, payload){
          alexa.spoken('help', function (error, payload) {
            assert.include(payload.response.outputSpeech.ssml, 'Your answer must be a number. If you didn\'t hear the question, say repeat. To go back to the main menu, say stop. To quit the game say exit.');
            done();
          });
        });
      });
    });

    it('can allow user to exit the game', function (done) {
      alexa.launched(function(error, payload) {
        alexa.intended('LevelIntent', {"Level": "1"}, function(error, payload) {
          alexa.spoken('exit', function (error, payload){
            console.log('payload', payload);
            assert.equal(payload.response.shouldEndSession, true);
            done();
          });
        });
      });
    });


  });

  describe('Level 2', function() {

    it('can ask the first question', function (done) {
      var keys = Object.keys(questions2);
      var randomStub = sinon.stub(Math, "random").returns(0/keys.length);
      alexa.launched(function(error, payload) {
        alexa.intended('LevelIntent', {"Level": "2"}, function(error, payload) {
          randomStub.restore();
          assert.include(payload.response.outputSpeech.ssml, '2x + 1 = 5');
          done();
        });
      });
    });

    it('moves onto the second question after the user answers the first', function(done) {
      var keys = Object.keys(questions2);
      var randomStub = sinon.stub(Math, "random").returns(0/keys.length);
      alexa.launched(function(error, payload) {
        alexa.intended('LevelIntent', {"Level": "2"}, function(error, payload) {
          randomStub.restore();
          assert.include(payload.response.outputSpeech.ssml, '2x + 1 = 5');

          var randomStub1 = sinon.stub(Math, "random").returns(1/keys.length);
          alexa.intended('AnswerIntent', {"Answer": "2"}, function(error, payload) {
            randomStub1.restore();

            assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 2. <break time="0.35s"/>2x + 2 = 8');
            done();
          });
        });
      });
    });

    it('moves onto the third question after the user answers the second', function(done) {
      var keys = Object.keys(questions2);
      var randomStub = sinon.stub(Math, "random").returns(0/keys.length);
      alexa.launched(function(error, payload) {
        alexa.intended('LevelIntent', {"Level": "2"}, function(error, payload) {
          randomStub.restore();
          assert.include(payload.response.outputSpeech.ssml, '2x + 1 = 5');

          var randomStub1 = sinon.stub(Math, "random").returns(1/keys.length);
          alexa.intended('AnswerIntent', {"Answer": "2"}, function(error, payload) {
            randomStub1.restore();
            assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 2. <break time="0.35s"/>2x + 2 = 8');

            var randomStub2 = sinon.stub(Math, "random").returns(2/keys.length);
            alexa.intended('AnswerIntent', {"Answer": "3"}, function(error, payload) {
              randomStub2.restore();
              assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 3. <break time="0.35s"/>2x + 4 = 12');
              done();
            });
          });
        });
      });
    });

    it('moves onto the fourth question after the user answers the third', function(done) {
      var keys = Object.keys(questions2);
      var randomStub = sinon.stub(Math, "random").returns(0/keys.length);
      alexa.launched(function(error, payload) {
        alexa.intended('LevelIntent', {"Level": "2"}, function(error, payload) {
          randomStub.restore();
          assert.include(payload.response.outputSpeech.ssml, '2x + 1 = 5');

          var randomStub1 = sinon.stub(Math, "random").returns(1/keys.length);
          alexa.intended('AnswerIntent', {"Answer": "2"}, function(error, payload) {
            randomStub1.restore();
            assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 2. <break time="0.35s"/>2x + 2 = 8');

            var randomStub2 = sinon.stub(Math, "random").returns(2/keys.length);
            alexa.intended('AnswerIntent', {"Answer": "3"}, function(error, payload) {
              randomStub2.restore();
              assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 3. <break time="0.35s"/>2x + 4 = 12');

              var randomStub3 = sinon.stub(Math, "random").returns(3/keys.length);
              alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
                randomStub3.restore();
                assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 4. <break time="0.35s"/>2x + 6 = 16');
                done();
              });
            });
          });
        });
      });
    });

    it('moves onto the fifth question after the user answers the fourth', function(done) {
      var keys = Object.keys(questions2);
      var randomStub = sinon.stub(Math, "random").returns(0/keys.length);
      alexa.launched(function(error, payload) {
        alexa.intended('LevelIntent', {"Level": "2"}, function(error, payload) {
          randomStub.restore();
          assert.include(payload.response.outputSpeech.ssml, '2x + 1 = 5');

          var randomStub1 = sinon.stub(Math, "random").returns(1/keys.length);
          alexa.intended('AnswerIntent', {"Answer": "2"}, function(error, payload) {
            randomStub1.restore();
            assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 2. <break time="0.35s"/>2x + 2 = 8');

            var randomStub2 = sinon.stub(Math, "random").returns(2/keys.length);
            alexa.intended('AnswerIntent', {"Answer": "3"}, function(error, payload) {
              randomStub2.restore();
              assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 3. <break time="0.35s"/>2x + 4 = 12');

              var randomStub3 = sinon.stub(Math, "random").returns(3/keys.length);
              alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
                randomStub3.restore();
                assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 4. <break time="0.35s"/>2x + 6 = 16');

                var randomStub4 = sinon.stub(Math, "random").returns(4/keys.length);
                alexa.intended('AnswerIntent', {"Answer": "5"}, function(error, payload) {
                  randomStub3.restore();
                  assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 5. <break time="0.35s"/>2x + 10 = 24');
                  done();
                });
              });
            });
          });
        });
      });
    });


    it('can complete a quiz', function(done) {
      var keys = Object.keys(questions2);
      var randomStub = sinon.stub(Math, "random").returns(0/keys.length);
      alexa.launched(function(error, payload) {
        alexa.intended('LevelIntent', {"Level": "2"}, function(error, payload) {
          randomStub.restore();
          assert.include(payload.response.outputSpeech.ssml, '2x + 1 = 5');

          var randomStub1 = sinon.stub(Math, "random").returns(1/keys.length);
          alexa.intended('AnswerIntent', {"Answer": "2"}, function(error, payload) {
            randomStub1.restore();
            assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 2. <break time="0.35s"/>2x + 2 = 8');

            var randomStub2 = sinon.stub(Math, "random").returns(2/keys.length);
            alexa.intended('AnswerIntent', {"Answer": "3"}, function(error, payload) {
              randomStub2.restore();
              assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 3. <break time="0.35s"/>2x + 4 = 12');

              var randomStub3 = sinon.stub(Math, "random").returns(3/keys.length);
              alexa.intended('AnswerIntent', {"Answer": "4"}, function(error, payload) {
                randomStub3.restore();
                assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 4. <break time="0.35s"/>2x + 6 = 16');

                var randomStub4 = sinon.stub(Math, "random").returns(4/keys.length);
                alexa.intended('AnswerIntent', {"Answer": "5"}, function(error, payload) {
                  randomStub3.restore();
                  assert.include(payload.response.outputSpeech.ssml, 'Yay! Question 5. <break time="0.35s"/>2x + 10 = 24');

                  alexa.intended('AnswerIntent', {"Answer": "7"}, function(error, payload) {
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

    it('can allow the user to ask for help mid game', function(done){
      alexa.launched(function(error, payload){
        alexa.intended('LevelIntent', {"Level": "2"}, function(error, payload){
          alexa.spoken('help', function (error, payload) {
            assert.include(payload.response.outputSpeech.ssml, 'Your answer must be a number. If you didn\'t hear the question, say repeat. To go back to the main menu, say stop. To quit the game say exit.');
            done();
          });
        });
      });
    });

    it('can allow user to exit the game', function (done) {
      alexa.launched(function(error, payload) {
        alexa.intended('LevelIntent', {"Level": "2"}, function(error, payload) {
          alexa.spoken('exit', function (error, payload){
            console.log('payload', payload);
            assert.equal(payload.response.shouldEndSession, true);
            done();
          });
        });
      });
    });

  });



});



// it('testing stubbing', function(done) {
//   alexa.launched(function(error, payload) {
//     var keys = Object.keys(questions1);
//     Math.random = sinon.stub(Math, "random").returns(0/keys.length);
//     alexa.intended('LevelIntent', {"Level": "1"}, function(error, payload) {
//       Math.random.restore();
//       assert.include(payload.response.outputSpeech.ssml, '1x = 1');
//       done();
//     });
//   });
// });



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
