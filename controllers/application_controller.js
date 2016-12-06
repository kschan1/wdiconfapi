var jwt = require('jwt-simple');
var Table = require('./table.js');
var stripe = require("stripe")(process.env.STRIPE_TEST_SK);

module.exports = function(app,pg,config){

  // get information of all table available in postgres database and store them in table objects
  var ignore = ['password_digest'];

  var table = {};
  var sql_query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name";
  var client = new pg.Client(config);
  client.connect(function (err) {
    client.query(sql_query, function (err, result) {
      if (err) throw err;
      result.rows.forEach(function(row) {
        table[row.table_name] = new Table(row.table_name,ignore);
        table[row.table_name].get_columns(pg,config);
      });
      client.end();
    });
  });

  app.get('/signin', function(req, res) {
    res.render('signin');
  });

  app.post('/authenticate', function(req, res) {
    // SQL query string
    var query = "SELECT * FROM Users WHERE email='" + req.body.email + "'";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          if (result.rows[0].password_digest === req.body.password) {
            console.log(result.rows[0]);
            var token = jwt.encode(result.rows[0], 'secret');
            res.json({success: true, token: token});
          }
          else {
            res.status(403).send({success: false, msg: 'Authenticaton failed, wrong password.'});
          }
        }
        client.end();
      });
    });
  });

  app.get('/getinfo', function(req, res) {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      var token = req.headers.authorization.split(' ')[1];
      var decodedtoken = jwt.decode(token, 'secret');
      console.log(decodedtoken);
      return res.json({success: true, msg: 'hello '+ decodedtoken.first_name});
    }
    else {
      return res.json({success:false, msg: 'No header'});
    }
  });

  // page for payment
  app.get('/payment', function(req, res) {
    res.render('payment');
  });

  // route for processing payment
  app.post('/payment', function(req, res) {
    // Get the credit card details submitted by the form
    var token = req.body.stripeToken;

    // Create a charge: this will charge the user's card
    var charge = stripe.charges.create({
      amount: 1000, // Amount in cents
      currency: "aud",
      source: token,
      description: "Example charge"
    }, function(err, charge) {
      if (err && err.type === 'StripeCardError') {
        // The card has been declined
        console.log('payment declined');
      }
      else {
        console.log('payment successful');
        res.redirect('/all');
      }
    });
  });

  require('./controller_api')(app,pg,config,table);
  require('./controller')(app,pg,config,table);

};
