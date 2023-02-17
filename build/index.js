"use strict";
// Everything in the import block is required as 'dependency'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const adblocker_electron_1 = require("@cliqz/adblocker-electron");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
// Main window trigger
electron_1.app.on('ready', () => {
    console.log('App is Ready');
    const win = new electron_1.BrowserWindow({
        width: 1000,
        height: 700,
        icon: __dirname + '/img/icon512.png'
    });
    adblocker_electron_1.ElectronBlocker.fromPrebuiltAdsAndTracking(cross_fetch_1.default).then((blocker) => {
        blocker.enableBlockingInSession(win.webContents.session);
    });
    win.loadURL('https://yugen.to');
    win.setTitle('Yugen Anime');
    win.setMenuBarVisibility(false);
    win.setAutoHideMenuBar(true);
});
