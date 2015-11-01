PouchDB = require('pouchdb');

exports.index = function(req, res, next) {
   removeFeedFromList({
      url: req.query.url
   });
   res.send('ok');
   res.end();
};

removeFeedFromList = function(data) {
   var db = new PouchDB('http://localhost:5984/feed_urls');
   db.get(data.url).then(function (doc) {
      console.log('deleting');
      console.log(doc);
      db.remove(doc);
   }).catch(function (err) {
      console.log('deleting failed');
   });
}
