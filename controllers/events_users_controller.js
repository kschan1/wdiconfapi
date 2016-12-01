module.exports = function(app,pg,config){

  // GET '/events_users'
  app.get('/events_users', function(req, res) {
    // SQL query string
    var query = "SELECT * FROM Events_Users ORDER BY id DESC";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('events_users/index', {events_users: result.rows});
        }
        client.end();
      });
    });
  });

  // GET '/events_users/new'
  app.get('/events_users/new', function(req, res) {
    res.render('events_users/new');
  });

  // GET '/events_users/:id'
  app.get('/events_users/:id', function(req, res) {
    // SQL query string
    var  query = "SELECT * FROM Events_Users WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('events_users/show', {events_user: result.rows[0]});
        }
        client.end();
      });
    });
  });

  // GET '/events_users/:id/edit'
  app.get('/events_users/:id/edit', function(req, res) {
    // SQL query string
    var  query = "SELECT * FROM Events_Users WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('events_users/edit', {events_user: result.rows[0]});
        }
        client.end();
      });
    });
  });

  // POST '/events_users'
  app.post('/events_users', function(req, res) {
    var keys = Object.keys(req.body)
    values_array = keys.map(function (key) {
      return "'" + req.body[key] + "'";
    });

    // SQL query string
    var  query = "INSERT INTO Events_Users (" + keys.join(", ") + ") VALUES (" 
      + values_array.join(", ") + ")";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.redirect('/events_users');
        }
        client.end();
      });
    });
  });

  // PUT '/events_users/:id'
  app.put('/events_users/:id', function(req, res) {
    param_array = Object.keys(req.body).map(function (key) {
      return key + "='" + req.body[key] + "'";
    });

    // SQL query string
    var  query = "UPDATE Events_Users SET " + param_array.join(", ") + " WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.redirect('/events_users/' + req.params.id);
        }
        client.end();
      });
    });
  });

  // DELETE '/events_users/:id'
  app.delete('/events_users/:id', function(req, res) {
    // SQL query string
    var  query = "DELETE FROM Events_Users WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.redirect('/events_users');
        }
        client.end();
      });
    });
  });

};

