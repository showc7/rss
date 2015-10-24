var   request = require("request"),
      PouchDB = require('pouchdb');

exports.index = function(req, res) {
   url = req.query.url;
    //url = 'http://habrahabr.ru/rss/interesting/';
    getData(url,function (data) {
      res.send(data);
      res.end();
   });
};

getData = function(url,callback) {
   console.log(url);
   console.log('connect to db');
   var db = new PouchDB('http://localhost:5984/feed_data');
   console.log('getData');
   db.get(url).then(function (doc) {
      console.log('cached');
      callback(doc.responseData);
   }).catch(function (err) {
      console.log('missed');
      request("http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=" + url, function(error, response, body) {
         var data = (JSON.parse(body)).responseData;
         db.put({
            _id: url,
            responseData: data
         }).then(function(response){
            console.log('response ' + response);
         }).catch(function(err){
            console.log('err' + err);
         });
         callback(data);
      });
   });
}
