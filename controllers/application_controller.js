var jwt = require('jwt-simple');
var Table = require('./table.js');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var stripe = require("stripe")(process.env.STRIPE_TEST_SK);

module.exports = function(app,passport,pg,config){

  // show the login form
  app.get('/', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/tables', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // JWT Stuff

  app.get('/signin', function(req, res) {
    res.render('signin');
  });

  app.post('/signup', function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      var password_digest = hash;
    
      column_keys = [
        'first_name',
        'last_name',
        'email',
        'password_digest',
        'image_url'
      ];

      var param_values = [
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        password_digest,
        'http://placehold.it/150x150'
      ];

      var sql_query = "INSERT INTO Users (" + column_keys.join(", ") + ") VALUES ($1, $2, $3, $4, $5)";

      // console.log(sql_query);
      // console.log(param_values);
      // console.log(req.body);

      // Retrieve data from Postgres and sent response to client
      var client = new pg.Client(config);
      client.connect(function (err) {
        client.query(sql_query, param_values, function (err, result) {
          // console.log("err = " + err);
          // console.log(result);
          if(err) {
            res.json({success: false, msg: 'Sign up failed.', err: err});
          }
          else {
            res.json({success: true, msg: 'Redirect to profile.'});
          }
          client.end();
        });
      });      
    });
  });

  app.post('/authenticate', function(req, res) {
    var post_res = res;
    // SQL query string
    var query = "SELECT * FROM Users WHERE email=$1";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, [req.body.email], function (err, result) {
        if(!err && result.rows.length > 0) {
          bcrypt.compare(req.body.password, result.rows[0].password_digest, function(err, verified) {
            if (verified) {
              // console.log(result.rows[0]);
              var token = jwt.encode(result.rows[0], 'secret');
              res.json({success: true, token: token});
            }
            else {
              res.json({success: false, msg: 'Authenticaton failed, wrong password.'});
            }
          });
        }
        else {
          res.json({success: false, msg: 'Authenticaton failed, invalid username.'});
        }
        client.end();
      });
    });
  });

  app.get('/getinfo', function(req, res) {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      // console.log(req.headers.authorization);
      var token = req.headers.authorization.split(' ')[1];
      var user = jwt.decode(token, 'secret');
      delete user.password_digest;
      return res.json({success: true, user: user});
    }
    else {
      return res.json({success:false, msg: 'Not logged in.'});
    }
  });

  // check for ticket purchase
  app.get('/checkforticket', function(req, res) {
    var token = req.headers.authorization.split(' ')[1];
    var decodedtoken = jwt.decode(token, 'secret');

    var sql_query = "SELECT * FROM tickets WHERE user_id = " + decodedtoken.id
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(sql_query, function (err, result) {
        if (err) {
          throw err;
        }
        if (result.rows.length === 0 ) {
          return res.json({ticket: false});
        }
        else {
          return res.json({ticket: true, ticketNumber: result.rows[0].ticket_number});
        }
        client.end();
      });
    });


  });

  // page for payment
  app.get('/payment', function(req, res) {
    res.render('payment');
  });

  // route for processing payment
  app.post('/payment', function(req, res) {
    // Get the credit card details submitted by the form
    console.log(req.body);
    console.log(req.headers);
    var token = req.body.stripeToken;

    // Create a charge: this will charge the user's card
    var charge = stripe.charges.create({
      amount: 1000, // Amount in cents
      currency: "aud",
      source: token,
      description: "Example charge"
    }, function(err, charge) {
      if (err && err.type === 'StripeCardError') {
        return res.json({success:false, msg: 'Declined'});

      }
      else {
        var token = req.headers.authorization.split(' ')[1];
        var decodedtoken = jwt.decode(token, 'secret');
        var min = 100000;
        var max = 999999;
        var ticketNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        var sql_query = "INSERT INTO Tickets(ticket_number, user_id) VALUES (" + ticketNumber + ", " + decodedtoken.id + ");"
        var client = new pg.Client(config);
        client.connect(function (err) {
          client.query(sql_query, function (err, result) {
            if (err)  {
              console.log(err)
              throw err;
            }
            client.end();
          });
        });

        return res.json({success:true, msg: 'Success'});
      }
    });
  });

  // get information of all table available in postgres database and store them in table objects
  var ignore = ['password_digest'];

  var tables = {};
  var sql_query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name";
  var client = new pg.Client(config);
  client.connect(function (err) {
    client.query(sql_query, function (err, result) {
      if (err) throw err;
      result.rows.forEach(function(row) {
        tables[row.table_name] = new Table(row.table_name,ignore);
        tables[row.table_name].get_columns(pg,config);
      });
      client.end();
    });
  });

  // Table routes
  require('./controller_api')(app,pg,config,tables);
  require('./controller_tables')(app,pg,config,tables,passport);
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
