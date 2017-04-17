var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');

var campgroundData = [
  {name: 'Lake Arvid', image: 'https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg'},
  {name: 'Welchstad', image: 'https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg'},
  {name: 'Fidelport', image: 'https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg'},
  {name: 'East Stefanie', image: 'https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg'},
  {name: 'Lake Arvid', image: 'https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg'},
  {name: 'Welchstad', image: 'https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg'},
  {name: 'Fidelport', image: 'https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg'},
  {name: 'East Stefanie', image: 'https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg'},
  {name: 'Lake Arvid', image: 'https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg'},
  {name: 'Welchstad', image: 'https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg'},
  {name: 'Fidelport', image: 'https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg'},
  {name: 'East Stefanie', image: 'https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg'}
];

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost/yelp-camp');

var campgroundSchema = mongoose.Schema({
  name: String,
  image: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

app.get('/', function(req, res) {
  res.render('landing');
});

app.get('/campground', function(req, res) {
  res.render('campground', {campgroundData: campgroundData});
});

app.post('/campground', function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
  campgroundData.push(newCampground);
  res.redirect('campground');
});

app.get('/campground/new', function(req, res) {
  res.render('new');
});

app.listen(3000);