module.exports = function(app,pg,config){

  // GET '/api/users'
  app.get('/api/users', function(req, res) {
    // SQL query string
    var query = "SELECT Users.id, Users.first_name, Users.last_name, Users.email, Users.username FROM Users";

    // Remove keys that are not valid
    keys = Object.keys(req.query);
    keys.filter(function(key) {
      ['id', 'first_name', 'last_name', 'email', 'username', 'event_id'].includes(key);
    });

      // If user is looking for users using event_id, join with Events_Users table
    if ( keys.includes('event_id') ) {
      query += " LEFT JOIN Events_Users ON Users.id=Events_Users.user_id";
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

  // GET '/api/users/:id'
  app.get('/api/users/:id', function(req, res) {
    // SQL query string
    var  query = "SELECT id, first_name, last_name, email, username FROM Users WHERE id=" + req.params.id;

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