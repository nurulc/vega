import "@babel/polyfill";
const _HOME_ = require("os").homedir();
const _SEP_ = require("path").sep;
const _APPHOME_ = `${_HOME_}${_SEP_}.vega${_SEP_}`;

const {app, BrowserWindow, ipcMain, Menu, Tray} = require("electron");

const fs = require("fs");
const path = require("path");
const url = require("url");
var shell = require("electron").shell;

import {
  multipleFileSelectionCheck,
  checkIndividualFiles
} from "./resources/utils.js";

import {
  pollDb,
  startLyra,
  stopLyra,
  loadBackend,
  createAnalysis,
  getAllAnalysis,
  deleteAnalysisFromES,
  getAllAnalysisFromES,
  createDockerComposeYaml
} from "./database/utils.js";
import {Messages} from "./js/Alerts/Messages";
let mainWindow;

const log = require("electron-log");

//Check if the selected files have errors
ipcMain.on("checkForFileErrors", async (event, allParams) => {
  log.info("validating files -" + JSON.stringify(allParams));

  var selectedFiles = allParams["args"];
  //File validator for current files selected as a whole
  selectedFiles = multipleFileSelectionCheck(selectedFiles, event);
  //File validator for individal current files selected
  checkIndividualFiles(selectedFiles, allParams, event);
});

//On a click of an exteranl link
ipcMain.on("goToExternalLink", (event, endpoint, isLocalhost) => {
  var url = isLocalhost ? "http://localhost/" + endpoint : endpoint;
  event.preventDefault();
  shell.openExternal(url);
});

//Attempt to delete an analysis
ipcMain.on("deleteAnalysis", async (event, analysis) => {
  log.info("deleting analyis -" + JSON.stringify(analysis));
  //Remove instance from es
  await deleteAnalysisFromES(analysis, event);
  log.info("Analysis deleted ");
  //Refresh all results and show success
  var databaseResults = await getAllAnalysisFromES(event);
  log.info("Fetching all analysis");
  log.info("all analysis" + JSON.stringify(databaseResults));
  event.sender.send("allAnalysis", databaseResults);
  event.sender.send("success-WithMsg", Messages.successDelete);
});

//Send out an error
ipcMain.on("error-WithMsg", (event, error) => {
  log.error("error -" + error);
  event.sender.send("error-WithMsg", error);
});

//Send out a warning
ipcMain.on("sendOutWarning", (event, msg) => {
  log.warn("warning -" + msg);
  event.sender.send("warning-WithMsg", msg);
});

//Retrieve all analysis
ipcMain.on("getAllAnalysis", async event => {
  log.info("fetching all analyis");
  var databaseResults = await getAllAnalysisFromES(event);
  event.sender.send("allAnalysis", databaseResults);
});
//Poll the DB
ipcMain.on("pollDb", async event => {
  pollDb(event);
});

//Create a new instance in the DB
ipcMain.on("createNewAnalysis", async (event, params) => {
  log.info("creating new analyis");
  var finalAnalysis = await createAnalysis(params, event);
});

ipcMain.on("loadBackend", async (event, params) => {
  //Move the json file into the vega home path
  createDockerComposeYaml(_APPHOME_, event);
  log.info("loading backend");
  //Begin loading docker components
  var complete = await loadBackend(event, params, _APPHOME_);
  log.info("backend loaded");
  event.sender.send("completeBackendLoad", complete);
});
const template = () => [
  {
    label: "Vega",
    role: "File",
    submenu: [
      {
        label: "Stop Lyra",
        click: (menuItem, currentWindow) => {
          stopLyra(currentWindow.webContents, _APPHOME_);
        }
      },
      {
        label: "Start Lyra",
        click: (menuItem, currentWindow) => {
          startLyra(currentWindow.webContents, _APPHOME_);
        }
      },
      {
        label: "About",
        click() {
          require("electron").shell.openExternal(
            "https://github.com/shahcompbio/vega/blob/docker-build/docusaurus/docs/getting-started.md"
          );
        }
      }
    ]
  }
];

//Initialize the main window
function createWindow() {
  //Create the home dir if it doesn't exist
  if (!fs.existsSync(_APPHOME_)) {
    fs.mkdir(_APPHOME_, "0777", function() {
      return;
    });
  }
  //Set the app icon
  var appIcon = new Tray(path.join(__dirname, "/../build/icon.png"));

  const menu = Menu.buildFromTemplate(template());
  Menu.setApplicationMenu(menu);
  log.info("backend loaded");
  log.info("creating new window");
  mainWindow = new BrowserWindow({
    width: 900,
    height: 900,
    resizable: false,
    icon: path.join(__dirname, "/../build/icon.png"),
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
