PouchDB = require('pouchdb');

exports.index = function(req, res, next, page, second) {
   getFeedsList(function(data) {
      res.send(data);
      res.end();
   });
};

getFeedsList = function(callback) {
   var db = new PouchDB('http://localhost:5984/feed_urls');
   db.allDocs({
      include_docs: true,
      descending: true
   }, function(err, doc) {
      console.log(doc.rows);
      data = doc.rows;
      callback(data);
   });
}
