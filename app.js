var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment');

// Express config
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose config
mongoose.connect('mongodb://localhost/yelp-camp');

// Landing
app.get('/', function(req, res) {
  res.render('landing');
});

// Index
app.get('/campground', function(req, res) {
  Campground.find(function(err, campgroundData) {
    if (err) return console.error(err);
    res.render('index', {campgroundData: campgroundData});
  });
});

// New
app.get('/campground/new', function(req, res) {
  res.render('new');
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
      res.render('show', {campgroundData: campgroundData});
    });
});

app.listen(3000);