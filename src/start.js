const { app, BrowserWindow, ipcMain } = require("electron");
var fs = require("fs");
const path = require("path");
const url = require("url");

let mainWindow;

ipcMain.on("drop-file", (event, args) => {
  console.log("drop file");
  var path = args.path;
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) {
      alert("An error ocurred reading the file :" + err.message);
      return;
    } else {
      //console.log("The file content is : " + data);
    }
  });
  event.sender.send("asynchronous-reply", args);
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
