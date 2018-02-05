'use strict'

process.env.NODE_ENV = 'production'

const { say ***REMOVED*** = require('cfonts')
const chalk = require('chalk')
const del = require('del')
const { spawn ***REMOVED*** = require('child_process')
const webpack = require('webpack')
const Multispinner = require('multispinner')


const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')
const webConfig = require('./webpack.web.config')

const doneLog = chalk.bgGreen.white(' DONE ') + ' '
const errorLog = chalk.bgRed.white(' ERROR ') + ' '
const okayLog = chalk.bgBlue.white(' OKAY ') + ' '
const isCI = process.env.CI || false

if (process.env.BUILD_TARGET === 'clean') clean()
else if (process.env.BUILD_TARGET === 'web') web()
else build()

function clean () {
  del.sync(['build/*', '!build/icons', '!build/icons/icon.*'])
  console.log(`\n${doneLog***REMOVED***\n`)
  process.exit()
***REMOVED***

function build () {
  greeting()

  del.sync(['dist/electron/*', '!.gitkeep'])

  const tasks = ['main', 'renderer']
  const m = new Multispinner(tasks, {
    preText: 'building',
    postText: 'process'
  ***REMOVED***)

  let results = ''

  m.on('success', () => {
    process.stdout.write('\x1B[2J\x1B[0f')
    console.log(`\n\n${results***REMOVED***`)
    console.log(`${okayLog***REMOVED***take it away ${chalk.yellow('`electron-builder`')***REMOVED***\n`)
    process.exit()
  ***REMOVED***)

  pack(mainConfig).then(result => {
    results += result + '\n\n'
    m.success('main')
  ***REMOVED***).catch(err => {
    m.error('main')
    console.log(`\n  ${errorLog***REMOVED***failed to build main process`)
    console.error(`\n${err***REMOVED***\n`)
    process.exit(1)
  ***REMOVED***)

  pack(rendererConfig).then(result => {
    results += result + '\n\n'
    m.success('renderer')
  ***REMOVED***).catch(err => {
    m.error('renderer')
    console.log(`\n  ${errorLog***REMOVED***failed to build renderer process`)
    console.error(`\n${err***REMOVED***\n`)
    process.exit(1)
  ***REMOVED***)
***REMOVED***

function pack (config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) reject(err.stack || err)
      else if (stats.hasErrors()) {
        let err = ''

        stats.toString({
          chunks: false,
          colors: true
        ***REMOVED***)
        .split(/\r?\n/)
        .forEach(line => {
          err += `    ${line***REMOVED***\n`
        ***REMOVED***)

        reject(err)
      ***REMOVED*** else {
        resolve(stats.toString({
          chunks: false,
          colors: true
        ***REMOVED***))
      ***REMOVED***
    ***REMOVED***)
  ***REMOVED***)
***REMOVED***

function web () {
  del.sync(['dist/web/*', '!.gitkeep'])
  webpack(webConfig, (err, stats) => {
    if (err || stats.hasErrors()) console.log(err)

    console.log(stats.toString({
      chunks: false,
      colors: true
    ***REMOVED***))

    process.exit()
  ***REMOVED***)
***REMOVED***

function greeting () {
  const cols = process.stdout.columns
  let text = ''

  if (cols > 85) text = 'lets-build'
  else if (cols > 60) text = 'lets-|build'
  else text = false

  if (text && !isCI) {
    say(text, {
      colors: ['yellow'],
      font: 'simple3d',
      space: false
    ***REMOVED***)
  ***REMOVED*** else console.log(chalk.yellow.bold('\n  lets-build'))
  console.log()
***REMOVED***
