import keyMirror from 'keymirror';

export default {
   Server: {
      API_URL: 'api',
      ALL_FEEDS: '/api/app/allFeeds',
      FEED_DATA: '/api/app/feedData',
      FEED_POSTS_COUNT: '/api/app/postsCount',
      ADD_FEED: '/api/app/addFeed',
      REMOVE_FEED: '/api/app/removeFeed',
      WEB_SOCKET: {
         INFO: 'ws://localhost:8080/info'
      }
   }
};
