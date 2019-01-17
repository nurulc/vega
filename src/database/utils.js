import {parseFileContents} from "../resources/utils.js";
const fs = require("fs");
const appRoot = require("app-root-path");
const rootPath = appRoot + "/src/database/temp/";

//Returns [analysisID,[fileIDs]] of a created analysis
export const createAnalysis = async (database, params) => {
  //Query the database for missing parsed files
  var allFileIDs = await getAllFileIds(database, params);

  var analysisID = await getAnalysisID(
    database,
    params.name,
    params.description
  );

  var finalAnalysis = await createAnalysisFileRelations(
    analysisID,
    allFileIDs,
    database
  );

  return finalAnalysis;
};
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
async function getAllFileIds(database, params) {
  var sortedFileIDList = sortFileEntries(database, params.filePaths);

  //Return the id's from the files table for each file
  return new Promise(async (resolve, reject) => {
    if (sortedFileIDList.missingDbEntries.length !== 0) {
      await getMissingFileIds(sortedFileIDList, database).then(
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
const getMissingFileIds = (fileEntries, database) => {
  return Promise.all(
    //For every missing json file, parse and save
    fileEntries["missingDbEntries"].map(async filePathObj => {
      return await parseFileContents(filePathObj.pathName, saveFile);
    })
  ).then(newJsonPathList => {
    //Return a list of new file IDs
    return createFileDBEntry(database, newJsonPathList);
  });
};

//Save the parsed input file as a json
const saveFile = async (results, param) => {
  var json = JSON.stringify(results);
  var fileName =
    Math.random()
      .toString(36)
      .substr(2, 5) + ".json";

  var filePath = rootPath + fileName;

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, json, function(err) {
      if (err) {
        reject(err);
      } else {
        var newFileObj = {
          jsonPath: fileName,
          pathName: param
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
function getParsedFilePathObj(filePathObj) {
  var parsedFilePathObjList = [];
  Object.keys(filePathObj).map(input => {
    filePathObj[input].map(filePath => {
      parsedFilePathObjList = [...parsedFilePathObjList, {pathName: filePath}];
    });
  });
  return parsedFilePathObjList;
}
//Create a new database analysis entry
export function getAllAnalysis(event, db) {
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
async function getAnalysisID(db, name, description) {
  return new Promise(resolve => {
    var analysisObj = {
      name: name,
      description: description
    };
    var analysisId = db.analysis.insert(analysisObj);
    resolve(analysisId.$loki);
  });
}

//Create a new database file entry
function createFileDBEntry(db, newEntries) {
  var formattedFileEntries = newEntries.map(entry => {
    return {
      pathName: entry.pathName,
      jsonPath: entry.jsonPath
    };
  });

  var newDbEntries = db.files.insert(formattedFileEntries);

  var newIdList = newDbEntries.hasOwnProperty("$loki")
    ? [newDbEntries.$loki]
    : newDbEntries.map(entry => entry.$loki);

  return newIdList;
}
