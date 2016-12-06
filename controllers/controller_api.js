var jwt = require('jwt-simple');
var Request = require('./request.js');

module.exports = function(app,pg,config,tables){

  // GET '/api'
  app.get('/api', function(req, res) {
    res.json({
      table_names: Object.keys(tables),
      table_content: tables
    });
  });

  // GET '/api/#table.name'
  app.get('/api/:table_name', function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in tables)) res.redirect('/api');
    var request = new Request(req.query,tables[table_name]);

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
    if (!(table_name in tables)) res.redirect('/api');
    var query = {id: req.params.id};
    var request = new Request(query,tables[table_name]);
    request.build_sql();
    request.send_json(pg,config,res);
  });

  // POST '/api/:table_name'
  app.post('/api/:table_name', isLoggedIn, function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in tables)) res.redirect('/tables');
    var request = new Request(req.body,tables[table_name]);
    request.build_sql_post();
    request.ajax(pg,config,res);
  });

  // PUT '/api/:table_name/:id'
  app.put('/api/:table_name/:id', isLoggedIn, function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in tables)) res.redirect('/tables');
    var request = new Request(req.body,tables[table_name]);
    request.build_sql_put();
    var route = '/' + table_name + '/' + req.params.id;
    request.ajax(pg,config,res);
  });

  // DELETE '/api/:table_name/:id'
  app.delete('/api/:table_name/:id', isLoggedIn, function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in tables)) res.redirect('/tables');
    var request = new Request(req.params,tables[table_name]);
    var sql_event;
    var sql_query2;
    switch(table_name) {
    case 'events':
      sql_query = "DELETE FROM events_presenters WHERE event_id=" + req.params.id;
      sql_query2 = "DELETE FROM events_users WHERE event_id=" + req.params.id;
      request.build_sql_delete();
      request.three_queries_ajax(sql_query,sql_query2,pg,config,res);
      break;
    case 'presenters':
      sql_query = "DELETE FROM events_presenters WHERE presenter_id=" + req.params.id;
      request.build_sql_delete();
      request.two_queries_ajax(sql_query,pg,config,res);
      break;
    case 'users':
      // SQL query string
      sql_query = "DELETE FROM events_users WHERE user_id=" + req.params.id;
      request.build_sql_delete();
      request.two_queries_ajax(sql_query,pg,config,res);
      break;
    case 'venues':
      sql_query = "UPDATE events SET venue_id=NULL WHERE venue_id=" + req.params.id;
      request.build_sql_delete();
      request.two_queries_ajax(sql_query,pg,config,res);
      break;
    default:
      request.build_sql_delete();
      request.ajax(pg,config,res);
    }
  });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    // console.log(req.headers.authorization);
    var token = req.headers.authorization.split(' ')[1];
    var decodedtoken = jwt.decode(token, 'secret');
    // console.log(decodedtoken);
    if (decodedtoken.admin) {
      return next();
    }
  }

  // if they aren't redirect them to the home page
  res.json({success: false, msg: 'Not logged in.'});
}