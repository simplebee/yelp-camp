var Campground = require('../models/campground');
var Comment = require('../models/comment');

exports.checkLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};

exports.checkCampgroundAuthor = function (req, res, next) {
  Campground.findById(req.params.id, function(err, campgroundData) {
    if (err) return console.error(err);
    if (campgroundData.author._id.equals(req.user._id)) {
      next();
    } else {
      res.redirect('back');
    }
  });
};

exports.checkCommentAuthor = function (req, res, next) {
  Comment.findById(req.params.comment_id, function(err, commentData) {
    if (err) return console.error(err);
    if (commentData.author._id.equals(req.user._id)) {
      next();
    } else {
      res.redirect('back');
    }
  });
};