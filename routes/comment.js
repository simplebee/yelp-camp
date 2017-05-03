var express     = require('express');
var router      = express.Router({mergeParams: true});
var Campground  = require('../models/campground');
var Comment     = require('../models/comment');

// New
router.get('/new',isLoggedIn, function(req, res) {
  var id = req.params.id;
  Campground.findById(id, function(err, campgroundData) {
    if (err) return console.error(err);
    res.render('comment/new', {campgroundData: campgroundData});
  });
});

// Create
router.post('/', isLoggedIn, function(req, res) {
  var id = req.params.id;
  var newComment = {
    text: req.body.comment.text,
    author: req.user
  };
  Campground.findById(id, function(err, campgroundData) {
    if (err) return console.error(err);
    Comment.create(newComment, function(err, commentData) {
      if (err) return console.error(err);
      campgroundData.comment.push(commentData);
      campgroundData.save(function (err) {
        if (err) return console.error(err);
        res.redirect('/campground/' + id);        
      });
    });
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