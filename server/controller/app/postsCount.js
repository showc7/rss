var request = require("request");
PouchDB = require('pouchdb');
config = require('../../config');
database = require('../../helpers/database');

exports.index = function(req, res) {
   url = req.query.url;
   console.log(url);
   database.getPostsCount(url, function(data) {
      res.send({
         count: data
      });
      res.end();
   });
};
