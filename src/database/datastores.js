import {dashboardConfig} from "../resources/config.js";
const loki = require("lokijs");
var appRoot = require("app-root-path");

var databasePath = appRoot + dashboardConfig.databasePath;
var database = new loki(databasePath, {
  autoload: true,
  autoloadCallback: loadHandler,
  autosave: true,
  autosaveInterval: 10000
});

var collections = {};

function loadHandler() {
  dashboardConfig.collectionsList.map(collection => {
    collections[collection] = database.getCollection(collection);
    if (!collections[collection]) {
      collections[collection] = database.addCollection(collection);
    }
  });
}

export default collections;
