const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("path");
const url = require("url");
import {isCorrectExt, isFileReadable} from "./resources/utils.js";
import {Messages} from "./js/Alerts/ErrorConsts";
let mainWindow;

ipcMain.on("action-dropFile", (event, args) => {
  var path = args.path;

  if (!isCorrectExt(args)) {
    //create error, wrong ext
    event.sender.send("error-WithMsg", Messages.errorWrongFileExt);
  } else if (!isFileReadable(path)) {
    //create error, not readable
    event.sender.send("error-WithMsg", Messages.errorNotReadable);
  } else if (!doesFileExist(path)) {
    //create error, path does not exist
    event.sender.send("error-WithMsg", Messages.errorBadFilePath);
  } else {
    event.sender.send("confirmed-correctFilePath", args);
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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
