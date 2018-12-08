/** ***************************************************************************
 * Copyright © 2018 Monaize Singapore PTE. LTD.                               *
 *                                                                            *
 * See the AUTHORS, and LICENSE files at the top-level directory of this      *
 * distribution for the individual copyright holder information and the       *
 * developer policies on copyright and licensing.                             *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * Monaize Singapore PTE. LTD software, including this file may be copied,    *
 * modified, propagated or distributed except according to the terms          *
 * contained in the LICENSE file                                              *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

import { app, BrowserWindow, Menu, shell } from 'electron';
import ElectrumManager from './electrumManager';

const electrumManager = new ElectrumManager();

require('electron-debug')({ showDevTools: true });
const path = require('path');
const ipc = require('electron').ipcMain;
const {ipcRenderer} = require('electron');
const http = require('http');
const pkg = require('../../package.json');

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

/**
 * Create windows electron for open aboutView.
 * @returns {null} None
 */
function aboutView() {
  mainWindow.webContents.send('aboutView');
}

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
    // transparent: true, frame: false,
    center: true,
    width: 1100,
    height: 750,
    minWidth: 1000,
    minHeight: 600,
    // nodeIntegration: 'iframe', // and this line
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  const template = [{
    label: 'Utrum Wallet App',
    submenu: [
        { label: 'About Utrum Wallet', click: function () { aboutView() } },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: function () { app.quit(); } },
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
          { label: 'Open DevTools', accelerator: 'F12', click: function() { mainWindow.webContents.openDevTools(); } },
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

  ipc.on('electrum.init', (event, payload) => {
    electrumManager.initClient(payload.ticker, payload.electrumConfig)
      .then((response) => {
        event.sender.send(`electrum.init.${payload.ticker}.${payload.tag}`, response);
      })
      .catch((error) => {
        event.sender.send(`electrum.init.${payload.ticker}.${payload.tag}`, {error});
      })
    ;
  });

  ipc.on('electrum.call', (event, payload) => {
    electrumManager.requestClient(payload.ticker, payload.method, payload.params)
      .then((response) => {
        event.sender.send(`electrum.call.${payload.method}.${payload.ticker}.${payload.tag}`, response);
      })
      .catch((error) => {
        event.sender.send(`electrum.call.${payload.method}.${payload.ticker}.${payload.tag}`, {error});
      })
    ;
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
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
