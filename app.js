// Postgres

var pg = require('pg');

var config = process.env.DATABASE_URL || {
  user: '', //env var: PGUSER
  database: 'wdiconfapi', //env var: PGDATABASE
  password: '', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

if (typeof process.env.DATABASE_URL !== 'undefined') {
  pg.defaults.ssl = true;
}


// Express.js

var express = require('express');
var app = express();
var url = require('url');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(express.static(__dirname + '/public'));

// Controller
require('./controllers/application_controller')(app,pg,config);


// Passport stuff
app.use(passport.initialize());

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var  opts = {};
opts.secretOrKey = 'secret';
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
passport.use(new JwtStrategy(opts, function(jwt_payload, done){
  
  // SQL query string
  var query = "SELECT * FROM Users WHERE id='" + jwt_payload.id + "'";

  // Retrieve data from Postgres and sent response to client
  var client = new pg.Client(config);
  client.connect(function (err) {
    client.query(query, function (err, result) {
      if(!err) {
        if (result.rows.length > 0) {
          return done(null, result.rows[0]);
        }
        else {
          return done(null, false);
        }
      }
      client.end();
    });
  });

}));


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});



// Socket.io

var io = require('socket.io')(server);

io.on('connection', function(socket){

  socket.on('disconnect', function() {

  });
});