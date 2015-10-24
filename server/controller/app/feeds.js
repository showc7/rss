exports.index = function(req, res, next, page, second) {
   getData(function(data) {
      res.send(data);
      res.send();
   });
};

getData = function(callback) {
   //...
   callback(data);
}
