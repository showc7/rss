PouchDB = require('pouchdb');
config = require('../../config');
database = require('../../helpers/database');

exports.index = function(req, res, next, page, second) {
   database.getFeedsList(function(data) {
      res.send(data);
      res.end();
   });
};
