var express = require('express');
var app = express();
var url = require('url');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

io.on('connection', function(socket){
  
  socket.on('disconnect', function() {

  });
});


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('index');
});