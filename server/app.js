var   express = require('express'),
      route = require('express-route-tree'),
      serveStatic = require('serve-static'),
      path = require("path");

app = express();
var staticPath = path.normalize(__dirname + '/../browser/build');
console.log(staticPath);
app.use('/static', express.static(staticPath));
app.use('/api', route(__dirname + '/controller'));

app.listen(8080);
