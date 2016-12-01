module.exports = function(app,pg,config){

  // GET '/api/presenters'
  app.get('/api/presenters', function(req, res) {
    // SQL query string
    var query = "SELECT Presenters.id, Presenters.first_name, Presenters.last_name, Presenters.company, Presenters.title, Presenters.email FROM Presenters";

    // Remove keys that are not valid
    keys = Object.keys(req.query);
    keys.filter(function(key) {
      ['id', 'first_name', 'last_name', 'company', 'title', 'email', 'event_id'].includes(key);
    });

    // If user is looking for presenters using event_id, join with Events_Presenters table
    if ( keys.includes('event_id') ) {
      query += " LEFT JOIN Events_Presenters ON Presenters.id=Events_Presenters.presenter_id";
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

  // GET '/api/presenters/:id'
  app.get('/api/presenters/:id', function(req, res) {
    // SQL query string
    var  query = "SELECT * FROM Presenters WHERE id=" + req.params.id;

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