const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("path");
const url = require("url");
var shell = require("electron").shell;
import {
  checkForFileErrors,
  fileParsing,
  sysCommands
} from "./resources/utils.js";
import {
  createAnalysis,
  getAllAnalysis,
  deleteAnalysis
} from "./database/utils.js";
import collections from "./database/datastores.js";
let mainWindow;

//Send out an error alert
ipcMain.on("checkForFileErrors", async (event, allParams) => {
  allParams["args"].map(async param => {
    var paramCheckObj = Object.assign({}, allParams);
    paramCheckObj["args"] = Object.assign({}, param);

    var errors = checkForFileErrors(paramCheckObj);
    if (errors) {
      event.sender.send("error-WithMsg", errors);
    } else {
      await fileParsing(param).then(eventPromise => {
        Object.keys(eventPromise).map(eventType => {
          event.sender.send(eventType, eventPromise[eventType]);
        });
      });
    }
  });
});

ipcMain.on("goToExternalLink", (event, endpoint, isLocalhost) => {
  var url = isLocalhost ? "http://localhost/" + endpoint + "/" : endpoint;
  event.preventDefault();
  shell.openExternal(url);
});

ipcMain.on("deleteAnalysis", async (event, analysis) => {
  var deletedAnalysis = await deleteAnalysis(collections, analysis, event);
  var databaseResults = getAllAnalysis(collections);
  event.sender.send("allAnalysis", databaseResults);
});

ipcMain.on("error-WithMsg", (event, error) => {
  event.sender.send("error-WithMsg", error);
});
ipcMain.on("sendOutWarning", (event, msg) => {
  event.sender.send("warning-WithMsg", msg);
});
ipcMain.on("getAllAnalysis", event => {
  var databaseResults = getAllAnalysis(collections);
  event.sender.send("allAnalysis", databaseResults);
});
//Create a new instance in the DB
ipcMain.on("createNewAnalysis", async (event, params) => {
  var finalAnalysis = await createAnalysis(collections, params, event);
});
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 900,
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
