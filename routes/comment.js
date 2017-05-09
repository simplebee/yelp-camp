var express     = require('express');
var router      = express.Router({mergeParams: true});
var Campground  = require('../models/campground');
var Comment     = require('../models/comment');

// New
router.get('/new', checkLoggedIn, function(req, res) {
  var id = req.params.id;
  Campground.findById(id, function(err, campgroundData) {
    if (err) return console.error(err);
    res.render('comment/new', {campgroundData: campgroundData});
  });
});

// Create
router.post('/', checkLoggedIn, function(req, res) {
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

// Edit
router.get('/:comment_id/edit', function(req, res) {
  Comment.findById(req.params.comment_id, function(err, commentData) {
    if (err) return console.error(err);
    res.render('comment/edit', {
      commentData: commentData,
      campgroundID: req.params.id
    });
  });
});

// Update
router.put('/:comment_id', function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err) {
    if (err) return console.error(err);
    res.redirect('/campground/' + req.params.id);
  });
});

// Destroy
router.delete('/:comment_id', function(req, res) {
  var campgroundID = req.params.id;
  var commentID = req.params.comment_id;
  Comment.findByIdAndRemove(commentID, function(err) {
    if (err) return console.error(err);
    Campground.findByIdAndUpdate(campgroundID, {$pull: {comment: commentID}}, function(err) {
      if (err) return console.error(err);
      res.redirect('back');
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

module.exports = router;