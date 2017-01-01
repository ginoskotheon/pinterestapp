var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var User = require('../models/user');
var Picstore = require('../models/picstore');
var MyPicstore = require('../models/mypicstore');

var passportTwitter = require('../config/passport');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var router = express.Router();

router.use(csrf());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

var pics = [
  {
    title: 'Orange Tree',
    source: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/orange-tree.jpg'
  },
  {
    title: 'Submerged',
    source: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/submerged.jpg'
  },
  {
    title: 'Lookout',
    source: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/look-out.jpg'
  },
  {
    title: 'One World Trade',
    source: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/one-world-trade.jpg'
  },
  {
    title: 'Drizzle',
    source: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/drizzle.jpg'
  },
  {
    title: 'Cat Nose',
    source: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/cat-nose.jpg'
  },
  {
    title: 'Contrail',
    source: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/contrail.jpg'
  },
  {
    title: 'Golden Hour',
    source: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/golden-hour.jpg'
  },
  {
    title: 'Flight Formation',
    source: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/flight-formation.jpg'
  },
  {
    title: 'Steampunk Forklift',
    source: 'https://cdna2.artstation.com/p/assets/images/images/000/566/702/large/william-mcdonald-liftinactionfinal.jpg?1426985192'
  },


];



router.get('/', function(req, res, next){
    Picstore.find().then(function(data){
      var realpics = data;
    res.render('index', {data: realpics});
  });
});

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/home',
    failureRedirect: '/login'
  }));



router.get('/home', isLoggedIn, function(req, res, next){
  var user = req.user._id;

  Picstore.find().then(function(data){
    // console.log(data);
    var realpics = data;

    res.render('home', {data: realpics,  csrfToken: req.csrfToken()});
  });

});

router.get('/mymacs', isLoggedIn, function(req, res, next){
  var user = req.user._id;
  // console.log(user);
  MyPicstore.find({user: user}).then(function(data){
    // console.log(data);
    var realpics = data;

    res.render('mymacs', {data: realpics, csrfToken: req.csrfToken()});
  });
});


router.post('/newpic', isLoggedIn, function(req,res,next){

  var title = req.body.title;
  console.log(title);
  var src = req.body.src;
  var newpic = {
    user: req.user,
    url: src,
    title: title
  }
  var newpicstore = new Picstore(newpic);
  newpicstore.save();
  var newmypicstore = new MyPicstore(newpic);
  newmypicstore.save();
  res.redirect('/home')
});



router.delete('/mymacs/:title', isLoggedIn, function(req, res, next){
  var id = req.user;
  console.log(id);
  var title =req.params.title
    console.log(title);
    MyPicstore.find({user: id, title: title}).remove(function(err, data){
      if (err) throw err;
      console.log(JSON.stringify(data));
      
    });
  Picstore.find({user: id, title: title}).remove(function(err, data){
    if (err) throw err;
    console.log(JSON.stringify(data));
    res.json(data);
  });


});




// router.use('/', function(req, res, next){
//   next();
// });





router.get('/register', function(req, res){
  var messages = req.flash('error');
  res.render('register', { title: 'register', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/register', passport.authenticate('local.signup', {
  successRedirect: '/home',
  failureRedirect: '/register',
  failureFlash: true
}));

router.get('/login', function(req, res){
  var messages = req.flash('error');
  res.render('login', { title: 'login', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/login', passport.authenticate('local.signin', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});


module.exports = router;


function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
  res.redirect('/');
}

function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
  return next();
  }
  res.redirect('/');
}
