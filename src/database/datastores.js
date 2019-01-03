var Datastore = require("nedb");
import {dashboardConfig} from "../resources/config.js";
var appRoot = require("app-root-path");

var database = {};

database.files = new Datastore({
  filename: appRoot + dashboardConfig.databasePaths.files,
  autoload: true
});

database.analysis = new Datastore({
  filename: appRoot + dashboardConfig.databasePaths.analysis,
  autoload: true
});

database.relations = new Datastore({
  filename: appRoot + dashboardConfig.databasePaths.relations,
  autoload: true
});

export default database;
