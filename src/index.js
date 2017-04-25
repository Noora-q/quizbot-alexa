var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback){
  var alexa_one = Alexa.handler(event, context);
  alexa_one.registerHandlers(handlers);
  // alexa_one.appId = 'amzn1.ask.skill.55f71df0-c7e2-4188-ac4e-c9f19daf5636';
  alexa_one.execute();
};

var handlers = {

  "LaunchRequest": function () {
    this.emit(':ask', 'Welcome to Quiz bot! Say start when you\'re ready');
  },
  "AMAZON.StartOverIntent": function() {

    this.emit(':ask', 'Alright! Question 1. Who\'s the best coach at Makers Academy? That\'s right, it\'s Mary');
  }
};
