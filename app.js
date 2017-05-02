var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var passport      = require('passport');
var LocalStrategy = require('passport-local');
var session       = require('express-session');
var User          = require('./models/user');

var campgroundRoute = require('./routes/campground');
var commentRoute    = require('./routes/comment');
var indexRoute      = require('./routes/index');

// Express config
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'I love lamp',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

// Mongoose config
mongoose.connect('mongodb://localhost/yelp-camp');

// Passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Router
app.use('/', indexRoute);
app.use('/campground', campgroundRoute);
app.use('/campground/:id/comment', commentRoute);

app.listen(3000);