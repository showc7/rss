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
   ws.on('message', function(msg) {
      console.log(msg);
      ws.send('OK');
   });
});

app.listen(8080);
