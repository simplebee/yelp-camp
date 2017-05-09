var express     = require('express');
var router      = express.Router();
var Campground  = require('../models/campground');
var Comment  = require('../models/comment');

// Index
router.get('/', function(req, res) {
  Campground.find(function(err, campgroundData) {
    if (err) return console.error(err);
    res.render('campground/index', {campgroundData: campgroundData});
  });
});

// New
router.get('/new', checkLoggedIn, function(req, res) {
  res.render('campground/new');
});

// Create
router.post('/', checkLoggedIn, function(req, res) {
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

// Edit
router.get('/:id/edit', checkLoggedIn, checkAuthor, function(req, res) {
  var id = req.params.id;
  Campground.findById(id, function(err, campgroundData) {
    if (err) return console.error(err);
    res.render('campground/edit', {campgroundData: campgroundData});
  });
});

// Update
router.put('/:id', checkLoggedIn, checkAuthor, function(req, res) {
  var id = req.params.id;
  var updateCampground = req.body.campground;
  Campground.findByIdAndUpdate(id , updateCampground, function(err) {
    if (err) return console.error(err);
    res.redirect('/campground/' + id);
  });
});

// Destroy
router.delete('/:id', checkLoggedIn, checkAuthor, function(req, res) {
  var id = req.params.id;
  Campground.findById(id, function(err, campgroundData) {
    if (err) return console.error(err);
    Comment.remove({_id: {$in: campgroundData.comment}}, function(err) {
      if (err) return console.error(err);
      campgroundData.remove(function(err) {
        if (err) return console.error(err);
        res.redirect('/campground');
      });
    });
  });
});

function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

function checkAuthor(req, res, next) {
  var id = req.params.id; 
  Campground.findById(id, function(err, campgroundData) {
    if (err) return console.error(err);
    if (campgroundData.author._id.equals(req.user._id)) {
      next();
    } else {
      res.redirect('back');
    }
  });
}

module.exports = router;