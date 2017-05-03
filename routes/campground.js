var express     = require('express');
var router      = express.Router();
var Campground  = require('../models/campground');

// Index
router.get('/', function(req, res) {
  Campground.find(function(err, campgroundData) {
    if (err) return console.error(err);
    res.render('campground/index', {campgroundData: campgroundData});
  });
});

// New
router.get('/new', isLoggedIn, function(req, res) {
  res.render('campground/new');
});

// Create
router.post('/', isLoggedIn, function(req, res) {
  var newCampground = req.body.campground;
  newCampground.author = req.user;
  Campground.create(newCampground, function(err) {
    if (err) return console.error(err);
    res.redirect('/campground');
  });
});

// Show
router.get('/:id', function(req, res) {
  var id = req.params.id;
  Campground
    .findById(id)
    .populate('comment')
    .exec(function(err, campgroundData) {
      if (err) return console.error(err);
      res.render('campground/show', {campgroundData: campgroundData});
    });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;