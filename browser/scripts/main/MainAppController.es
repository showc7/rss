import Server from './components/requests.es'

class MainAppController {
   constructor ($scope,$http) {
      console.log('ok');
      this.$scope = $scope;
      this.$http = $http;
      this.initalize(this);
   }

   initalize(self) {
      this.$scope.feeds = [];
      this.$scope.menu = [{
         name: 'settings',
         onClick: 'settings'
      },{
         name: 'list',
         onClick: 'list'
      },{
         name: 'add feed',
         onClick: 'addFeed'
      }];
      this.addHandlers(self);
   }

   addHandlers(self) {
      this.$scope.settings = function () {
         this.$scope.menu = [{
            name: 'back',
            onClick: 'settingsBack'
         }];
      };
      this.$scope.list = function () {
         console.log('list');
         Server.getAllFeedsList(self.$http, (data) => {
            var list = [];
            for(var k in data) {
               var d = data[k];
               d.onClick = 'choseSourceListItem';
               list.push(d);
            }
            console.log(list);
            self.$scope.menu = list;
         });
      };
      this.$scope.addFeed = function() {
         self.$scope.menu = [{
            name: 'back',
            onClick: 'addFeedBack'
         }];
      };
      this.$scope.settingsBack = function() {
         initalize();
      }
      this.$scope.addFeedBack = function() {
         initalize();
      }
      this.$scope.choseSourceListItem = function(item) {
         Server.getFeedData(self.$http, item.url, (data) => {
            self.$scope.feeds = data;
         });
      }
   }
}

MainAppController.$inject = ['$scope','$http'];
export { MainAppController }
