import Server from './components/requests.es'


class MainAppController {
   constructor ($scope,$http,$cookies) {
      console.log('ok');
      this.$scope = $scope;
      this.$http = $http;
      this.initalize(this);
      this.$scope.currentState = 2;
      this.$scope.feed = [{
         name: '',
         key: ''
      }];
      this.$scope.favoritesList = [];
      var startFeed = 'http://www.ololo.com/feed';
      Server.getFeedData(this.$http, startFeed, (data) => {
         this.$scope.feeds = data;
         console.log(data);
      });
   }

   initalize(self) {
      console.log('initialize');
      this.$scope.feeds = [];
      this.$scope.menu = this.initMenu();
      this.addHandlers(self);
   }

   initMenu() {
      console.log('initMenu');
      return [{
         name: 'favorites',
         onClick: 'favorites'
      },{
         name: 'list',
         onClick: 'list'
      },{
         name: 'add feed',
         onClick: 'addFeed'
      }];
   }

   backMenu() {
      return [{
         name: 'back',
         onClick: 'startView'
      }];
   }

   addHandlers(self) {
      this.$scope.favorites = function () {
         console.log('favorites');
         self.$scope.currentState = 4;
         self.$scope.menu = self.backMenu();
         var storedList = [];
         if (document.cookie.length > 0) {
            storedList = JSON.parse(document.cookie.match(/\[.*\]/));
         }
         console.log(document.cookie);
         self.$scope.favoritesList = storedList;
      };

      this.$scope.startView = function () {
         self.$scope.currentState = 2;
         self.$scope.menu = self.initMenu();
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
         self.$scope.menu = self.backMenu();
         self.$scope.currentState = 3;
      };

      this.$scope.favoritesBack = function() {
         console.log('favoritesBack');
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

      this.$scope.addFavorite=
         function(item) {            
            console.log(item);
            var storedList = [];
            var newItem = {
               title: item.title,
               link: item.link
            };
            if (document.cookie.length > 0) {
               storedList = JSON.parse(document.cookie.match(/\[.*\]/));
            }
            storedList.push(newItem);
            document.cookie = 'favorites=' + JSON.stringify(storedList);
         };

      this.$scope.removeFavorite=
         function(item) {
            console.log('removeFavorite');
            console.log(item);
            var storedList = JSON.parse(document.cookie.match(/\[.*\]/));
            var index = -1;
            for (var i = 0, len = storedList.length; i < len; i++) {
               if (storedList[i].link == item.link) {
                  index = i;
                  break;
               }
            }
            if (index > -1) {
               storedList.splice(index, 1);
            }
            document.cookie = 'favorites=' + JSON.stringify(storedList);
            self.$scope.favoritesList = storedList;
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
