import Server from './components/requests.es';

class MainAppController {
   constructor($scope, $http, $cookies) {
      console.log('ok');
      this.$scope = $scope;
      this.$http = $http;
      this.initalize(this);
   }

   initalize(self) {
      console.log('initialize');
      this.$scope.feeds = [];
      this.$scope.menu = this.initMenu();
      this.addHandlers(self);
      this.$scope.currentState = 2;
      this.$scope.favoritesState = [];
      this.$scope.favoritesCounter = -1;
      this.$scope.feeds = [];
      this.$scope.feed = [{
         name: '',
         key: ''
      }];
      this.$scope.favoritesList = [];
      var startFeed = 'http://www.ololo.com/feed';
      this.$scope.storedList = JSON.parse(document.cookie.match(/\[.*\]/));
      Server.getFeedData(this.$http, startFeed, (data) => {
         this.$scope.feed = data.feed;
         this.$scope.favoritesCounter = -1;
         console.log(data);
      });
      this.$scope.initSocket();
   }

   initMenu() {
      console.log('initMenu');
      return [{
         name: 'favorites',
         onClick: 'favorites'
      }, {
         name: 'list',
         onClick: 'list'
      }, {
         name: 'manage feeds',
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
      this.$scope.initSocket = function() {
         var ws = new WebSocket('ws://localhost:8080/info');
         Server.wsGet((data) => {
            var data = JSON.parse(data);
            if (data.action === 'addFeed') {
               var item = {
                  id: data.url,
                  key: data.url,
                  onClick: 'choseSourceListItem',
                  onRemove: 'removeFeed'
               }
               self.$scope.feeds.push(item);
               console.log(self.$scope.feeds);
               self.$scope.$apply();
            } else {
               var index = -1;
               for (var i = 0, len = self.$scope.feeds.length; i < len; i++) {
                  if (self.$scope.feeds[i].key == data.url) {
                     index = i;
                     break;
                  }
               }
               if (index > -1) {
                  self.$scope.feeds.splice(index, 1);
               }
               self.$scope.$apply();
            }
         });
      }

      this.$scope.favorites = function() {
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

      this.$scope.startView = function() {
         self.$scope.currentState = 2;
         self.$scope.menu = self.initMenu();
      };

      this.$scope.list = function() {
         self.$scope.currentState = 1;
         console.log('list');
         Server.getAllFeedsList(self.$http, (data) => {
            var list = [];
            for (var k in data) {
               var d = data[k];
               d.onClick = 'choseSourceListItem';
               d.onRemove = 'removeFeed';
               list.push(d);
            }
            self.$scope.feeds = list;
         });
      };

      this.$scope.addFeed = function() {
         console.log('addFeed');
         self.$scope.list();
         self.$scope.menu = self.backMenu();
         self.$scope.currentState = 3;
      };

      this.$scope.removeFeed = function(item) {
         Server.removeFeed(self.$http, item.key);
         self.$scope.list();
         self.$scope.currentState = 3;
      }

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
            self.$scope.feed = data.feed;
            console.log(data);
         });
         self.$scope.currentState = 2;
      }

      this.$scope.addFavorite = function(item) {
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
         self.$scope.favoritesList = storedList;
         self.$scope.favoritesState[item.index] = !self.$scope.favoritesState[item.index];
      };

      this.$scope.removeFavorite = function(item) {
         console.log('removeFavorite');
         console.log(item);
         var storedList = JSON.parse(document.cookie.match(/\[.*\]/));
         var index = self.$scope.isFavorited(item.link);
         if (index > -1) {
            storedList.splice(index, 1);
         }
         document.cookie = 'favorites=' + JSON.stringify(storedList);
         self.$scope.favoritesList = storedList;
         self.$scope.favoritesState[item.index] = !self.$scope.favoritesState[item.index];
      };

      this.$scope.isFavorited = function(link) {
         var index = -1;
         for (var i = 0, len = self.$scope.favoritesList.length; i < len; i++) {
            if (self.$scope.favoritesList[i].link === link) {
               index = i;
               break;
            }
         }
         return index;
      };

      this.$scope.stateResolver = function(index) {
         return index === self.$scope.currentState;
      }

      this.$scope.favoriteResolver = function(item) {
         if (++self.$scope.favoritesCounter >= self.$scope.feed.entries.length) return;
         self.$scope.feed.entries[self.$scope.favoritesCounter]["index"] = self.$scope.favoritesCounter;
         self.$scope.favoritesState.push(self.$scope.isFavorited(item.link) === -1);
      }
   }
}

MainAppController.$inject = ['$scope', '$http'];
export {
   MainAppController
}
