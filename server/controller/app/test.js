var http = require('http');

exports.index = function(req, res, next, page, second) {
    //res.send('Page: ' + page + ' Second: ' + second);

    var options = {
      host: 'habrahabr.ru',
      path: '/rss/interesting/'
    };

    callback = function(response) {
      var str = '';

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        console.log(str);
        res.send(str);
        res.end();
     });

    }

    http.request(options, callback).end();
};
