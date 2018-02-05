'use strict'

const chalk = require('chalk')
const electron = require('electron')
const path = require('path')
const { say ***REMOVED*** = require('cfonts')
const { spawn ***REMOVED*** = require('child_process')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackHotMiddleware = require('webpack-hot-middleware')

const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')

let electronProcess = null
let manualRestart = false
let hotMiddleware

function logStats (proc, data) {
  let log = ''

  log += chalk.yellow.bold(`┏ ${proc***REMOVED*** Process ${new Array((19 - proc.length) + 1).join('-')***REMOVED***`)
  log += '\n\n'

  if (typeof data === 'object') {
    data.toString({
      colors: true,
      chunks: false
    ***REMOVED***).split(/\r?\n/).forEach(line => {
      log += '  ' + line + '\n'
    ***REMOVED***)
  ***REMOVED*** else {
    log += `  ${data***REMOVED***\n`
  ***REMOVED***

  log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')***REMOVED***`) + '\n'

  console.log(log)
***REMOVED***

function startRenderer () {
  return new Promise((resolve, reject) => {
    rendererConfig.entry.renderer = [path.join(__dirname, 'dev-client')].concat(rendererConfig.entry.renderer)

    const compiler = webpack(rendererConfig)
    hotMiddleware = webpackHotMiddleware(compiler, { 
      log: false, 
      heartbeat: 2500 
    ***REMOVED***)

    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
        hotMiddleware.publish({ action: 'reload' ***REMOVED***)
        cb()
      ***REMOVED***)
    ***REMOVED***)

    compiler.plugin('done', stats => {
      logStats('Renderer', stats)
    ***REMOVED***)

    const server = new WebpackDevServer(
      compiler,
      {
        contentBase: path.join(__dirname, '../'),
        quiet: true,
        before (app, ctx) {
          app.use(hotMiddleware)
          ctx.middleware.waitUntilValid(() => {
            resolve()
          ***REMOVED***)
        ***REMOVED***
      ***REMOVED***
    )

    server.listen(9080)
  ***REMOVED***)
***REMOVED***

function startMain () {
  return new Promise((resolve, reject) => {
    mainConfig.entry.main = [path.join(__dirname, '../src/main/index.dev.js')].concat(mainConfig.entry.main)

    const compiler = webpack(mainConfig)

    compiler.plugin('watch-run', (compilation, done) => {
      logStats('Main', chalk.white.bold('compiling...'))
      hotMiddleware.publish({ action: 'compiling' ***REMOVED***)
      done()
    ***REMOVED***)

    compiler.watch({***REMOVED***, (err, stats) => {
      if (err) {
        console.log(err)
        return
      ***REMOVED***

      logStats('Main', stats)

      if (electronProcess && electronProcess.kill) {
        manualRestart = true
        process.kill(electronProcess.pid)
        electronProcess = null
        startElectron()

        setTimeout(() => {
          manualRestart = false
        ***REMOVED***, 5000)
      ***REMOVED***

      resolve()
    ***REMOVED***)
  ***REMOVED***)
***REMOVED***

function startElectron () {
  electronProcess = spawn(electron, ['--inspect=5858', path.join(__dirname, '../dist/electron/main.js')])

  electronProcess.stdout.on('data', data => {
    electronLog(data, 'blue')
  ***REMOVED***)
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'red')
  ***REMOVED***)

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
  ***REMOVED***)
***REMOVED***

function electronLog (data, color) {
  let log = ''
  data = data.toString().split(/\r?\n/)
  data.forEach(line => {
    log += `  ${line***REMOVED***\n`
  ***REMOVED***)
  if (/[0-9A-z]+/.test(log)) {
    console.log(
      chalk[color].bold('┏ Electron -------------------') +
      '\n\n' +
      log +
      chalk[color].bold('┗ ----------------------------') +
      '\n'
    )
  ***REMOVED***
***REMOVED***

function greeting () {
  const cols = process.stdout.columns
  let text = ''

  if (cols > 104) text = 'electron-vue'
  else if (cols > 76) text = 'electron-|vue'
  else text = false

  if (text) {
    say(text, {
      colors: ['yellow'],
      font: 'simple3d',
      space: false
    ***REMOVED***)
  ***REMOVED*** else console.log(chalk.yellow.bold('\n  electron-vue'))
  console.log(chalk.blue('  getting ready...') + '\n')
***REMOVED***

function init () {
  greeting()

  Promise.all([startRenderer(), startMain()])
    .then(() => {
      startElectron()
    ***REMOVED***)
    .catch(err => {
      console.error(err)
    ***REMOVED***)
***REMOVED***

init()
