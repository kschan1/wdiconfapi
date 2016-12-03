var Table = require('./table.js');
var ApiRequest = require('./api_request.js');

module.exports = function(app,pg,config){
  var table = new Table('presenters');
  table.get_columns(pg,config);

  // GET '/api/#table.name'
  app.get('/api/' + table.name, function(req, res) {
    var request = new ApiRequest(req,res,table);

    // If presenter is looking for presenters using event_id, join with Events_Users table
    if (!!req.query.event_id) {
      request.conditions.push("event_id=$" + (request.param_values.length + 1) + "");
      request.param_values.push('event_id');
      request.sql_query += " LEFT JOIN Events_Users ON Users.id=Events_Users.presenter_id";
    }

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