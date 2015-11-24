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
      this.$scope.POSTS_PER_PAGE = 5;
      this.$scope.pagesNumber = 0;
      this.$scope.currentFeed = '';
      this.$scope.currentPage = 1;
      this.$scope.feeds = [];
      this.$scope.menu = this.initMenu();
      this.addHandlers(self);
      this.$scope.currentState = 2;
      this.$scope.favoritesState = [];
      this.$scope.favoritesCounter = -1;
      this.$scope.feeds = [];
      this.$scope.feed = [{name: '',key: ''}];
      this.$scope.favoritesList = [];
      this.loadStartFeed(this);
      this.$scope.initSocket();
   }

   loadStartFeed(self) {
      Server.getAllFeedsList(self.$http, (data) => {
         console.log(data);
         Server.getFeedData2(self.$http, data[0].key, 0, self.$scope.POSTS_PER_PAGE, (data) => {
            console.log(data);
            self.$scope.feed = data;
            self.$scope.favoritesCounter = -1;
            self.$scope.favoriteResolver();
         });
         Server.getPostsCount(self.$http, data[0].key, (data) => {
            self.$scope.pagesNumber = Math.floor((data.count - 1) / self.$scope.POSTS_PER_PAGE) + 1;
         });
         self.$scope.currentFeed = data[0].key;
         self.$scope.currentPage = 1;
      });
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
         self.$scope.feed.key = '';
         self.$scope.feed.name = '';
      }

      this.$scope.choseSourceListItem = function(item, pageOffset = 1) {
         console.log('choseSourceListItem');
         Server.getFeedData2(self.$http, item, (pageOffset - 1) * self.$scope.POSTS_PER_PAGE, 
               self.$scope.POSTS_PER_PAGE, (data) => {
            self.$scope.feed = data;
            self.$scope.favoriteResolver();
            self.$scope.currentState = 2;
         });
         Server.getPostsCount(self.$http, item, (data) => {
            self.$scope.pagesNumber = Math.floor((data.count - 1) / self.$scope.POSTS_PER_PAGE) + 1;
         });
         self.$scope.currentFeed = item;
         self.$scope.currentPage = pageOffset;
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
         console.log(item.index);
         console.log(self.$scope.favoritesState);
         self.$scope.favoritesState[item.index] = !self.$scope.favoritesState[item.index];
         var storedList = JSON.parse(document.cookie.match(/\[.*\]/));
         var index = self.$scope.isFavorited(item.link);
         if (index > -1) {
            storedList.splice(index, 1);
         }
         document.cookie = 'favorites=' + JSON.stringify(storedList);
         self.$scope.favoritesList = storedList;
                     self.$scope.favoritesCounter = -1;
            self.$scope.favoriteResolver();
         console.log(self.$scope.favoritesState);
      };

      this.$scope.retrieveFavoritesList = function() {
         self.$scope.favoritesList = JSON.parse(document.cookie.match(/\[.*\]/));
      };

      this.$scope.isFavorited = function(link) {
         var index = -1;
         console.log(self.$scope.favoritesList);
         for (var i = 0, len = self.$scope.favoritesList.length; i < len; i++) {
            if (self.$scope.favoritesList[i].link === link) {
               console.log(self.$scope.favoritesList[i].link);
               index = i;
               break;
            }
         }
         return index;
      };

      this.$scope.stateResolver = function(index) {
         return index === self.$scope.currentState;
      }

      this.$scope.favoriteResolver = function() {
         self.$scope.retrieveFavoritesList();
         self.$scope.favoritesState = [];
         for (var i = 0; i < self.$scope.feed.length; i++)  {
            self.$scope.feed[i]["index"] = i;
            self.$scope.favoritesState.push(self.$scope.isFavorited(self.$scope.feed[i].link) === -1);
         }
      }

      this.$scope.pagingRange = function(min, max, step) {
         step = step || 1;
         var input = [];
         if (min < 1) min = 1;
         if (max > self.$scope.pagesNumber) max = self.$scope.pagesNumber;
         for (var i = min; i <= max; i += step) {
            input.push(i);
         }
         return input;
      };
   }
}

MainAppController.$inject = ['$scope', '$http'];
export {
   MainAppController
}
