PouchDB = require('pouchdb');
config = require('../config');
request = require("request");

exports.addToFeedsList = function(data) {
   var db = new PouchDB(config.pouch + config.urls.feed);
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
         type: 'url'
      });
   });
}

exports.getFeedsList = function(callback) {
   var db = new PouchDB(config.pouch + config.urls.feed);
   db.allDocs({
      include_docs: true,
      descending: true
   }, function(err, doc) {
      console.log(doc.rows);
      data = doc.rows;
      callback(data);
   });
}

exports.getData = function(url, callback) {
   var newUrl = url.replace(/:/g,'_').replace(/\//g,'_').replace(/\./g,'_');
   var db = new PouchDB(config.pouch + '/' + newUrl);
   db.allDocs({
      include_docs: true,
      descending: true
   }, function (err, doc){
      console.log(doc.rows.length);
      if(!doc.rows.length) {
         console.log('first request');
         exports.performRequest(db, url, callback, null);
      } else {
         //performRequest(db, url, callback, null);
         callback(doc.rows);
      }
   });
}

exports.performRequest = function(db, url, callback, rev) {
   console.log(config.urls.google.ajax_api + url);
   request(config.urls.google.ajax_api + url, function(error, response, body) {
      var newUrl = url.replace(/:/g,'_').replace(/\//g,'_').replace(/\./g,'_');
      exports.setRequestTimestamp(newUrl);
      var data = (JSON.parse(body)).responseData;
      for(feed in data.feed.entries) {
         var newDoc = {};
         newDoc['_id'] = data.feed.entries[feed]['publishedDate'];
         for(var f in data.feed.entries[feed]) {
            newDoc[f] = data.feed.entries[feed][f];
         }
         console.log(newDoc);
         db.put(newDoc).then(function (responce) {
            console.log('response ' + response);
            db.allDocs({
               include_docs: true,
               descending: true
            }, function(err, doc) {
               console.log(err);
               data = doc.rows;
               //console.log(data);
               callback(data);
            });
         }).catch(function(err){
            console.log('err' + err);
         });
      }
   });
}

exports.removeFeedFromList = function(data) {
   var db = new PouchDB(config.pouch + config.urls.feed);
   db.get(data.url).then(function(doc) {
      console.log('deleting');
      console.log(doc);
      db.remove(doc);
   }).catch(function(err) {
      console.log('deleting failed');
   });
}

exports.setRequestTimestamp = function(database_name) {
   console.log('timestamp');
   var db = new PouchDB(config.pouch + config.requests);
   db.get(database_name, function (doc) {
      console.log('timestamp:update');
      db.put({
         _id: database_name,
         time: new Date().getTime(),
         _rev: doc._rev
      });
   }).catch(function () {
      console.log('timestamp:crete_new');
      db.put({
         _id: database_name,
         time: new Date().getTime()
      });
   });
}
