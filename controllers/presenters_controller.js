module.exports = function(app,pg,config){

  // GET '/presenters'
  app.get('/presenters', function(req, res) {
    // SQL query string
    var query = "SELECT * FROM Presenters ORDER BY id DESC";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('presenters/index', {presenters: result.rows});
        }
        client.end();
      });
    });
  });

  // GET '/presenters/new'
  app.get('/presenters/new', function(req, res) {
    res.render('presenters/new');
  });

  // GET '/presenters/:id'
  app.get('/presenters/:id', function(req, res) {
    // SQL query string
    var  query = "SELECT * FROM Presenters WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('presenters/show', {presenter: result.rows[0]});
        }
        client.end();
      });
    });
  });

  // GET '/presenters/:id/edit'
  app.get('/presenters/:id/edit', function(req, res) {
    // SQL query string
    var  query = "SELECT * FROM Presenters WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('presenters/edit', {presenter: result.rows[0]});
        }
        client.end();
      });
    });
  });

  // POST '/presenters'
  app.post('/presenters', function(req, res) {
    var keys = Object.keys(req.body);
    values_array = keys.map(function (key) {
      return "'" + req.body[key] + "'";
    });

    // SQL query string
    var  query = "INSERT INTO Presenters (" + keys.join(", ") + ") VALUES (" + values_array.join(", ") + ")";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.redirect('/presenters');
        }
        client.end();
      });
    });
  });

  // PUT '/presenters/:id'
  app.put('/presenters/:id', function(req, res) {
    param_array = Object.keys(req.body).map(function (key) {
      return key + "='" + req.body[key] + "'";
    });

    // SQL query string
    var  query = "UPDATE Presenters SET " + param_array.join(", ") + " WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.redirect('/presenters/' + req.params.id);
        }
        client.end();
      });
    });
  });

  // DELETE '/presenters/:id'
  app.delete('/presenters/:id', function(req, res) {
    // SQL query string
    var  query = "DELETE FROM Events_Presenters WHERE presenter_id=" + req.params.id;
    var  query2 = "DELETE FROM Presenters WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        client.query(query2, function (err, result) {
          if(!err) {
            res.redirect('/presenters');
          }
          client.end();
        });
      });
    });
  });

};

