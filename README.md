## quizbot-alexa

**Quizbot** is an educational app designed for Amazon Echo.

Collaborators: @AliceArmstrong, @Noora-q, @aleximm1, @ayanit1

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

#### Testing
One of the main struggles with the project was testing. Due to modernity and uniqueness of the technology, testing documentation was hard to find. After thoroughly discussing the theories of possible ways to mimic and test Alexa, we settled on using Mocha and Chai to test Alexa's behaviour by monitoring her JSON responses. Bespoken Tools allowed us to replicate the Lambda server, and Sinon allowed us to mock our project and test Ajax requests.

#### Mangahigh
* API
* Interface

#### Real-world application
* Statistics of popularity
* Visual-impairment
* Education


#### Future Improvements
Quizbot is an ever-evolving project. We plan to improve its features by adding more categories and make a more complex scoring system that takes time answering questions into account. We are also interested in adding a more competitive element by allowing users to play head-to-head.

Diagram of Alexa's behaviour:
![Diagram](/diagram.png)

#### User Stories

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
