var express     = require('express');
var router      = express.Router();
var Campground  = require('../models/campground');

// Index
router.get('/', function(req, res) {
  console.log(res.locals);
  Campground.find(function(err, campgroundData) {
    if (err) return console.error(err);
    res.render('campground/index', {campgroundData: campgroundData});
  });
});

// New
router.get('/new', function(req, res) {
  res.render('campground/new');
});

// Create
router.post('/', function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {
    name: name,
    image: image,
    description: description
  };
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

module.exports = router;