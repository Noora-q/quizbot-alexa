# quizbot-alexa

**Quizbot** is an educational app designed for Amazon Echo.

Collaborators: @aleximm1, @AliceArmstrong, @ayanit1, @Noora-q

Time taken: Nine days, plus two days feature freeze

Technologies used:
* JavaScript
* NodeJS
* AWS Lambda
* Bespoken Tools
* Alexa SDK
* Mocha
* Chai
* Sinon
* Trello

### How to
This app can be downloaded from the Alexa store. To have a look at the code, clone or fork the repo. Testing is set under 'npm test' in the command line when in the src folder. Details on how to deploy the skill to AWS Lambda can be found on the [Amazon documentation](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/deploying-a-sample-skill-to-aws-lambda).

### Testing
One of the main struggles with the project was testing. Due to modernity and uniqueness of the technology, testing documentation was hard to find. After thoroughly discussing the theories of possible ways to mimic and test Alexa, we settled on using [Mocha](https://github.com/mochajs/mocha) and [Chai](https://github.com/chaijs/chai) to test Alexa's behaviour by monitoring her JSON responses. [Bespoken Tools](https://github.com/bespoken) allowed us to replicate the Lambda server, and [Sinon](https://github.com/sinonjs/sinon) allowed us to mock our project and test Ajax requests. This has meant that we've been able to TDD our project as well as getting very high test coverage compared to a lot of public Alexa apps.

### Mangahigh Integration
At the beginning of the project, we planned on making a mobile interface so that users can see their scores and track their progress. This evolved into us collaborating with [Mangahigh](https://www.mangahigh.com/en-gb/), a company that specialises in educational game for children. Our app is now integrated with the Mangahigh API, so that when a game is completed it sends the score - along with a gold, silver or bronze medal - to the Mangahigh website. This allows users to log into the website and see their progress. As far as we can tell from researching the subject, sending data from an Alexa app to an external API is not something that's been explored much before so Quizbot may be among the first apps to do it.

### Real-world application
Following [US Census Bureau data](http://voicebot.ai/2017/04/14/gartner-predicts-75-us-households-will-smart-speakers-2020/), the amount of US homes with home assistants like Amazon Echo at the end of 2016 was estimated to be 7%. If the growth trend continues in the same rate as the last five years, then by 2020 it's estimated that 75% of US households will contain a home assistant. We believe that part of this success is due to the accessibility of Alexa for visually-impaired people. As home assistants become more integrated into everyday society, Quizbot has the potential to become a crucial revision tool for children who would otherwise struggle with visual cues due to poor sight or learning difficulties.

### Future Improvements
Quizbot is an ever-evolving project. We plan to improve its features by adding more categories and subjects, and make a more complex scoring system that takes time answering questions into account. We are also interested in adding a more competitive element by allowing users to play head-to-head, and adding a more detailed and analytical transcript of the quiz on completion so that users can go back and review their previous games to gain better insight on what to improve.

Diagram of Alexa's behaviour:
![Diagram](/diagram.png)

### User Stories

```
As a user
So that I can start using the skill
I want to be greeted by Alexa

As a user
So that I can train my Maths skills
I want Alexa to ask me randomised multiple choice Maths questions

As a user
So that I can test my Maths skills
I want to be able to answer questions

As a user
So that I can see how many questions I got right
I want to be told my score

As a user
So I know how well I did
I want to be assigned a gold, silver or bronze medal

As a user
So that I can track my progress
I want to be able to see my medals on the MangaHigh site

As a user
So that I'm asked a variation of questions
I want to not be asked the same question twice

```
