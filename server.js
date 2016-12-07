var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var pg = require('pg');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var flash = require('connect-flash');
var methodOverride = require('method-override');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');

var configDB = require('./config/database.js');
if (typeof process.env.DATABASE_URL !== 'undefined') {
  pg.defaults.ssl = true;
}

// Global
app.locals.stripeTestPK = process.env.STRIPE_TEST_PK;

app.use(express.static(__dirname + '/public'));

// Express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(morgan('dev'));

app.set('view engine', 'ejs');

// Express middleware: for passport
app.use(flash());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Launch
app.listen(port, function () {
  console.log('Server listening at port %d', port);
});


// Routes & controllers
require('./controllers/application_controller')(app,passport,pg,configDB);


// Passport
require('./config/passport')(passport,pg,configDB); // pass passport for configuration
