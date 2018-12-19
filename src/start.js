const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("path");
const url = require("url");
import {checkForFileErrors, fileParsing} from "./resources/utils.js";
import {createDbAnalyis} from "./database/utils.js";
let mainWindow;

//Send out an error alert
ipcMain.on("checkForFileErrors", (event, params) => {
  var errors = checkForFileErrors(params);
  if (errors) {
    event.sender.send("error-WithMsg", errors);
  } else {
    fileParsing(event, params);
  }
});

//Create a new instance in the DB
ipcMain.on("createNewAnalysis", (event, params) => {
  createDbAnalyis(params, event);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + "/resources/preload.js"
    }
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, "/../build/index.html"),
        protocol: "file:",
        slashes: true
      })
  );

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
