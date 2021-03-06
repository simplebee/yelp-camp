require('dotenv').config();

var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var passport        = require('passport');
var LocalStrategy   = require('passport-local');
var session         = require('express-session');
var methodOverride  = require('method-override');
var flash           = require('connect-flash');
var User            = require('./models/user');

var campgroundRoute = require('./routes/campground');
var commentRoute    = require('./routes/comment');
var indexRoute      = require('./routes/index');

// Express config
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(session({
  secret: 'I love lamp',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Mongoose config
function getDatabaseUrl() {
  if (process.env.NODE_ENV === 'production') {
    return process.env.DB_PROD;
  }
  if (process.env.NODE_ENV === 'development') {
    return process.env.DB_DEV;
  } else {
    return 'mongodb://localhost/yelp-camp';
  }
}

mongoose.connect(getDatabaseUrl());

// Passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Router
app.use('/', indexRoute);
app.use('/campground', campgroundRoute);
app.use('/campground/:id/comment', commentRoute);

var port = process.env.PORT || 3000;
app.listen(port);