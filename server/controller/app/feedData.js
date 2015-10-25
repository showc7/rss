var request = require("request")

exports.index = function(req, res, url) {
    //url = 'http://habrahabr.ru/rss/interesting/';
    getData(url,function (data) {
      res.send(data);
      res.end();
   });
};

getData = function(url,callback) {
   request("http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=20&q=http://habrahabr.ru/rss/interesting/", function(error, response, body) {
      callback((JSON.parse(body)).responseData);
   });
}
