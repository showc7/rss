var   express = require('express'),
      route = require('express-route-tree'),
      serveStatic = require('serve-static'),
      path = require("path");

app = express();

var expressws = require('express-ws')(app);

var staticPath = path.normalize(__dirname + '/../browser/build');
console.log(staticPath);
app.use('/static', express.static(staticPath));
app.use('/api', route(__dirname + '/controller'));

app.ws('/info', function(ws, req) {
   ws.on('open', function(msg) {
      console.log('Connected');
   });
   ws.on('message', function(msg) {
      var aWss = expressws.getWss('/info');
      aWss.clients.forEach(function (client) {
         client.send(msg);
      });
   });
});

app.listen(8080);
