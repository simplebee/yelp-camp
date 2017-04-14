var express = require('express');
var app = express();

var campground = [
  {name: 'Lake Arvid', image: 'https://images.pexels.com/photos/188940/pexels-photo-188940.jpeg?h=350&auto=compress&cs=tinysrgb'},
  {name: 'Welchstad', image: 'https://images.pexels.com/photos/198979/pexels-photo-198979.jpeg?h=350&auto=compress&cs=tinysrgb'},
  {name: 'Fidelport', image: 'https://images.pexels.com/photos/192518/pexels-photo-192518.jpeg?h=350&auto=compress&cs=tinysrgb'},
  {name: 'East Stefanie', image: 'https://images.pexels.com/photos/48638/pexels-photo-48638.jpeg?h=350&auto=compress&cs=tinysrgb'}
];

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('landing');
});

app.get('/campground', function(req, res) {
  res.render('campground', {campground: campground});
});

app.listen(3000);