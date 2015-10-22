exports.index = function(req, res, next, page, second) {
    res.send('Page: ' + page + ' Second: ' + second);
    res.end();
};
