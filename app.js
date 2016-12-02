// Postgres

var pg = require('pg');

var config = {
  user: '', //env var: PGUSER
  database: 'wdiconfapi', //env var: PGDATABASE
  password: '', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

pg.defaults.ssl = true;

// pg.defaults.ssl = true;
// pg.connect(process.env.DATABASE_URL, function(err, client) {
//   if (err) throw err;
//   console.log('Connected to postgres! Getting schemas...');

//   client
//     .query('SELECT table_schema,table_name FROM information_schema.tables;')
//     .on('row', function(row) {
//       console.log(JSON.stringify(row));
//     });
// });


// Express.js

var express = require('express');
var app = express();
var url = require('url');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
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

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

require('./controllers/application_controller')(app,pg,config);
require('./controllers/events_controller')(app,pg,config);
require('./controllers/events_presenters_controller')(app,pg,config);
require('./controllers/events_users_controller')(app,pg,config);
require('./controllers/presenters_controller')(app,pg,config);
require('./controllers/users_controller')(app,pg,config);
require('./controllers/venues_controller')(app,pg,config);
require('./controllers/api/events_controller')(app,pg,config);
require('./controllers/api/presenters_controller')(app,pg,config);
require('./controllers/api/users_controller')(app,pg,config);
require('./controllers/api/venues_controller')(app,pg,config);


// Socket.io

var io = require('socket.io')(server);

io.on('connection', function(socket){
  
  socket.on('disconnect', function() {

  });
});


