import { app, BrowserWindow, Menu } from 'electron';
import { join as joinPath } from 'path';
import { execFile } from 'child_process';
import getPlatform from './get-platform';
import electrumCall from './electrum';

require('electron-debug')({ showDevTools: true });
const path = require('path');
const ipc = require('electron').ipcMain;
const http = require('http');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

let execPath = '';
if (process.env.NODE_ENV === 'development') {
  execPath = joinPath(__dirname, '../../resources/', getPlatform());
} else {
  execPath = joinPath(process.resourcesPath, '../Resources/bin/');
}
const cmd = `${joinPath(execPath, 'marketmaker')}`;

/**
 * Create windows electron with specifications.
 * @returns {null} None
 */
function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    // useContentSize: true,
    // titleBarStyle: 'hidden',
    center: true,
    width: 1100,
    height: 650,
    minWidth: 1000,
    minHeight: 600,
    // nodeIntegration: 'iframe', // and this line
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });
  mainWindow.webContents.openDevTools();
  const template = [{
    label: 'Monaize ICO App',
    submenu: [
        { label: 'About Monaize ICO App', selector: 'orderFrontStandardAboutPanel:' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click: function () { app.quit(); } },
    ] }, {
      label: 'Edit',
      submenu: [
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
          { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
          { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
      ] },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  ipc.on('console', function (ev) {
    const args = [].slice.call(arguments, 1);
    const r = console.log.apply(console, args);
    ev.returnValue = [r];
  });
  ipc.on('app', function (ev, msg) {
    const args = [].slice.call(arguments, 2);
    ev.returnValue = [app[msg].apply(app, args)];
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.once('did-finish-load', function () {
    const server = http.createServer(function (req, res) {
      if (req.method === 'POST') {
        const chunks = [];
        req.on('data', chunk => {
          chunks.push(chunk);
        });
        req.on('end', () => {
          const data = Buffer.concat(chunks);
          const payload = JSON.parse(data);
          if (payload.method === 'generateaddress') {
           
            execFile(cmd, ['calcaddress', payload.params[0]], (err, stdout) => {
              if (err) console.log(err);
              return res.end(stdout);
            });
          } else {
            electrumCall(payload.ticker, payload.test, payload.method, payload.params, (err, response) => {
              if (err) res.end(JSON.stringify({ error: err }));
              console.log(payload, response)
              return res.end(JSON.stringify(response));
            });
          }
        });
      }
    });
    server.listen(8000);
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
