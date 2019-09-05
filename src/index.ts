import * as fs from "fs";
import * as path from "path";
import { app, BrowserWindow } from "electron";
import debug = require("electron-debug");

const STEAM_CHAT_URL = "https://steamcommunity.com/chat";

debug({
  showDevTools: false
});

let mainWindow: BrowserWindow;
(async () => {
  await app.whenReady();

  mainWindow = new BrowserWindow({
    title: app.getName(),
    titleBarStyle: "hiddenInset"
  });

  mainWindow.loadURL(STEAM_CHAT_URL);

  const { webContents } = mainWindow;

  webContents.on("dom-ready", () => {
    webContents.insertCSS(
      fs.readFileSync(path.join(__dirname, "..", "css", "app.css"), "utf8")
    );
  });
})();
