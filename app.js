var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose schema and models
mongoose.connect('mongodb://localhost/yelp-camp');

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

app.get('/', function(req, res) {
  res.render('landing');
});

// Index
app.get('/campground', function(req, res) {
  Campground.find(function(err, campgroundData) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {campgroundData: campgroundData});
    }
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
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campground');
    }
  });
});

// Show
app.get('/campground/:id', function(req, res) {
  var id = req.params.id;
  Campground.findById(id, function(err, campgroundData) {
    if (err) {
      console.log(err);
    } else {
      res.render('show', {campgroundData: campgroundData});
    }
  });
});

app.listen(3000);