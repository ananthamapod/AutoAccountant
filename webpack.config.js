var webpack = require('webpack')
var path = require('path')
var htmlWebpackPlugin = require('html-webpack-plugin')
var AssetsPlugin = require('assets-webpack-plugin')

var BUILD_DIR = path.resolve(__dirname, 'public')
var APP_DIR = path.resolve(__dirname, 'src')
var TEMPLATE_DIR = path.resolve(__dirname, 'src/templates')

var config = {
  entry: {
    main: APP_DIR + '/index.js',
    login: APP_DIR + '/login.js',
  },
  output: {
    path: BUILD_DIR,
    filename: 'javascripts/bundle-[name]-[hash].js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        query: {
          failOnWarning: false,
          failOnError: true
        }
      },
      {
        test: /\.jsx?$/,
        include: APP_DIR,
        loader: 'babel-loader'
      },
      {
        test: /\.scss?$/,
        include: APP_DIR,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader'
      },
      {
        test: /\.css?$/,
        include: '/',
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.pug$|\.jade$/,
        include: APP_DIR,
        loader: 'pug-loader'
      }
    ]
  },
  plugins : [
    // new webpack.optimize.UglifyJsPlugin({
    //   beautify : false
    // })
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery'
    }),
    new AssetsPlugin({
      path: path.join(__dirname, 'config'),
      prettyPrint: false
    })
  ]
}

module.exports = config
