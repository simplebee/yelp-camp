var express     = require('express');
var router      = express.Router();
var Campground  = require('../models/campground');
var Comment     = require('../models/comment');
var middleware  = require('../middleware');

// Index
router.get('/', function(req, res) {
  Campground.find(function(err, campgroundData) {
    if (err) return console.error(err);
    res.render('campground/index', {campgroundData: campgroundData});
  });
});

// New
router.get('/new', middleware.checkLoggedIn, function(req, res) {
  res.render('campground/new');
});

// Create
router.post('/', middleware.checkLoggedIn, function(req, res) {
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
router.get('/:id/edit', middleware.checkLoggedIn, middleware.checkCampgroundAuthor, function(req, res) {
  var id = req.params.id;
  Campground.findById(id, function(err, campgroundData) {
    if (err) return console.error(err);
    res.render('campground/edit', {campgroundData: campgroundData});
  });
});

// Update
router.put('/:id', middleware.checkLoggedIn, middleware.checkCampgroundAuthor, function(req, res) {
  var id = req.params.id;
  var updateCampground = req.body.campground;
  Campground.findByIdAndUpdate(id , updateCampground, function(err) {
    if (err) return console.error(err);
    res.redirect('/campground/' + id);
  });
});

// Destroy
router.delete('/:id', middleware.checkLoggedIn, middleware.checkCampgroundAuthor, function(req, res) {
  var id = req.params.id;
  Campground.findById(id, function(err, campgroundData) {
    if (err) return console.error(err);
    Comment.remove({_id: {$in: campgroundData.comment}}, function(err) {
      if (err) return console.error(err);
      campgroundData.remove(function(err) {
        if (err) return console.error(err);
        req.flash('success', 'Campground successfully deleted');
        res.redirect('/campground');
      });
    });
  });
});

module.exports = router;