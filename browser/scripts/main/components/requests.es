import Constants from '../../data/constants.es';

var ws = new WebSocket('ws://localhost:8080/info');

export default class Server {

   static getAllFeedsList($http,callback) {
      $http.get(Constants.Server.ALL_FEEDS).success((data) => {
         callback(data);
      });
   }

   static getFeedData($http,url,callback) {
      $http.get(Constants.Server.FEED_DATA + '?url=' + url).success((data) => {
         callback(data);
      });
   }

   static addFeed($http,url,name) {
      $http.get(Constants.Server.ADD_FEED + '?url=' + url + '&name=' + name);
   }   
   static removeFeed($http,url) {
      $http.get(Constants.Server.REMOVE_FEED + '?url=' + url);

   static wsSend(data) {
      if(ws.readyState == 1) {
         ws.send(data);
         console.log(data);
      } else {
         var that = this;
         setTimeout(function () {
            that.wsSend(data);
         }, 100);
      }
   }

   static wsGet(callback) {
      ws.onmessage = function (_event) {
         callback(_event.data);
         console.log(_event.data);
      };
   }
}
