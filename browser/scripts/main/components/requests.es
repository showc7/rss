import Constants from '../../data/constants.es'

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
   
}
