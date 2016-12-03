var Table = require('./table.js');
var ApiRequest = require('./api_request.js');

module.exports = function(app,pg,config){
  var table = new Table('venues');
  table.get_columns(pg,config);

  // GET '/api/#table.name'
  app.get('/api/' + table.name, function(req, res) {
    var request = new ApiRequest(req,res,table);
    request.build_sql();
    request.execute(pg,config);
  });

  // GET '/api/#table.name/:id'
  app.get('/api/' + table.name + '/:id', function(req, res) {
    var request = new ApiRequest(req,res,table);
    request.sql_query += " WHERE id=$1";
    request.param_values = [req.params.id];
    request.execute(pg,config);
  });

};