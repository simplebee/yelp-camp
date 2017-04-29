var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment'),
    User        = require('./models/user');

// Express config
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose config
mongoose.connect('mongodb://localhost/yelp-camp');

// Landing
app.get('/', function(req, res) {
  res.render('landing');
});

// Campground
// Index
app.get('/campground', function(req, res) {
  Campground.find(function(err, campgroundData) {
    if (err) return console.error(err);
    res.render('campground/index', {campgroundData: campgroundData});
  });
});

// New
app.get('/campground/new', function(req, res) {
  res.render('campground/new');
});

// Create
app.post('/campground', function(req, res) {
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
app.get('/campground/:id', function(req, res) {
  var id = req.params.id;
  Campground
    .findById(id)
    .populate('comment')
    .exec(function(err, campgroundData) {
      if (err) return console.error(err);
      res.render('campground/show', {campgroundData: campgroundData});
    });
});

// Comment
// New
app.get('/campground/:id/comment/new', function(req, res) {
  var id = req.params.id;
  Campground.findById(id, function(err, campgroundData) {
    if (err) return console.error(err);
    res.render('comment/new', {campgroundData: campgroundData});
  });
});

// Create
app.post('/campground/:id/comment', function(req, res) {
  var id = req.params.id;
  var comment = req.body.comment;
  Campground.findById(id, function(err, campgroundData) {
    if (err) return console.error(err);
    Comment.create(comment, function(err, commentData) {
      if (err) return console.error(err);
      campgroundData.comment.push(commentData);
      campgroundData.save(function (err) {
        if (err) return console.error(err);
        res.redirect('/campground/' + id);        
      });
    });
  });
});

app.listen(3000);