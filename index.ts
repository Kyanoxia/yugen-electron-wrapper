import { app, BrowserWindow } from 'electron';
import { fetch } from 'cross-fetch';
import { readFileSync, writeFileSync } from 'fs';
import { ElectronBlocker, fullLists } from '@cliqz/adblocker-electron';

function getUrlToLoad(): string {
    let url = 'https://yugenanime.ro';

    return url;
}

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            nodeIntegrationInSubFrames: true,
        },
        width: 1000,
        height: 700,
        show: false,
        icon: __dirname + '/build/icons/512x512.png'
    });

    const blocker = await ElectronBlocker.fromLists(
        fetch,
        fullLists,
        {
            enableCompression: true,
        },
        {
            path: 'engine.bin',
            read: async (...args) => readFileSync(...args),
            write: async (...args) => writeFileSync(...args),
        },
    );
    blocker.enableBlockingInSession(mainWindow.webContents.session);

    mainWindow.setBackgroundColor('#101112');

    mainWindow.loadURL(getUrlToLoad());
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(true);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow?.show();
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
