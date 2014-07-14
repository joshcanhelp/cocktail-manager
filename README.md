# Cocktail Manager

A little experiment in node to create a simple CRUD app to save cocktail recipes. Right now, this add can save, list, and view cocktails. 

Built with:

- Express on NodeJS
- jQuery
- Jade
- Mongoose on MongoDB
- Bootstrap v3
- Underscore.js
- Async.js

**Note:** There is no admin control currently so putting this live could result in a lot of automated spam being generated.

## Concept

I finished an in-depth full-stack JS class in June but never had the chance to build something completely on my own. At the same time, my cocktail recipe collection was getting a little out-of-hand and was stored on [*gasp*] paper. 

This is my attempt to use what I learned to solve a very unimportant problem I was having with the JS tools I learned. Once this is is feature complete, I want to try out the major MVC frameworks to see what can be gained (or lost). Already the mish-mash of jQuery "partials" is a little unweildy so I'm guessing I can improve the maintainability a bit


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

## Roadmap

- Admin account and login to control form submissions
- Edit capability
- Remove capability
- Filter by tag
- Grunt
	- Sass
	- Coffeescript (maybe)
- Testing with Mocha + Chai
- Backbone
- Angular
- Ember
- Heroku instructions and hooks for easy deployment