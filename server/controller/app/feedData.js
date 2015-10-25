var   request = require("request"),
      PouchDB = require('pouchdb');

exports.index = function(req, res) {
   url = req.query.url;
   console.log(url);
   getData(url,function (data) {
      res.send(data);
      res.end();
   });
};

getData = function(url,callback) {
   var db = new PouchDB('http://localhost:5984/feed_data');
   db.get(url).then(function (doc) {
      console.log('cached');
      now = new Date();
      console.log(doc);
      if(doc.date + 5 * 60 * 1000 <= now.getTime()) {
         performRequest(db,url,callback,doc._rev);
         return;
      }
      callback(doc.responseData);
   }).catch(function (err) {
      console.log('missedD');
      performRequest(db,url,callback,null);
   });
}

performRequest = function(db,url,callback, rev) {
   request("http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=" + url, function(error, response, body) {
      var data = (JSON.parse(body)).responseData;
      newDoc = {
         _id: url,
         responseData: data,
         date: new Date().getTime()
      };
      if(rev !== null) {
         newDoc._rev = rev;
      }
      db.put(newDoc).then(function(response){
         console.log('response ' + response);
      }).catch(function(err){
         console.log('err' + err);
      });
      callback(data);
   });
}
