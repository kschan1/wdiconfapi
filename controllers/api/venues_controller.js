module.exports = function(app,pg,config){

  // GET '/api/venues'
  app.get('/api/venues', function(req, res) {
    // SQL query string
    var query = "SELECT * FROM Venues";

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

  // GET '/venues/:id'
  app.get('/api/venues/:id', function(req, res) {
    // SQL query string
    var  query = "SELECT * FROM Venues WHERE id=" + req.params.id;

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