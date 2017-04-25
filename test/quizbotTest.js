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

it('Launches and then asks first question', function (done) {
    // Launch the skill via sending it a LaunchRequest
    alexa.launched(function (error, payload) {
        // Check that the introduction is play as outputSpeech
        console.log(payload);
        assert.include(payload.response.outputSpeech.ssml, 'Hello World!');


        // Emulate the user saying 'Play'
        // alexa.spoken('Play', function (error, payload) {
        //     // Ensure the correct directive and audioItem is returned
        //     assert.equal(payload.response.directives[0].type, 'AudioPlayer.Play');
        //     assert.equal(payload.response.directives[0].audioItem.stream.token, '0');
        //     assert.equal(payload.response.directives[0].audioItem.stream.url, 'https://traffic.libsyn.com/bespoken/TIP103.mp3?dest-id=432208');
        //     done();
        // });
        done();
    });
});
