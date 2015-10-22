var path = require('path'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, './scripts'),
    entry: './main.es',
    output: {
        path: path.join(__dirname, './build'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.es/, loader: 'babel-loader?stage=0&optional=runtime' },
            { test: /\.(sass|scss)$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?minimize!sass-loader') },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?minimize') },
            { test: /\.json$/, loader: 'json-loader' }
       ]
    },
    plugins: [
        new ExtractTextPlugin('bundle.css')
    ]
};
