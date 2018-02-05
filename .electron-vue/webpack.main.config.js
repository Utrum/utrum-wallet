'use strict'

process.env.BABEL_ENV = 'main'

const path = require('path')
const { dependencies ***REMOVED*** = require('../package.json')
const webpack = require('webpack')

const BabiliWebpackPlugin = require('babili-webpack-plugin')

let mainConfig = {
  entry: {
    main: path.join(__dirname, '../src/main/index.js')
  ***REMOVED***,
  externals: [
    ...Object.keys(dependencies || {***REMOVED***)
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      ***REMOVED***,
      {
        test: /\.node$/,
        use: 'node-loader'
      ***REMOVED***
    ]
  ***REMOVED***,
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  ***REMOVED***,
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  ***REMOVED***,
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolve: {
    extensions: ['.js', '.json', '.node']
  ***REMOVED***,
  target: 'electron-main'
***REMOVED***

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')***REMOVED***"`
    ***REMOVED***)
  )
***REMOVED***

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  mainConfig.plugins.push(
    new BabiliWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    ***REMOVED***)
  )
***REMOVED***

module.exports = mainConfig
