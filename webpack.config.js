var webpack = require('webpack')
var path = require('path')
var OfflinePlugin = require('offline-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

const env = process.env.NODE_ENV
const production = env === 'prod'

var offline_plugin = new OfflinePlugin({
  version: () => {
    return process.env.VERSION
  },
  ServiceWorker: false,
  AppCache: {
    directory: '/'
  }
})

var config = {
  devtool: production ? 'source-map' : 'eval-source-maps',
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.png$/, loader: 'url-loader?limit=100000' }
    ]
  }
}

if (production) {
  config.plugins = [
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    offline_plugin,
    new HtmlWebpackPlugin({
      hash: !!process.env.DEV,
      template: 'index.html',
      favicon: 'favicon.png'
    })
  ]
}

module.exports = config

