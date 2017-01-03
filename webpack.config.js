'use strict';

let webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');

let vendorModules = /(node_modules|bower_components)/;

module.exports = {
  // target: 'web',
  watch: true,
  entry: {
    S3Downloader: './src/S3Downloader.js',
    S3Uploader: './src/S3Uploader.js',
  },
  output: {
    // library: ['Helpers', 'SQLRecords'],
    path: './www/js/dist/',
    filename: '[name].web.js',
  },

  module: {
    loaders: [
      {
        test: /\.js/,
        exclude: vendorModules,
        loader: 'babel-loader',
        query: {
          plugins: [
            "transform-object-assign",
          ]        
        },
      }
    ],
  },
  // Externals para johnny-five  
  /*externals: ['bindings'],*/
  //
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: false,
      comments: false,
      mangle: false,
      beautify: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
};