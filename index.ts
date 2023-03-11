import { app, BrowserWindow, protocol } from 'electron';
import { fetch } from 'cross-fetch';
import { readFileSync, writeFileSync } from 'fs';
import { ElectronBlocker, fullLists } from '@cliqz/adblocker-electron';
import * as fs from 'fs';
import * as path from "path";

// Website URL goes in this function.  Returns a string URL
function getUrlToLoad(): string {
    let url = 'https://yugenanime.ro';

    return url;
}

// Unneeded, don't forget to delete when pushing to production
function getCSS(): string {
    let css = fs.readFileSync('assets/styles.css', 'utf-8');

    return css;
}

// Create browser Window
let mainWindow: BrowserWindow | null = null;

async function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            nodeIntegrationInSubFrames: true,
            preload: path.join(__dirname, "preload.js"),
            sandbox: false,
            webSecurity: false,
        },
        width: 1000,
        height: 700,
        show: false,
        icon: __dirname + '/assets/icons/512x512.png'
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

app.on('ready', () => {

    const protocolName = 'yugen';

    protocol.registerFileProtocol(protocolName, (request, callback) => {
        const url = request.url.replace(`${protocolName}://`, '');
        try {
            return callback(decodeURIComponent(url));
        }
        catch (error) {
            console.error(error);
        }
    });

    createWindow();
});

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
