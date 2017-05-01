var express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local'),
    session       = require('express-session'),
    Campground    = require('./models/campground'),
    Comment       = require('./models/comment'),
    User          = require('./models/user');

// Express config
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose config
mongoose.connect('mongodb://localhost/yelp-camp');

// Passport config
app.use(session({
  secret: 'I love lamp',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

// Register
app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
  var newUser = new User({username: req.body.username});
  var password = req.body.password;
  User.register(newUser, password, function(err, user) {
    if (err) return res.redirect('/register');
    passport.authenticate('local')(req, res, function(err) {
      if (err) return res.redirect('/register');
      res.redirect('/');
    });
  });
});

// Login
app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// Logout
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(3000);