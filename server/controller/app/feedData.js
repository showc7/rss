var request = require("request");
PouchDB = require('pouchdb');
config = require('../../config');
database = require('../../helpers/database');

exports.index = function(req, res) {
   url = req.query.url;
   console.log(url);
   database.getData(url, function(data) {
      res.send(data);
      res.end();
   });
};
