// var languageString = {
//   "en": {
//     "translation": {
//       "QUESTIONS" : questions["QUESTIONS_EN_US"],
//       "GAME_NAME" :
//     }
//   }
//

// https://proxy.bespoken.tools?node-id=b292a9dc-7f77-420d-a963-56a6a168bea0

var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback){
    var alexa_one = Alexa.handler(event, context);
    alexa_one.registerHandlers(handlers);
    // alexa_one.appId = 'amzn1.ask.skill.55f71df0-c7e2-4188-ac4e-c9f19daf5636';
    alexa_one.execute();
};

var handlers = {

    "LaunchRequest": function () {
        this.emit(':tell', 'Hello World!');
    }

};
// function AlexaSkill(appId = 'amzn1.ask.skill.55f71df0-c7e2-4188-ac4e-c9f19daf5636') {
//     this._appId = appId;
// }
//
// AlexaSkill.prototype.requestHandlers = {
//     LaunchRequest: function (event, context, response) {
//         this.eventHandlers.onLaunch.call(this, event.request, event.session, response);
//     },

    // IntentRequest: function (event, context, response) {
    //     this.eventHandlers.onIntent.call(this, event.request, event.session, response);
    // },
    //
    // SessionEndedRequest: function (event, context) {
    //     this.eventHandlers.onSessionEnded(event.request, event.session);
    //     context.succeed();
    // }
// };

// AlexaSkill.prototype.eventHandlers = {
//     onSessionStarted: function (sessionStartedRequest, session) {
//     },
//
//     onLaunch: function (launchRequest, session, response) {
//         throw "onLaunch should be overriden by subclass";
//     },
//
//     onIntent: function (intentRequest, session, response) {
//         var intent = intentRequest.intent,
//             intentName = intentRequest.intent.name,
//             intentHandler = this.intentHandlers[intentName];
//         if (intentHandler) {
//             console.log('dispatch intent = ' + intentName);
//             intentHandler.call(this, intent, session, response);
//         } else {
//             throw 'Unsupported intent = ' + intentName;
//         }
//     },
//
//     onSessionEnded: function (sessionEndedRequest, session) {
//     }
// };

// AlexaSkill.prototype.intentHandlers = {};
//
// AlexaSkill.prototype.execute = function (event, context) {
//     try {
//         console.log("session applicationId: " + event.session.application.applicationId);
//
//         if (this._appId && event.session.application.applicationId !== this._appId) {
//             console.log("The applicationIds don't match : " + event.session.application.applicationId + " and "
//                 + this._appId);
//             throw "Invalid applicationId";
//         }
//
//         if (!event.session.attributes) {
//             event.session.attributes = {};
//         }
//
//         if (event.session.new) {
//             this.eventHandlers.onSessionStarted(event.request, event.session);
//         }
//
//         var requestHandler = this.requestHandlers[event.request.type];
//         requestHandler.call(this, event, context, new Response(context, event.session));
//     } catch (e) {
//         console.log("Unexpected exception " + e);
//         context.fail(e);
//     }
// };
//
// exports.handler = function(event, context) {
//     var skill = new BusSchedule();
//     skill.execute(event, context);
// };
//
// var Response = function (context, session) {
//     this._context = context;
//     this._session = session;
// };
