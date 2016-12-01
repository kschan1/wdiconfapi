module.exports = function(app,pg,config){

  // GET '/'
  app.get('/admin', function(req, res) {
    res.render('admin');
  });

};