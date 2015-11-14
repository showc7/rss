PouchDB = require('pouchdb');
config = require('../../config');
database = require('../../helpers/database');

exports.index = function(req, res, next) {
   database.removeFeedFromList({
      url: req.query.url
   });
   res.send('ok');
   res.end();
};
