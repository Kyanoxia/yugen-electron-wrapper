"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const cross_fetch_1 = require("cross-fetch");
const fs_1 = require("fs");
const adblocker_electron_1 = require("@cliqz/adblocker-electron");
const path = __importStar(require("path"));
// Website URL goes in this function.  Returns a string URL
function getUrlToLoad() {
    let url = 'https://yugen.to';
    return url;
}
process.env['APP_PATH'] = electron_1.app.getAppPath();
// Create browser Window
let mainWindow = null;
async function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            nodeIntegrationInSubFrames: true,
            preload: path.join(__dirname, "preload.js"),
            sandbox: false,
            webSecurity: true,
        },
        width: 1500,
        height: 700,
        titleBarStyle: 'hidden',
        icon: process.env['APP_PATH'] + '/assets/icons/icon.png'
    });
    // Initialize AdBlocking
    const blocker = await adblocker_electron_1.ElectronBlocker.fromLists(cross_fetch_1.fetch, adblocker_electron_1.fullLists, {
        enableCompression: true,
    }, {
        path: process.env['APP_PATH'] + 'engine.bin',
        read: async (...args) => (0, fs_1.readFileSync)(...args),
        write: async (...args) => (0, fs_1.writeFileSync)(...args),
    });
    blocker.enableBlockingInSession(mainWindow.webContents.session);
    mainWindow.setBackgroundColor('#101112');
    mainWindow.loadURL(getUrlToLoad());
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.on('ready-to-show', () => {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.show();
    });
}
electron_1.app.on('ready', () => {
    const protocolName = 'yugen';
    electron_1.protocol.registerFileProtocol(protocolName, (request, callback) => {
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
