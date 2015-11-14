PouchDB = require('pouchdb');
config = require('../../config');
database = require('../../helpers/database');

console.log(config);

exports.index = function(req, res, next) {
   database.addToFeedsList({
      url: req.query.url,
      name: req.query.name
   });
   res.send('ok');
   res.end();
};
