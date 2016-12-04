var jwt = require('jwt-simple');

module.exports = function(app,pg,config){

  var Table = require('./table.js');

  var table = {};
  var sql_query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public'";
  var client = new pg.Client(config);
  client.connect(function (err) {
    client.query(sql_query, function (err, result) {
      if (err) throw err;
      result.rows.forEach(function(row) {
        table[row.table_name] = new Table(row.table_name);
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

  require('./controller_api')(app,pg,config,table);
  require('./controller')(app,pg,config,table);

};