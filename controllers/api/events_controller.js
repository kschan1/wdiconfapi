var Table = require('./table.js');
var ApiRequest = require('./api_request.js');

var sql_initial = "SELECT Events.id, Events.name, to_char(Events.date, 'DD Month YYYY') AS date, to_char(Events.time, 'HH12:MIAM') AS time, Events.description, Events.image_url, Events.venue_id FROM Events";

module.exports = function(app,pg,config){
  var table = new Table('events');
  table.get_columns(pg,config);

  // GET '/api/#table.name'
  app.get('/api/' + table.name, function(req, res) {
    var request = new ApiRequest(req,res,table);
    request.sql_query = sql_initial;

    // If user is looking for presenters using event_id, join with Events_Presenters table
    if (!!req.query.presenter_id) {
      request.conditions.push("presenter_id=$" + (request.param_values.length + 1) + "");
      request.param_values.push('presenter_id');
      request.sql_query += " LEFT JOIN Events_Presenters ON Events.id=Events_Presenters.event_id";
    }
    // If user is looking for users using event_id, join with Events_Users table
    if (!!req.query.user_id) {
      request.conditions.push("user_id=$" + (request.param_values.length + 1) + "");
      request.param_values.push('user_id');
      request.sql_query += " LEFT JOIN Events_Users ON Events.id=Events_Users.event_id";
    }

    request.build_sql();
    request.execute(pg,config);
  });

  // GET '/api/#table.name/:id'
  app.get('/api/' + table.name + '/:id', function(req, res) {
    var request = new ApiRequest(req,res,table);
    request.sql_query = sql_initial + " WHERE id=$1";
    request.param_values = [req.params.id];
    request.execute(pg,config);
  });

};
