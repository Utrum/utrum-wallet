import { app, BrowserWindow ***REMOVED*** from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
***REMOVED***

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname***REMOVED***/index.html`


app.commandLine.appendSwitch('disable-web-security'); // try add this line
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    // titleBarStyle: 'hidden',
    center: true,
    width: 1100, 
    height: 650,
    nodeIntegration: "iframe", // and this line
    webPreferences: {
      webSecurity: false
    ***REMOVED***,
  ***REMOVED***)

  var ipc = require('electron').ipcMain
  ipc.on("console", function (ev) {
      var args = [].slice.call(arguments, 1);
      var r = console.log.apply(console, args);
      ev.returnValue = [r];
  ***REMOVED***);
  ipc.on("app", function (ev, msg) {
      var args = [].slice.call(arguments, 2);
      ev.returnValue = [app[msg].apply(app, args)];
  ***REMOVED***);

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  ***REMOVED***)

  mainWindow.webContents.once("did-finish-load", function () {
    var http = require("http");
    var crypto = require("crypto");
    var electrum = require('./electrum')
    var server = http.createServer(function (req, res) {
      if (req.method == 'POST') {        
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
          const data = Buffer.concat(chunks);
          var payload = JSON.parse(data)
          electrum.call(payload.ticker, payload.method, payload.params, function(err, response){
            if (err) throw JSON.stringify({error: err***REMOVED***)
            return res.end(JSON.stringify(response))
          ***REMOVED***)
        ***REMOVED***)
      ***REMOVED***
    ***REMOVED***);
    server.listen(8000);
    console.log("http://localhost:8000/");
***REMOVED***);
***REMOVED***

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  ***REMOVED***
***REMOVED***)

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  ***REMOVED***
***REMOVED***)

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater ***REMOVED*** from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
***REMOVED***)

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
***REMOVED***)
 */
