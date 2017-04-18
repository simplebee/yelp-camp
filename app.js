var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose schema and models
mongoose.connect('mongodb://localhost/yelp-camp');

var campgroundSchema = mongoose.Schema({
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
      res.render('campground', {campgroundData: campgroundData});
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
  var newCampground = {name: name, image: image};
  Campground.create(newCampground, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('campground');
    }
  });
});

app.listen(3000);