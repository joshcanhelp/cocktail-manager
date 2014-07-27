# Cocktail Manager

A little experiment in node to create a simple CRUD app to save cocktail recipes. Right now, this add can save, list, and view cocktails. 

Built with:

- Express on NodeJS
- jQuery
- Jade
- Mongoose on MongoDB
- Bootstrap v3
- Passport.js
- Underscore.js
- Async.js

**[View the live demo here »](http://cocktails-joshcanhelp.rhcloud.com/)**


## Concept

I finished an in-depth full-stack JS class in June but never had the chance to build something completely on my own. At the same time, my cocktail recipe collection was getting a little out-of-hand and was stored on [*gasp*] paper. 

This is my attempt to use what I learned to solve a very unimportant problem I was having with the JS tools I learned. Once this is is feature complete, I want to try out the major MVC frameworks to see what can be gained (or lost). Already the mish-mash of jQuery "partials" is a little unweildy so I'm guessing I can improve the maintainability a bit

## Screenshots

A few samples of what you'll see if you don't feel like installing it yourself. 

### Cocktail listing

![Cocktail Manager home page](https://dl.dropboxusercontent.com/u/64275/github/cocktail-manager-01.png)

### Cocktail editing

![Cocktail Manager edit](https://dl.dropboxusercontent.com/u/64275/github/cocktail-manager-02.png)

### Cocktail viewing

![Cocktail Manager edit](https://dl.dropboxusercontent.com/u/64275/github/cocktail-manager-03.png)

## Requirements

- `npm`
- `mongod`

## Install and run

1. `git clone git@github.com:joshcanhelp/cocktail-manager.git` or similar
2. `cd cocktail-manager`
3. `npm install`
4. `mongod --dbpath ./db`
4. `node index.js`
5. Go to http://localhost:3000 if this is on your local machine
6. Click on "Login" and you should see a message directing you to create a user. Enter your email and password twice to create the single admin user
7. After submitting, you should be logged in and able to add/edit cocktails

## Roadmap

1. Create a full testing scheme with Mocha and Chai
2. Build out the API for use with MVC frameworks
3. Add Backbone with a specific Grunt build task
4. Add Angular with a specific Grunt build task
5. Add Ember with a specific Grunt build task
