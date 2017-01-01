var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var handlebars = require('handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var csrf = require('csurf');
var expressValidator = require('express-validator');
var routes = require('./routes/index');
var flash = require('flash');

var app = express();

require('dotenv').load();

require('./config/passport')(passport);
var LocalStrategy = require('passport-local').Strategy;
mongoose.connect('localhost:27017/intrestapp');

//View engine

var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(session({
  secret: 'picRouter',
  resave: true,
  saveUnintialized: true,
  cookie: {secure: false,
  maxAge: 180 * 60 * 1000}
}));

app.use(flash());
app.use(csrf());
app.use(passport.initialize());
app.use(passport.session());

//Set Static
app.use(express.static(path.join(__dirname + '/public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});


//Routes

app.use('/', routes);

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:'+app.get('port')+'. Press Ctrl+C to terminate');
});

module.exports = app;
