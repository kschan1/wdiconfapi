module.exports = function(app,pg,config){

  // GET '/venues'
  app.get('/venues', function(req, res) {
    // SQL query string
    var query = "SELECT * FROM Venues ORDER BY id DESC";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('venues/index', {venues: result.rows});
        }
        client.end();
      });
    });
  });

  // GET '/venues/new'
  app.get('/venues/new', function(req, res) {
    res.render('venues/new');
  });

  // GET '/venues/:id'
  app.get('/venues/:id', function(req, res) {
    // SQL query string
    var  query = "SELECT * FROM Venues WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('venues/show', {venue: result.rows[0]});
        }
        client.end();
      });
    });
  });

  // GET '/venues/:id/edit'
  app.get('/venues/:id/edit', function(req, res) {
    // SQL query string
    var  query = "SELECT * FROM Venues WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('venues/edit', {venue: result.rows[0]});
        }
        client.end();
      });
    });
  });

  // POST '/venues'
  app.post('/venues', function(req, res) {
    var keys = Object.keys(req.body)
    values_array = keys.map(function (key) {
      return "'" + req.body[key] + "'";
    });

    // SQL query string
    var  query = "INSERT INTO Venues (" + keys.join(", ") + ") VALUES ("
      + values_array.join(", ") + ")";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.redirect('/venues');
        }
        client.end();
      });
    });
  });

  // PUT '/venues/:id'
  app.put('/venues/:id', function(req, res) {
    param_array = Object.keys(req.body).map(function (key) {
      return key + "='" + req.body[key] + "'";
    });

    // SQL query string
    var  query = "UPDATE Venues SET " + param_array.join(", ") + " WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.redirect('/venues/' + req.params.id);
        }
        client.end();
      });
    });
  });

  // DELETE '/venues/:id'
  app.delete('/venues/:id', function(req, res) {
    // SQL query strings
    var  query = "UPDATE Events SET venue_id=NULL WHERE venue_id=" + req.params.id;
    var  query2 = "DELETE FROM Venues WHERE id=" + req.params.id;
    

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        client.query(query2, function (err, result) {
          if(!err) {
            res.redirect('/venues');
          }
          client.end();
        });
      });
    });
  });

};

