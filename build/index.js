"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const fs_1 = require("fs");
const adblocker_electron_1 = require("@cliqz/adblocker-electron");
function getUrlToLoad() {
    let url = 'https://yugenanime.ro';
    return url;
}
let mainWindow = null;
async function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            nodeIntegrationInSubFrames: true,
        },
        width: 1000,
        height: 700,
        icon: __dirname + '/build/icons/512x512.png'
    });
    const blocker = await adblocker_electron_1.ElectronBlocker.fromLists(cross_fetch_1.default, adblocker_electron_1.fullLists, {
        enableCompression: true,
    }, {
        path: 'engine.bin',
        read: async (...args) => (0, fs_1.readFileSync)(...args),
        write: async (...args) => (0, fs_1.writeFileSync)(...args),
    });
    blocker.enableBlockingInSession(mainWindow.webContents.session);
    mainWindow.loadURL(getUrlToLoad());
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
