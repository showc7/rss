var request = require("request");
PouchDB = require('pouchdb');
config = require('../../config');
database = require('../../helpers/database');

exports.index = function(req, res) {
   url = req.query.url;
   offset = req.query.offset;
   count = req.query.count;
   console.log(url);
   database.getData(url, offset, count, function(data) {
      res.send(data);
      res.end();
   });
};
