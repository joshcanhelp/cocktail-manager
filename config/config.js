/* globals module, app, process, require, console, express */
var bodyParser = require('body-parser');

module.exports = function (app, express) {
	"use strict";

	app.set('port', process.env.PORT || 3000);
	app.set('views', 'views');
	app.set('view engine', 'jade');

	app.use(express.static('dist'));
	app.use(bodyParser.json());
};