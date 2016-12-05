var Request = require('./request.js');

module.exports = function(app,pg,config,tables,passport){

  // GET '/tables'
  app.get('/tables', isLoggedIn, function(req, res) {
    res.render('tables', {table_names: Object.keys(tables)});
  });

  // GET '/tables/:table_name'
  app.get('/tables/:table_name', isLoggedIn, function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in tables)) res.redirect('/tables');
    var request = new Request(req.query,tables[table_name]);
    request.build_sql();
    request.render_ejs('tables/index',pg,config,res);
  });

  // GET '/tables/:table_name/new'
  app.get('/tables/:table_name/new', isLoggedIn, function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in tables)) res.redirect('/tables');
    res.render('tables/new',{table: tables[table_name]});
  });

  // GET '/tables/:table_name/:id'
  app.get('/tables/:table_name/:id', isLoggedIn, function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in tables)) res.redirect('/tables');
    var request = new Request(req.params,tables[table_name]);
    request.build_sql();
    request.render_ejs('tables/show',pg,config,res);
  });

  // GET '/tables/:table_name/:id/edit'
  app.get('/tables/:table_name/:id/edit', isLoggedIn, function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in tables)) res.redirect('/tables');
    var request = new Request(req.params,tables[table_name]);
    request.build_sql();
    request.render_ejs('tables/edit',pg,config,res);
  });

  // POST '/tables/:table_name'
  app.post('/tables/:table_name', isLoggedIn, function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in tables)) res.redirect('/tables');
    var request = new Request(req.body,tables[table_name]);
    request.build_sql_post();
    request.redirect('/' + table_name,pg,config,res);
  });

  // PUT '/tables/:table_name/:id'
  app.put('/tables/:table_name/:id', isLoggedIn, function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in tables)) res.redirect('/tables');
    var request = new Request(req.body,tables[table_name]);
    request.build_sql_put();
    var route = '/' + table_name + '/' + req.params.id;
    request.redirect(route,pg,config,res);
  });

  // DELETE '/tables/:table_name/:id'
  app.delete('/tables/:table_name/:id', isLoggedIn, function(req, res) {
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
      request.three_queries_sql(sql_query,sql_query2,'/' + table_name,pg,config,res);
      break;
    case 'presenters':
      sql_query = "DELETE FROM events_presenters WHERE presenter_id=" + req.params.id;
      request.build_sql_delete();
      request.two_queries_sql(sql_query,'/' + table_name,pg,config,res);
      break;
    case 'users':
      // SQL query string
      sql_query = "DELETE FROM events_users WHERE user_id=" + req.params.id;
      request.build_sql_delete();
      request.two_queries_sql(sql_query,'/' + table_name,pg,config,res);
      break;
    case 'venues':
      sql_query = "UPDATE events SET venue_id=NULL WHERE venue_id=" + req.params.id;
      request.build_sql_delete();
      request.two_queries_sql(sql_query,'/' + table_name,pg,config,res);
      break;
    default:
      request.build_sql_delete();
      request.redirect('/' + table_name,pg,config,res);
    }
  });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  console.log(req.headers);

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}