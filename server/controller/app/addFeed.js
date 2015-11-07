PouchDB = require('pouchdb');

exports.index = function(req, res, next) {
   addToFeedsList({
      url: req.query.url,
      name: req.query.name
   });
   res.send('ok');
   res.end();
};

addToFeedsList = function(data) {
   var db = new PouchDB('http://localhost:5984/feed_urls');
   db.get(data.url).then(function() {
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
