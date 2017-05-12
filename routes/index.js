var express   = require('express');
var router    = express.Router();
var passport  = require('passport');
var User      = require('../models/user');

// Landing
router.get('/', function(req, res) {
  res.render('landing');
});

// Register
router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  var newUser = new User({username: req.body.username});
  var password = req.body.password;
  User.register(newUser, password, function(err) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/register');
    }
    passport.authenticate('local')(req, res, function(err) {
      if (err) console.error(err);
      req.flash('success', 'Welcome to Yelp Camp');
      res.redirect('/');
    });
  });
});

// Login
router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// Logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;