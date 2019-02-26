import "@babel/polyfill";
const _HOME_ = require("os").homedir();
const _SEP_ = require("path").sep;
const _APPHOME_ = `${_HOME_}${_SEP_}.vega${_SEP_}`;
const fs = require("fs");

const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("path");
const url = require("url");
var shell = require("electron").shell;
import {
  checkForFileErrors,
  fileParsing,
  sysCommands
} from "./resources/utils.js";
import {Messages} from "./js/Alerts/ErrorConsts";
import {
  createAnalysis,
  getAllAnalysis,
  deleteAnalysisFromES,
  getAllAnalysisFromES
} from "./database/utils.js";
let mainWindow;

//Check if the selected files have errors
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

//On a click of an exteranl link
ipcMain.on("goToExternalLink", (event, endpoint, isLocalhost) => {
  var url = isLocalhost ? "http://localhost/" + endpoint : endpoint;
  event.preventDefault();
  shell.openExternal(url);
});

//Attempt to delete an analysis
ipcMain.on("deleteAnalysis", async (event, analysis) => {
  var deletionComplete = await deleteAnalysisFromES(analysis, event);

  var databaseResults = await getAllAnalysisFromES(event);
  event.sender.send("allAnalysis", databaseResults);
  event.sender.send("success-WithMsg", Messages.successDelete);
});

//Send out an error
ipcMain.on("error-WithMsg", (event, error) => {
  event.sender.send("error-WithMsg", error);
});
//Send out a warning
ipcMain.on("sendOutWarning", (event, msg) => {
  event.sender.send("warning-WithMsg", msg);
});
//Retrieve all analysis
ipcMain.on("getAllAnalysis", async event => {
  event.sender.send("test", _APPHOME_);
  var databaseResults = await getAllAnalysisFromES(event);
  event.sender.send("allAnalysis", databaseResults);
});
//Create a new instance in the DB
ipcMain.on("createNewAnalysis", async (event, params) => {
  var finalAnalysis = await createAnalysis(params, event);
});
//Initialize the main window
function createWindow() {
  //Create the home dir if it doesn't exist
  if (!fs.existsSync(_APPHOME_)) {
    fs.mkdir(_APPHOME_, "0777", function() {
      return;
    });
  }

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
  //mainWindow.webContents.openDevTools();

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
