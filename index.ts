// Everything in the import block is required as 'dependency'

import { app, BrowserWindow, nativeImage } from 'electron';
import { ElectronBlocker } from '@cliqz/adblocker-electron';
import fetch from 'cross-fetch';

// Main window trigger
app.on('ready', () => {
    console.log('App is Ready');

    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        icon: __dirname + '/build/icons/512x512.png'
    });

    ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
        blocker.enableBlockingInSession(win.webContents.session);
    });

    win.loadURL('https://yugen.to');
    win.setTitle('Yugen Anime');
    win.setMenuBarVisibility(false);
    win.setAutoHideMenuBar(true);
});
