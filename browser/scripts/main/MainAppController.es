import Server from './components/requests.es'


class MainAppController {
   constructor ($scope,$http) {
      console.log('ok');
      this.$scope = $scope;
      this.$http = $http;
      this.initalize(this);
      this.$scope.currentState = 2;
      this.$scope.feed = 
	  [ 
  		{ 
    			title: 'The Old Town of Pingyao', 
    			text: 'Pingyao is a small town in central Shanxi Province whose history goes back 2,700 years.',
    			pubdate: new Date('2004', '09', '14'), 
    			link: 'http://english.china.com/zh_cn/culture_history/heritages/11023762/20040914/11878201.html',
			likes: 0,
			dislikes: 0
  		}
	   ];
   }

   initalize(self) {
         console.log('initialize');
      this.$scope.feeds = [];
      //this.$scope.showListVar = false;
      this.$scope.menu = this.initMenu();
      this.addHandlers(self);
   }

   initMenu() {
         console.log('initMenu');
      return [{
         name: 'settings',
         onClick: 'settings'
      },{
         name: 'list',
         onClick: 'list'
      },{
         name: 'add feed',
         onClick: 'addFeed'
      }];
   }

   addHandlers(self) {
      this.$scope.settings = function () {
         console.log('settings');
         self.$scope.currentState = 4;
         self.$scope.menu = [{
            name: 'back',
            onClick: 'settingsBack'
         }];
      };

      this.$scope.list = function () {
         Server.getAllFeedsList(self.$http, (data) => {
            var list = [];
            for(var k in data) {
               var d = data[k];
               d.onClick = 'choseSourceListItem';
               list.push(d);
            }
            self.$scope.currentState = 1;
            self.$scope.feeds = list;
         });
      };

      this.$scope.addFeed = function() {
         console.log('addFeed');
         self.$scope.menu = [{
            name: 'back',
            onClick: 'addFeedBack'
         }];
         self.$scope.currentState = 3;
      };

      this.$scope.settingsBack = function() {
         console.log('settingsBack');
         self.$scope.menu = self.initMenu();
         self.$scope.currentState = 2;
      }

      this.$scope.addFeedBack = function() {
         console.log('addFeedBack');
         self.$scope.menu = self.initMenu();
         self.$scope.currentState = 2;
         Server.addFeed(self.$http, self.$scope.feed.key, self.$scope.feed.name);
      }

      this.$scope.choseSourceListItem = function(item) {
         console.log('choseSourceListItem');
         console.log(item.key);
         Server.getFeedData(self.$http, item.key, (data) => {
            self.$scope.feeds = data;
            console.log(data);
         });
         self.$scope.currentState = 2;
      }

      this.$scope.plusOne=
         function(index) {
            this.$scope.products[index].likes +=1;
         };

      this.$scope.minusOne=
         function(index) {
            this.$scope.products[index].dislikes +=1;
         };

      this.$scope.stateResolver=
         function(index) {
            if (index == self.$scope.currentState) {
               return true;
            } else {
               return false;
            }
         }
   }
}

MainAppController.$inject = ['$scope','$http'];
export { MainAppController }
