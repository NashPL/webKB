'use strict';
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');
const redis = require('redis');
const mongoose = require('mongoose');
const redisStore = require('connect-redis')(session);
const client = redis.createClient();

const app = express();

const _UTILS = require('./application/_UTILS');

const db = JSON.parse(fs.readFileSync('/srv/webkb_mean/config/configFiles/database.json', 'utf8'));

mongoose.connect('mongodb://' + db['mongodb']['url'] + '/webKB-main');
mongoose.Promise = Promise;

app.use(session({
    secret: _UTILS.getHashedValue(),
    // create new redis store.
    store: new redisStore({
        host: 'localhost',
        port: 6379,
        client: client,
        ttl: 36000
    }),
    saveUninitialized: false,
    resave: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'views')));

require('./config/router')(app);

app.engine('html', require('ejs').renderFile)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });
module.exports = app;