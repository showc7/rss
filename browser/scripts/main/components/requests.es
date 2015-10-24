import Constants from '../../data/constants.es'

export default class Server {
   static getAllFeeds($http,callback) {
      $http.get(Constants.Server.ALL_FEEDS).success((data) => {
         callback(data);
      });
   }
}
