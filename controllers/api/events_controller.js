module.exports = function(app,pg,config){

  // GET '/api/events'
  app.get('/api/events', function(req, res) {
    // SQL query string
    var query = "SELECT Events.id, Events.name, to_char(Events.date, 'DD Month YYYY') AS date, to_char(Events.time, 'HH12:MIAM') AS time, Events.description, Events.venue_id FROM Events";

    // Remove keys that are not valid
    keys = Object.keys(req.query);
    keys.filter(function(key) {
      ['id', 'name', 'date', 'time', 'venue_id', 'presenter_id', 'user_id'].includes(key);
    });

    // If user is looking for events using presenter_id, join with Presenters_Users table
    if ( keys.includes('presenter_id') ) {
      query += " LEFT JOIN Events_Presenters ON Events.id=Events_Presenters.event_id"
    }
    // If user is looking for events using user_id, join with Events_Users table
    if ( keys.includes('user_id') ) {
      query += " LEFT JOIN Events_Users ON Events.id=Events_Users.event_id"
    }

    // Add valid keys to the SQL query string
    if (keys.length > 0) {
      param_array = keys.map(function (key) {
        return key + "='" + req.query[key] + "'";
      });
      query += " WHERE " + param_array.join(", ");
    }

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(err) {res.json({Response: "False"});}
        else {res.json({Results: result.rows, Response: "True"});}
        client.end();
      });
    });
  });

  // GET '/api/events/:id'
  app.get('/api/events/:id', function(req, res) {
    // SQL query string
    var  query = "SELECT id, name, to_char(date, 'DD Month YYYY') AS date, to_char(time, 'HH12:MIAM') AS time, description, venue_id FROM Events WHERE id=" + req.params.id;

    // Retrieve data from Postgres and sent response to client
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(query, function (err, result) {
        if(err) {res.json({Response: "False"});}
        else {res.json({Results: result.rows, Response: "True"});}
        client.end();
      });
    });
  });

};