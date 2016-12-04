var Request = require('./request.js');

module.exports = function(app,pg,config,table){

  // GET '/all'
  app.get('/all', function(req, res) {
    res.render('models/all', {table_names: Object.keys(table)});
  });

  // GET '/:table_name'
  app.get('/:table_name', function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in table)) res.redirect('/');
    var request = new Request(req.query,table[table_name]);
    request.build_sql();
    request.render_ejs('models/index',pg,config,res);
  });

  // GET '/:table_name/new'
  app.get('/:table_name/new', function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in table)) res.redirect('/');
    res.render('models/new',{table: table[table_name]});
  });

  // GET '/:table_name/:id'
  app.get('/:table_name/:id', function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in table)) res.redirect('/');
    var request = new Request(req.params,table[table_name]);
    request.build_sql();
    request.render_ejs('models/show',pg,config,res);
  });

  // GET '/:table_name/:id/edit'
  app.get('/:table_name/:id/edit', function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in table)) res.redirect('/');
    var request = new Request(req.params,table[table_name]);
    request.build_sql();
    request.render_ejs('models/edit',pg,config,res);
  });

  // POST '/:table_name'
  app.post('/:table_name', function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in table)) res.redirect('/');
    var request = new Request(req.body,table[table_name]);
    request.build_sql_post();
    request.redirect('/' + table_name,pg,config,res);
  });

  // PUT '/:table_name/:id'
  app.put('/:table_name/:id', function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in table)) res.redirect('/');
    var request = new Request(req.body,table[table_name]);
    request.build_sql_put();
    var route = '/' + table_name + '/' + req.params.id;
    request.redirect(route,pg,config,res);
  });

  // DELETE '/:table_name/:id'
  app.delete('/:table_name/:id', function(req, res) {
    var table_name = req.params.table_name;
    if (!(table_name in table)) res.redirect('/');
    var request = new Request(req.params,table[table_name]);
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