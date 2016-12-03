module.exports = function(app,pg,config){

  // GET '/events'
  app.get('/events', function(req, res) {
    // SQL query string
    var query = "SELECT id, name, to_char(date, 'DD Month YYYY') AS date, to_char(time, 'HH12:MIAM') AS time, description, image_url, venue_id FROM Events ORDER BY id DESC";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('events/index', {events: result.rows});
        }
        client.end();
      });
    });
  });

  // GET '/events/new'
  app.get('/events/new', function(req, res) {
    res.render('events/new');
  });

  // GET '/events/:id'
  app.get('/events/:id', function(req, res) {
    // SQL query string
    var  query = "SELECT id, name, to_char(date, 'DD Month YYYY') AS date, to_char(time, 'HH12:MIAM') AS time, description, image_url, venue_id FROM Events WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('events/show', {event: result.rows[0]});
        }
        client.end();
      });
    });
  });

  // GET '/events/:id/edit'
  app.get('/events/:id/edit', function(req, res) {
    // SQL query string
    var  query = "SELECT id, name, to_char(date, 'DD Month YYYY') AS date, to_char(time, 'HH12:MIAM') AS time, description, image_url, venue_id FROM Events WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.render('events/edit', {event: result.rows[0]});
        }
        client.end();
      });
    });
  });

  // POST '/events'
  app.post('/events', function(req, res) {
    var keys = Object.keys(req.body);
    values_array = keys.map(function (key) {
      return "'" + req.body[key] + "'";
    });

    // SQL query string
    var  query = "INSERT INTO Events (" + keys.join(", ") + ") VALUES (" + values_array.join(", ") + ")";

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.redirect('/events');
        }
        client.end();
      });
    });
  });

  // PUT '/events/:id'
  app.put('/events/:id', function(req, res) {
    param_array = Object.keys(req.body).map(function (key) {
      return key + "='" + req.body[key] + "'";
    });

    // SQL query string
    var  query = "UPDATE Events SET " + param_array.join(", ") + " WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(!err) {
          res.redirect('/events/' + req.params.id);
        }
        client.end();
      });
    });
  });

  // DELETE '/events/:id'
  app.delete('/events/:id', function(req, res) {
    // SQL query string
    var  query = "DELETE FROM Events_Presenters WHERE event_id=" + req.params.id;
    var  query2 = "DELETE FROM Events_Users WHERE event_id=" + req.params.id;
    var  query3 = "DELETE FROM Events WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        client.query(query2, function (err, result) {
          client.query(query3, function (err, result) {
            if(!err) {
              res.redirect('/events');
            }
            client.end();
          });
        });
      });
    });
  });

};

