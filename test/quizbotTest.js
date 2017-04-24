const context = require('aws-lambda-mock-context')
var expect = require('chai').expect;
var index = require('../src/index');

const ctx = context();

describe("Testing greeting message", function() {

  var speechResponse;
  var speechError;

  before(function(done){
    index.Handler({}, ctx);
    ctx.Promise
      .then(response => { speechResponse = response; console.log(speechResponse); done(); })
      .catch(error => { speechError = error; done(); })
  });

});
