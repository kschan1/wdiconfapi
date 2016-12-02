module.exports = function(app,pg,config){

  // GET '/events_presenters'
  app.get('/events_presenters', function(req, res) {
    // SQL query string
    var query = "SELECT * FROM Events_Presenters ORDER BY id DESC";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('events_presenters/index', {events_presenters: result.rows});
        }
        client.end();
      });
    });
  });

  // GET '/events_presenters/new'
  app.get('/events_presenters/new', function(req, res) {
    res.render('events_presenters/new');
  });

  // GET '/events_presenters/:id'
  app.get('/events_presenters/:id', function(req, res) {
    // SQL query string
    var  query = "SELECT * FROM Events_Presenters WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('events_presenters/show', {events_presenter: result.rows[0]});
        }
        client.end();
      });
    });
  });

  // GET '/events_presenters/:id/edit'
  app.get('/events_presenters/:id/edit', function(req, res) {
    // SQL query string
    var  query = "SELECT * FROM Events_Presenters WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('events_presenters/edit', {events_presenter: result.rows[0]});
        }
        client.end();
      });
    });
  });

  // POST '/events_presenters'
  app.post('/events_presenters', function(req, res) {
    var keys = Object.keys(req.body);
    values_array = keys.map(function (key) {
      return "'" + req.body[key] + "'";
    });

    // SQL query string
    var  query = "INSERT INTO Events_Presenters (" + keys.join(", ") + ") VALUES (" + values_array.join(", ") + ")";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.redirect('/events_presenters');
        }
        client.end();
      });
    });
  });

  // PUT '/events_presenters/:id'
  app.put('/events_presenters/:id', function(req, res) {
    param_array = Object.keys(req.body).map(function (key) {
      return key + "='" + req.body[key] + "'";
    });

    // SQL query string
    var  query = "UPDATE Events_Presenters SET " + param_array.join(", ") + " WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.redirect('/events_presenters/' + req.params.id);
        }
        client.end();
      });
    });
  });

  // DELETE '/events_presenters/:id'
  app.delete('/events_presenters/:id', function(req, res) {
    // SQL query string
    var  query = "DELETE FROM Events_Presenters WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.redirect('/events_presenters');
        }
        client.end();
      });
    });
  });

};

