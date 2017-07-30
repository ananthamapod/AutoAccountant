var webpack = require('webpack')
var path = require('path')
var htmlWebpackPlugin = require('html-webpack-plugin')

var BUILD_DIR = path.resolve(__dirname, 'dist')
var APP_DIR = path.resolve(__dirname, 'src')
var TEMPLATE_DIR = path.resolve(__dirname, 'src/templates')

var config = {
  entry: [
    'babel-polyfill',
    APP_DIR + '/index.js'
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [
      // Javascript
      { test: /\.jsx?$/, loader: 'eslint', exclude: /node_modules/ }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        include: APP_DIR,
        loader: 'babel'
      },
      {
        test: /\.scss?$/,
        include: APP_DIR,
        loader: 'style!css!autoprefixer!sass'
      },
      {
        test: /\.css?$/,
        include: '/',
        loader: 'style!css!autoprefixer'
      },
      {
        test: /\.pug$|\.jade$/,
        include: APP_DIR,
        loader: 'pug-loader'
      }
    ]
  },
  eslint: {
    failOnWarning: false,
    failOnError: true
  },
  plugins : [
    new htmlWebpackPlugin({
      template: TEMPLATE_DIR + '/index.pug',
      title: 'AutoAccountant',
      inject: 'body'
    })/*,
    new webpack.optimize.UglifyJsPlugin({
      beautify : false
    })*/
  ]
}

module.exports = config
