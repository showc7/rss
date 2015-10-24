PouchDB = require('pouchdb');

exports.index = function(req, res, next, page, second) {
   console.log('feeds');
   getFeedsList(function(data) {
      res.send(data);
      res.end();
   });
   addToFeedsList({
      name: 'a',
      url: 'www.ololo.com/feed'
   });
};

getFeedsList = function(callback) {
   var db = new PouchDB('http://localhost:5984/feed_urls');
   db.allDocs({include_docs: true, descending: true}, function(err, doc) {
    console.log(doc.rows);
    data = doc.rows;
    callback(data);
   });
}

addToFeedsList = function(data) {
   var db = new PouchDB('http://localhost:5984/feed_urls');
   db.get(data.url).then(function () {
      // exists
      console.log('exists');
      return;
   }).catch(function(err) {
      // do not exists
      console.log('not exists');
      db.put({
         _id: data.url,
         name: data.name,
      });
   });
}
