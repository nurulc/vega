import {
  parseFileContents,
  pythonParseFileContents
} from "../resources/utils.js";
const fs = require("fs");
const appRoot = require("app-root-path");
var writeYaml = require("write-yaml");
const exec = require("child_process").exec;
const tempPath = appRoot + "/src/database/temp/";
import {
  getFileTypeByFileName,
  getExpectedFileTargetByType
} from "../js/CreateAnalysis/utils/utils";
import {
  dashboardConfig,
  inputConfig,
  dockerCommands
} from "../resources/config";

//Returns [analysisID,[fileIDs]] of a created analysis
export const createAnalysis = async (database, params, event) => {
  //Query the database for missing parsed files
  var allFileIDs = createAllNewDBFiles(database, params, event);
  var analysisID = await getAnalysisID(
    database,
    params.name,
    params.description,
    params.jiraId
  );
  var finalAnalysis = await createAnalysisFileRelations(
    analysisID,
    allFileIDs,
    database
  );

  var finalExecute = await attachDockerComponenets(
    database,
    analysisID,
    params,
    event
  );
  return finalExecute;
};

async function attachDockerComponenets(database, analysisID, params, event) {
  var yamlFilePath = await createNewYamlVersion(
    database,
    analysisID,
    params,
    event
  );

  event.sender.send("test", yamlFilePath);
  var finalExecute = await executeYamlLoad(yamlFilePath, event);
  return finalExecute;
}

var lyraYamlFile = function(params) {
  this.project = dashboardConfig.project;
  this.title = params.name;
  this.sample_ids = [params.name];
  this.library_ids = [params.name];
  this.analysis_id = params.name;
  this.jira_id = params.jiraId;
  this.description = params.description ? params.description : "";
  this.files = {
    segs: params.filePaths.segs,
    tree: params.filePaths.tree[0]
  };
};
const executeYamlLoad = async (yamlFilePath, event) => {
  var loadYamlCommand = dockerCommands.pythonParseCommand.replace(
    "{yaml}",
    yamlFilePath
  );

  return new Promise((resolve, reject) => {
    var load = exec(loadYamlCommand);
    load.stderr.on("data", data => {
      event.sender.send("error-WithMsg", data, 30000);
    });

    load.stdout.on("data", data => {
      var liveOutput = data.toString();
      if (liveOutput.indexOf("-TreeDone") !== -1) {
        event.sender.send("analysisLoadingStep", liveOutput, "Tree");
      } else if (liveOutput.indexOf("-SegDone") !== -1) {
        event.sender.send("analysisLoadingStep", liveOutput, "Segment");
      } else if (liveOutput.indexOf("-AnalysisDone") !== -1) {
        event.sender.send("analysisLoadingStep", liveOutput, "Analysis");
        resolve();
      }
    });
  });
};
const createYamlMetaObject = (db, analysisID) => {
  var hit = db.versions.find({analysisID: analysisID});
  var version =
    hit.length > 0
      ? Math.max.apply(
          Math,
          hit.map(function(o) {
            return o.version;
          })
        ) + 1
      : 1;
  var fileName = "id_" + analysisID + "_v_" + version + ".yml";
  var filePath = tempPath + fileName;
  return {
    analysisID: analysisID,
    version: version,
    fileName: fileName,
    filePath: filePath
  };
};
const createYamlFile = async (yamlMetaObject, yamlObj, event) => {
  return new Promise((resolve, reject) => {
    writeYaml(yamlMetaObject.filePath, yamlObj, function(err) {
      if (err) {
        event.sender.send("error-WithMsg", err, 30000);
        reject(err);
      } else {
        resolve(yamlMetaObject);
      }
    });
  });
};

async function createNewYamlVersion(db, analysisID, params, event) {
  var yamlObj = new lyraYamlFile(params);
  var yamlMetaObject = createYamlMetaObject(db, analysisID);
  event.sender.send("test", yamlMetaObject);
  return new Promise(async (resolve, reject) => {
    //create yamlfile
    return await createYamlFile(yamlMetaObject, yamlObj, event).then(
      //store analysis ID and yaml name
      yamlMeta => {
        event.sender.send("test", yamlMeta);
        event.sender.send("test", "yamlMetaObject");
        createDbYamlVersion(db, yamlMeta);
        resolve(yamlMeta.filePath);
      }
    );
  });
}

async function createAnalysisFileRelations(analysisID, allFileIDs, database) {
  //Once all files and analysis entries are created, make the relation entries
  return Promise.all([analysisID, allFileIDs]).then(function(databaseResults) {
    var results = {};

    results.analysisID = databaseResults[0];
    results.fileIDList = databaseResults[1];

    createDbRelations(database, results);
    return results;
  });
}
async function createAllNewDBFiles(database, params, event) {
  var sortedFileIDList = getParsedFilePathObj(params.filePaths, event);
  return createFileDBEntry(database, sortedFileIDList);
}
async function getAllFileIds(database, params, event) {
  var sortedFileIDList = sortFileEntries(database, params.filePaths);
  //Return the id's from the files table for each file
  return new Promise(async (resolve, reject) => {
    if (sortedFileIDList.missingDbEntries.length !== 0) {
      await getMissingFileIds(sortedFileIDList, database, event).then(
        missingFileIds => {
          var allFileIds = missingFileIds.concat(
            sortedFileIDList.existingDbEntries
          );
          resolve(allFileIds);
        }
      );
    } else {
      //If there are no new files that need to be parsed, return existing ids
      resolve(sortedFileIDList.existingDbEntries);
    }
  });
}
const getMissingFileIds = (fileEntries, database, event) => {
  return Promise.all(
    //For every missing json file, parse and save
    fileEntries["missingDbEntries"].map(async filePathObj => {
      var fileExt = getFileTypeByFileName(filePathObj);
      var fileType = getExpectedFileTargetByType(fileExt);

      var needsPythonLoading = inputConfig[fileType].hasOwnProperty(
        "pythonLoader"
      );
      if (needsPythonLoading) {
        var newFileObj = await pythonParseFileContents(filePathObj, event);
      } else {
        var newFileObj = await parseFileContents(filePathObj, saveFile);
      }
      return newFileObj;
    })
  ).then(newJsonPathList => {
    //Return a list of new file IDs
    var missingDbEntries = fileEntries["missingDbEntries"];
    return createFileDBEntry(database, missingDbEntries);
  });
};

//Create a random 5 letter/digit json file name
export const getRandomJsonFileName = () => {
  return (
    Math.random()
      .toString(36)
      .substr(2, 5) + ".json"
  );
};

//Save the parsed input file as a json
const saveFile = async (results, param) => {
  var json = JSON.stringify(results);
  var fileName = getRandomJsonFileName();

  var filePath = tempPath + fileName;

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, json, function(err) {
      if (err) {
        reject(err);
      } else {
        var newFileObj = {
          jsonPath: fileName,
          pathName: param.pathName
        };
        resolve(newFileObj);
      }
    });
  });
};

function sortFileEntries(db, filePathObject) {
  var fileIDList = [];
  var allUserChoosenPaths = getParsedFilePathObj(filePathObject);
  var allEntries = {};
  //Create a list of missing and existing file entries
  var hit = db.files.find({$or: allUserChoosenPaths});

  allEntries.missingDbEntries = hit
    ? allUserChoosenPaths.filter(
        l1 => !hit.some(l2 => l1.pathName == l2.pathName)
      )
    : allUserChoosenPaths;

  allEntries.existingDbEntries = hit.map(existingEntry => {
    return existingEntry.$loki;
  });

  //return all cases
  return allEntries;
}

//Returns a parsed object with all pathNames
function getParsedFilePathObj(filePathObj, event) {
  var parsedFilePathObjList = [];

  Object.keys(filePathObj).map(input => {
    filePathObj[input].map(filePath => {
      parsedFilePathObjList = [...parsedFilePathObjList, {pathName: filePath}];
    });
  });

  return parsedFilePathObjList;
}
//Create a new database analysis entry
export function getAllAnalysis(db) {
  var allAnalysis = db.analysis.find({$loki: {$ne: null}});
  var allAnalysisIDs = allAnalysis.map(analysis => {
    return {analysisID: analysis.$loki};
  });

  var allRelations = db.relations.find({$or: allAnalysisIDs});
  var allFileIDs = allRelations
    .map(relation => ({$loki: relation.fileID}))
    .reduce((finalList, curr) => {
      return finalList.findIndex(inList => inList.$loki === curr.$loki) >= 0
        ? finalList
        : [...finalList, curr];
    }, []);

  var allFiles = db.files.find({$or: allFileIDs});
  return {
    allAnalysis: allAnalysis,
    allRelations: allRelations,
    allFiles: allFiles
  };
}

//Create a new db entry for a new yaml version
function createDbYamlVersion(db, results) {
  db.versions.insert(results);
}

//Create a relation between a file and an analysis
function createDbRelations(db, results) {
  //For each file, relate it back to 1 analysisID
  var allRelations = results["fileIDList"].map(currFileID => {
    var today = Date.now();

    return {
      analysisID: results["analysisID"],
      fileID: currFileID,
      date: today
    };
  });

  db.relations.insert(allRelations);
}

//Create a new database analysis entry
async function getAnalysisID(db, name, description, jiraId) {
  return new Promise(resolve => {
    var analysisObj = {
      name: name,
      description: description,
      jiraId: jiraId
    };
    var analysisId = db.analysis.insert(analysisObj);
    resolve(analysisId.$loki);
  });
}

//Create a new database file entry
function createFileDBEntry(db, newEntries) {
  var formattedFileEntries = newEntries.map(entry => {
    return {
      pathName: entry.pathName
    };
  });

  var newDbEntries = db.files.insert(formattedFileEntries);

  var newIdList = newDbEntries.hasOwnProperty("$loki")
    ? [newDbEntries.$loki]
    : newDbEntries.map(entry => entry.$loki);

  return newIdList;
}
