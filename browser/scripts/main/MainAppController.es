//import Requests from './components/requests.es'

class MainAppController {
   constructor ($scope,$http) {
      console.log('ok');
      this.$scope = $scope;
      this.$http = $http;
      this.initalize();
   }

   initalize() {
      console.log('initializing');
      this.$scope.text = 'Hello world!';
      var self = this;
      this.$http.get('/api/app/test').success(function (data) {
         self.$scope.text = data;
      });
   }
}

MainAppController.$inject = ['$scope','$http'];
export { MainAppController }
