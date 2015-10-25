import Server from './components/requests.es'

class MainAppController {
   constructor ($scope,$http) {
      console.log('ok');
      this.$scope = $scope;
      this.$http = $http;
      this.initalize(this);
      this.$scope.showList = [ 
  		{ show: false },
                { show: true }
	    ];
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
      this.$scope.feeds = [];
      //this.$scope.showListVar = false;
      this.$scope.menu = this.initMenu();
      this.addHandlers(self);
   }

   initMenu() {
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
         self.$scope.menu = [{
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
            self.$scope.showList = [ 
  		{ show: true },
                { show: false }
	    ];

            console.log(list);
            self.$scope.feeds = list;
         });
      };
      this.$scope.addFeed = function() {
         self.$scope.menu = [{
            name: 'back',
            onClick: 'addFeedBack'
         }];
      };
      this.$scope.settingsBack = function() {
         self.$scope.menu = self.initMenu();
      }
      this.$scope.addFeedBack = function() {
         self.$scope.menu = self.initMenu();
      }
      this.$scope.choseSourceListItem = function(item) {
         console.log(item.key);
         Server.getFeedData(self.$http, item.key, (data) => {
            self.$scope.feeds = data;
            console.log(data);
         });
      }
      this.$scope.plusOne=
         function(index) {
            this.$scope.products[index].likes +=1;
         };
      this.$scope.minusOne=
         function(index) {
            this.$scope.products[index].dislikes +=1;
         };
   }
}

MainAppController.$inject = ['$scope','$http'];
export { MainAppController }
