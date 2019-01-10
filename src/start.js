const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("path");
const url = require("url");
import {checkForFileErrors, fileParsing} from "./resources/utils.js";
import {createAnalysis} from "./database/utils.js";
import collections from "./database/datastores.js";
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
ipcMain.on("createNewAnalysis", async (event, params) => {
  var finalAnalysis = await createAnalysis(collections, params, event);

  //Uncomment to see files made
  /*finalAnalysis.fileIDList.map(id => {
    var obj = {$loki: id};
    var file = collections.files.find(obj);
    event.sender.send("analysisAdded", file);
  });*/
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
