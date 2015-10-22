//import Requests from './components/requests.es'

class MainAppController {
   constructor ($scope) {
      console.log('ok');
      this.$scope = $scope;
      this.initalize();
   }

   initalize() {
      console.log('initializing');
      this.$scope.text = 'Hello world!';
   }
}

MainAppController.$inject = ['$scope'];
export { MainAppController }
