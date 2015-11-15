import Constants from '../../data/constants.es';

var ws = new WebSocket(Constants.Server.WEB_SOCKET.INFO);

export default class Server {

   static getAllFeedsList($http, callback) {
      $http.get(Constants.Server.ALL_FEEDS).success((data) => {
         callback(data);
      });
   }

   static getFeedData($http, url, callback) {
      $http.get(Constants.Server.FEED_DATA + '?url=' + url).success((data) => {
         callback(data);
      });
   }

   static getFeedData2($http, url, offset, count, callback) {
      $http.get(Constants.Server.FEED_DATA + '?url=' + url + '&offset=' + offset + '&count=' + count).success((data) => {
         var newData = [];
         for(var i in data) {
            newData.push(data[i].doc);
         }
         console.log('newData');
         console.log(newData);
         callback(newData);
      });
   }

   static addFeed($http, url, name) {
      $http.get(Constants.Server.ADD_FEED + '?url=' + url + '&name=' + name);
      ws.send(JSON.stringify({
         url: url,
         name: name,
         action: 'addFeed'
      }));
   }

   static removeFeed($http, url) {
      $http.get(Constants.Server.REMOVE_FEED + '?url=' + url);
      console.log('sending');
      ws.send(JSON.stringify({
         url: url,
         action: 'removeFeed'
      }));
   }

   static wsSend(data) {
      if (ws.readyState == 1) {
         ws.send(data);
         console.log('wsSend 1 data: ' + data);
      } else {
         var that = this;
         setTimeout(function() {
            that.wsSend(data);
         }, 100);
      }
   }


   static wsGet(callback) {
      ws.onmessage = function(_event) {
         callback(_event.data);
      };
   }
}
