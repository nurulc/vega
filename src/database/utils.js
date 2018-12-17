var Datastore = require("nedb");
import {dashboardConfig} from "../resources/config.js";
var appRoot = require("app-root-path");

var database = {};
database.files = new Datastore(appRoot + dashboardConfig.databasePaths.files);
database.analysis = new Datastore(
  appRoot + dashboardConfig.databasePaths.analysis
);
database.relations = new Datastore(
  appRoot + dashboardConfig.databasePaths.relations
);

export const createDbAnalyis = (params, event) => {
  database.files.loadDatabase();
  getFilePathObjects(params.filePaths, database, event);
};

const createNewFileEntry = (filePath, db, event) => {
  var fileObj = {
    pathName: filePath
  };

  return db.files.insert(fileObj, function(err, dbEntry) {
    return dbEntry._id;
  });
};
const getFilePathObjects = (filePathObject, db, event) => {
  //Check to see if it already exists
  return new Promise(function(resolve, reject) {
    var fileIDList = [];
    Object.keys(filePathObject).forEach(input => {
      filePathObject[input].map(filePath => {
        //!!This should be 1 big query
        //For each path db lookup
        db.files.findOne({pathName: filePath}, function(err, hit) {
          var fileId;
          if (hit === null) {
            fileId = createNewFileEntry(filePath, db, event);
          } else {
            fileId = hit._id;
          }
          fileIDList.push(fileId);
          event.sender.send("analysisAdded", fileIDList);
        });
      });
    });
  });
};
