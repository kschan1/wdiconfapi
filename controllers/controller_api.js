var Request = require('./request.js');

module.exports = function(app,pg,config,table){

  // GET '/api/#table.name'
  app.get('/api/:table_name', function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in table)) res.redirect('/');
    var request = new Request(req.query,table[table_name]);

    switch(table_name) {
    case 'events':
      // If user is looking for presenters using event_id, join with Events_Presenters table
      if (!!req.query.presenter_id) {
        request.conditions.push("presenter_id=$" + (request.param_values.length + 1) + "");
        request.param_values.push(req.query.presenter_id);
        request.sql_query += " LEFT JOIN Events_Presenters ON Events.id=Events_Presenters.event_id";
      }
      // If user is looking for users using event_id, join with Events_Users table
      if (!!req.query.user_id) {
        request.conditions.push("user_id=$" + (request.param_values.length + 1) + "");
        request.param_values.push(req.query.user_id);
        request.sql_query += " LEFT JOIN Events_Users ON Events.id=Events_Users.event_id";
      }
      break;
    case 'presenters':
      // If presenter is looking for presenters using event_id, join with Events_Presenters table
      if (!!req.query.event_id) {
        request.conditions.push("event_id=$" + (request.param_values.length + 1) + "");
        request.param_values.push(req.query.event_id);
        request.sql_query += " LEFT JOIN Events_Presenters ON Presenters.id=Events_Presenters.presenter_id";
      }
      break;
    case 'users':
      // If user is looking for users using event_id, join with Events_Users table
      if (!!req.query.event_id) {
        request.conditions.push("event_id=$" + (request.param_values.length + 1) + "");
        request.param_values.push(req.query.event_id);
        request.sql_query += " LEFT JOIN Events_Users ON Users.id=Events_Users.user_id";
      }
      break;
    default:
    }

    request.build_sql();
    request.send_json(pg,config,res);
  });

  // GET '/api/#table.name/:id'
  app.get('/api/:table_name/:id', function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in table)) res.redirect('/');
    var query = {id: req.params.id};
    var request = new Request(query,table[table_name]);
    request.build_sql();
    request.send_json(pg,config,res);
  });

};