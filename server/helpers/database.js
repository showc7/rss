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

exports.getPostsCount = function(url, callback) {
   var newUrl = pregUrl(url);
   var db = new PouchDB(config.pouch + '/' + newUrl);
   db.allDocs({
      include_docs: false,
   }, function(err, doc) {
      data = doc.rows.length;
      callback(data);
   });
}

exports.getData = function(url, offset, count, callback) {
   var newUrl = pregUrl(url);
   var db = new PouchDB(config.pouch + '/' + newUrl);
   db.allDocs({
      include_docs: true,
      descending: true
   }, function (err, doc){
      console.log(doc.rows.length);
      if(!doc.rows.length) {
         console.log('first request');
         //exports.performRequest(db, url, callback, null);
         exports.performRequest(db, url, function (data){
            exports.getPagedData(db, url, offset, count, callback, null)
         });
      } else {
         //performRequest(db, url, callback, null);
         //callback(doc.rows);
         exports.getPagedData(db, url, offset, count, callback, null);
      }
   });
}

exports.getPagedData = function(db, url, offset, count, collback) {
   console.log('get paged data');
   var newUrl = pregUrl(url);
   console.log(newUrl);
   db = PouchDB(config.pouch + '/' + newUrl);
   //var reqStr = 'http://localhost:5984/' + newUrl + '/_design/all/_view/all';
   if(!offset && !count) {
      offset = 0;
      count = 4;
   }
   /*
   reqStr += '?limit=' + count;
   reqStr += '&skip=' + offset;
   request(reqStr, function (error, responce, body) {
      data = JSON.parse(body);
      console.log(data.rows);
      collback(data.rows);
   });
   */
   db.allDocs({
      skip: offset,
      limit: count,
      include_docs: true
   }, function (err, response) {
      console.log('response.rows');
      console.log(response);
      console.log(response.rows);
      collback(response.rows);
   });
}

// TODO: rev - shod be romoved
exports.performRequest = function(db, url, callback, rev) {
   console.log('request to: ' + config.urls.google.ajax_api + url);
   request(config.urls.google.ajax_api + url, function(error, response, body) {
      var newUrl = pregUrl(url);
      exports.setRequestTimestamp(newUrl,url);
      var data = (JSON.parse(body)).responseData;
      for(feed in data.feed.entries) {
         var newDoc = {};
         newDoc._id = data.feed.entries[feed]['publishedDate'];
         for(var f in data.feed.entries[feed]) {
            newDoc[f] = data.feed.entries[feed][f];
         }
         (function (newDoc) {
         console.log(newDoc.publishedDate);
         db.get(newDoc._id).then(function(doc) {
            //console.log('do not add');
            //console.log(doc._id);
            //console.log(newDoc._id);
         }).catch(function(err){
            console.log('should be added');
            db.put(newDoc).then(function (responce) {
               console.log('response ' + response);
            }).catch(function(err){
               console.log('err' + err);
               console.log(newDoc.publishedDate);
            })
         });
         })(newDoc);
      }
      db.allDocs({
         include_docs: true,
         descending: true
      }, function(err, doc) {
         console.log("err:" + err);
         data = doc.rows;
         callback(data);
      });
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

exports.setRequestTimestamp = function(database_name, _url) {
   console.log('name:' + database_name);
   console.log('timestamp');
   console.log(config.pouch + config.urls.requests);
   var db = new PouchDB(config.pouch + config.urls.requests);
   db.get(database_name, function (doc) {
      if(doc === null) {
         console.log('doc null');
         return;
      }
      console.log('timestamp:update');
      db.put({
         _id: database_name,
         time: new Date().getTime(),
         url: _url,
         _rev: doc._rev
      }).then(function(){
         console.log('timestamp updated');
      });
   }).catch(function (err) {
      //console.log(err);
      console.log('timestamp:crete_new');
      db.put({
         _id: database_name,
         time: new Date().getTime(),
         url: _url
      }).then(function(){
         console.log('timestamp created');
      });
   });
}

exports.getOldDocuments = function (callback) {
   console.log('get old documents');
   //request('http://localhost:5984/timestamps/_design/old_docs/_view/old_docs', function (error, responce, body) {
   request('http://localhost:5984/timestamps/_design/show/_view/show', function (error, responce, body) {
      console.log(body);
      if(JSON.parse(body).error) {
         console.log('creating view');
         exports.putView(function () {
            exports.getOldDocuments(callback);
         });
      }
      callback(JSON.parse(body).rows)
   });
}

exports.putView = function (callback) {
   console.log('put view');
   var db = new PouchDB(config.pouch + '/timestamps');
   db.put({
      _id: '_design/show',
      language: 'javascript',
      views: {
         show: {
            map: "function(doc) {\n  emit(null,doc);\n}"
         }
      }
   }).then(function () {
      callback();
   }).catch(function (err) {
      console.log(err);
      callback(null);
   });
}

pregUrl = function(url) {
   return url.replace(/:/g,'_').replace(/\//g,'_').replace(/\./g,'_');
}

exports.updateDocumentsInfo = function (list) {
   for(l in list) {
      var d = list[l];
      console.log('d:' + d.value._id);
      var db = new PouchDB(config.pouch + '/' + d.value._id);
      console.log('update url: ' + d.value.url);
      exports.performRequest(db, d.value.url, function () {
         console.log('updated' + d.value.url);
      }, null);
   }
}
