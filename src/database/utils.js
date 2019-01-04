import database from "./datastores.js";

//Returns [analysisID,[fileIDs]] of a created analysis
export const createAnalysis = params => {
  var fileIDList = getFilePathIds(database, params.filePaths);
  var analysisID = createDbAnalysis(database, params.name, params.description);

  return Promise.all([analysisID, fileIDList]).then(function(value) {
    var analysisID = value[0];
    var fileIDList = value[1];
    createDbRelations(database, analysisID, fileIDList);
    return value;
  });
};

//Retrieve IDs for filePaths in DB, create if does not exist
const getFilePathIds = (db, filePathObject) => {
  //Check to see if filepaths already exists
  return new Promise(function(resolve, reject) {
    var fileIDList = [];
    var allUserChoosenPaths = getParsedFilePathObj(filePathObject);

    //Create a list of missing entries
    var missingDbEntries;
    var existingDbEntries;

    db.files.find({$or: allUserChoosenPaths}, async function(err, hit) {
      //If atleast 1 path already exists
      if (hit) {
        //Parse out id's from existing db entries
        existingDbEntries = hit.map(existingEntry => {
          return existingEntry._id;
        });
        //get list of paths that don't exist in the db
        missingDbEntries = allUserChoosenPaths.filter(
          n => !hit.some(n2 => n.pathName == n2.pathName)
        );
      } else {
        //No paths are present in db
        existingDbEntries = [];
        missingDbEntries = allUserChoosenPaths;
      }
      //Create file entry in db if it's missing
      if (missingDbEntries.length > 0) {
        fileIDList = await createMissingDBEntries(db, missingDbEntries);
      }
      //Return a list of all the file IDs
      resolve(fileIDList.concat(existingDbEntries));
    });
  });
};

//For every unexisting file in DB create an entry
async function createMissingDBEntries(db, missingDbEntries) {
  return await missingDbEntries.reduce(async (finalList, curr) => {
    var newId = await createFileDBEntry(db, curr.pathName);
    return [...finalList, newId];
  }, []);
}

//Returns a parsed object with all pathNames
function getParsedFilePathObj(filePathObj) {
  const parsedFilePathObj = Object.entries(filePathObj).map(([key, value]) => {
    filePathObj[key].map(filePath => {
      return [...parsedFilePathObj, {pathName: filePath}];
    });
  });
  return parsedFilePathObj;
}

//Create a relation between a file and an analysis
function createDbRelations(db, analysisID, fileIDList) {
  //For each file, relate it back to 1 analysisID
  fileIDList.map(fileID => {
    var today = Date.now();

    var relationObj = {
      analysisID: analysisID,
      fileID: fileID,
      date: today
    };

    db.relations.insert(relationObj);
  });
}

//Create a new database analysis entry
async function createDbAnalysis(db, name, description) {
  var newAnalysisInstance = new Promise(resolve => {
    var analysisObj = {
      name: name,
      description: description
    };

    db.analysis.insert(analysisObj, function(err, dbEntry) {
      resolve(dbEntry._id);
    });
  });
  return newAnalysisInstance;
}

//Create a new database file entry
async function createFileDBEntry(db, filePath) {
  var newFileInstance = new Promise(resolve => {
    var fileObj = {
      pathName: filePath
    };
    db.files.insert(fileObj, function(err, dbEntry) {
      resolve(dbEntry._id);
    });
  });
  return newFileInstance;
}
