import * as fs from "fs";
import * as path from "path";
import { app, BrowserWindow, shell } from "electron";
import debug = require("electron-debug");

const STEAM_CHAT_URL = "https://steamcommunity.com/chat";

debug({
  showDevTools: false
});

let mainWindow: BrowserWindow;
let isQuitting = false;

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
  }
});

(async () => {
  await app.whenReady();

  mainWindow = new BrowserWindow({
    title: app.getName(),
    titleBarStyle: "hiddenInset"
  });

  mainWindow.loadURL(STEAM_CHAT_URL);

  mainWindow.on("close", e => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.blur();
      mainWindow.hide();
    }
  });

  const { webContents } = mainWindow;

  webContents.on("dom-ready", () => {
    webContents.insertCSS(
      fs.readFileSync(path.join(__dirname, "..", "css", "app.css"), "utf8")
    );
  });

  webContents.on("new-window", (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  webContents.on("will-navigate", event => {
    event.preventDefault();
  });

  app.on("activate", () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  app.on("before-quit", () => {
    isQuitting = true;
  });
})();
