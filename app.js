/// <reference path="typings/node/node.d.ts"/>
var express = require('express');
var router = express.Router();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb')
var monk = require('monk')

var app = express();

//------------------------------------------------
// ROUTES
//------------------------------------------------

var routes = require('./controllers/index');
var users = require('./controllers/users');
var emojis = require('./controllers/emojis');
var recipes = require('./controllers/recipes');
var tags = require('./controllers/tags');
var api = require('./controllers/api');

var fs   = require('fs');

//------------------------------------------------
// CONFIG
//------------------------------------------------

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

var envVariables = process.env.NODE_ENV == null || process.env.NODE_ENV == 'dev' ? config.development : config.production;
app.set('environment', envVariables);

//------------------------------------------------
// VIEWS
//------------------------------------------------

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//------------------------------------------------
// MIDDLEWARE
//------------------------------------------------
// var mongoUri = process.env.MONGOLAB_URI ||
//   process.env.MONGOHQ_URL ||
//   'localhost:27017/enodji';

var mongoUri = "mongodb://heroku_app28970936:ms2e85fl7oj0vceff303tfruvc@ds051378.mongolab.com:51378/heroku_app28970936"

var db = monk(mongoUri)

app.use(function(req, res, next) {
    req.db = db;
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);
app.use('/users', users);
app.use('/emojis', emojis);
app.use('/recipes', recipes);
// app.use('/tags', tags);
app.use('/api', api);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
