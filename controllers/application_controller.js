var jwt = require('jwt-simple');

module.exports = function(app,pg,config){

  // GET '/'
  app.get('/admin', function(req, res) {
    res.render('admin');
  });

  // // GET '/events'
  // app.get('/events', function(req, res) {
  //   // SQL query string
  //   var query = "SELECT id, name, to_char(date, 'DD Month YYYY') AS date, to_char(time, 'HH12:MIAM') AS time, description, venue_id FROM Events ORDER BY id DESC";

  //   // Retrieve data from Postgres and sent response to client
  //   var client = new pg.Client(config);
  //   client.connect(function (err) {
  //     client.query(query, function (err, result) {
  //       if(!err) {
  //         res.render('events/index', {events: result.rows});
  //       }
  //       client.end();
  //     });
  //   });
  // });

  app.post('/authenticate', function(req, res) {
    // SQL query string
    var query = "SELECT * FROM Users WHERE email='" + req.body.email + "'";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          if (result.rows[0].password_digest === req.body.password) {
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
      return res.json({success: true, msg: 'hello '+ decodedtoken.name});
    }
    else {
      return res.json({success:false, msg: 'No header'});
    }
  });

};