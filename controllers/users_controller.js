module.exports = function(app,pg,config){

  // GET '/users'
  app.get('/users', function(req, res) {
    // SQL query string
    var query = "SELECT * FROM Users ORDER BY id DESC";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('users/index', {users: result.rows});
        }
        client.end();
      });
    });
  });

  // GET '/users/new'
  app.get('/users/new', function(req, res) {
    res.render('users/new');
  });

  // GET '/users/:id'
  app.get('/users/:id', function(req, res) {
    // SQL query string
    var  query = "SELECT * FROM Users WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('users/show', {user: result.rows[0]});
        }
        client.end();
      });
    });
  });

  // GET '/users/:id/edit'
  app.get('/users/:id/edit', function(req, res) {
    // SQL query string
    var  query = "SELECT * FROM Users WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('users/edit', {user: result.rows[0]});
        }
        client.end();
      });
    });
  });

  // POST '/users'
  app.post('/users', function(req, res) {
    var keys = Object.keys(req.body)
    values_array = keys.map(function (key) {
      return "'" + req.body[key] + "'";
    });

    // SQL query string
    var  query = "INSERT INTO Users (" + keys.join(", ") + ") VALUES ("
      + values_array.join(", ") + ")";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.redirect('/users');
        }
        client.end();
      });
    });
  });

  // PUT '/users/:id'
  app.put('/users/:id', function(req, res) {
    param_array = Object.keys(req.body).map(function (key) {
      return key + "='" + req.body[key] + "'";
    });

    // SQL query string
    var  query = "UPDATE Users SET " + param_array.join(", ") + " WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.redirect('/users/' + req.params.id);
        }
        client.end();
      });
    });
  });

  // DELETE '/users/:id'
  app.delete('/users/:id', function(req, res) {
    // SQL query string
    var  query = "DELETE FROM Events_Users WHERE user_id=" + req.params.id;
    var  query2 = "DELETE FROM Users WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        client.query(query, function (err, result) {
          if(!err) {
            res.redirect('/users');
          }
          client.end();
        });
      });
    });
  });

};

