var fs = require("fs");
const path = require("path");
const url = require("url");
import {Messages} from "../js/Alerts/Messages";
import {getRandomJsonFileName} from "../database/utils";
import {inputConfig, sysCommands} from "./config";
const exec = require("child_process").exec;
const csv = require("fast-csv");
const getLine = require("get-line");
const es = require("event-stream");

//For each file check if it has the correct parameters
export const checkIndividualFiles = (selectedFiles, allParams, event) => {
  selectedFiles.map(async param => {
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
};

//Checks to see if the number of files selected is less than the max # allowed
export const multipleFileSelectionCheck = (args, event) => {
  var message,
    selectedFiles = null;

  //How many files per extension choosen
  var typeFrequency = args
    .map(pathObject => pathObject.target)
    .reduce((types, type) => {
      types[type] = (types[type] || 0) + 1;
      return types;
    }, {});

  //Types needed for removal
  var removeTypes = Object.keys(typeFrequency).reduce(
    (finalTargets, targetType) => {
      if (
        inputConfig[targetType].hasOwnProperty("maxFiles") &&
        inputConfig[targetType].maxFiles < typeFrequency[targetType]
      ) {
        message = Messages.errorMaxNumFilesReachedWithPlaceholder.replace(
          "{inputs}",
          targetType
        );
        finalTargets[targetType] = "";
      }
      return finalTargets;
    },
    {}
  );
  //If there is an error, remove those types and return the rest
  if (message) {
    //Send out an error message
    event.sender.send("error-WithMsg", message);
    //Set the new list without the errored target type
    selectedFiles = args.filter(pathObject => {
      return !removeTypes.hasOwnProperty(pathObject.target);
    });
  } else {
    selectedFiles = args;
  }

  return selectedFiles;
};
export const checkForFileErrors = params => {
  var args = params.args;
  var errorMsg = null;
  if (!isCorrectExt(args)) {
    //create error, wrong ext
    errorMsg = Messages.errorWrongFileExt;
  } else if (!lessThanMaxNumFile(params)) {
    //Attempting to add too many files
    errorMsg = Messages.errorMaxNumFilesReached;
  } else if (!isFileReadable(args)) {
    //create error, not readable
    errorMsg = Messages.errorNotReadable;
  } else if (!doesFileExist(args)) {
    //create error, path does not exist
    errorMsg = Messages.errorBadFilePath;
  } else if (isDuplicate(params)) {
    errorMsg = Messages.errorIsDuplicate;
  }
  return errorMsg;
};

//Returns a list of missing csv headers
function getMissingFileHeaders(headerList, param) {
  var requiredHeaders = inputConfig[param.target].requiredFields;
  return requiredHeaders.filter(x => !headerList.includes(x));
}

export const fileParsing = async param => {
  var input = param.target;
  var alertObj = {};

  return new Promise(async function(resolve, reject) {
    if (inputConfig[input].hasOwnProperty("requiredFields")) {
      parseFileHeaderContents(param, getMissingFileHeaders).then(
        missingFileHeaders => {
          if (missingFileHeaders.length !== 0) {
            alertObj["error-WithMsg"] =
              Messages.errorMissingRequiredHeader +
              missingFileHeaders.join(", ");
          } else {
            alertObj["confirmed-correctFilePath"] = param;
          }
          resolve(alertObj);
        }
      );
    } else {
      alertObj["confirmed-correctFilePath"] = param;
      resolve(alertObj);
    }
  });
};

//Parse the first row in the csv file
export const parseFileHeaderContents = async (param, callback) => {
  const path = param.path;
  var getLines = getLine({
    lines: [1],
    encoding: "utf8"
  });
  return new Promise(async function(resolve, reject) {
    await fs
      .createReadStream(path)
      .pipe(getLines)
      .pipe(
        es.map(function(line, next) {
          var data = line.split(",").map(function(c) {
            return c.trim();
          });
          resolve(callback(data, param));
          return next(null, line);
        })
      );
  });
};

//Deprecated
export const pythonParseFileContents = async (param, event) => {
  var fileName = getRandomJsonFileName();
  var command = sysCommands.pythonParseFile
    .replace("$FILEPATH", param.pathName)
    .replace("$FILENAME", fileName);

  return new Promise(async function(resolve, reject) {
    exec(command, function(error, stdout, stderr) {
      if (stdout) {
        var newFileObj = {
          jsonPath: fileName,
          pathName: param.pathName
        };
        resolve(newFileObj);
      }
    });
  });
};

//Check to see if file is a duplicated
const isDuplicate = param => {
  return param.filePaths[param.args.target].indexOf(param.args.path) > -1;
};

//Check to see if a user has input the correct min # of files
const lessThanMaxNumFile = param => {
  return !inputConfig[param.args.target].hasOwnProperty("maxFiles")
    ? true
    : inputConfig[param.args.target].maxFiles >=
        param.filePaths[param.args.target].length + 1;
};

//Does the selected file have the correct extension
const isCorrectExt = args => {
  //Does the extension match the location it was dropped
  //Does the extension match the allowed ext
  return inputConfig.hasOwnProperty(args.target) &&
    inputConfig[args.target]["extensions"].indexOf(args.ext) > -1
    ? true
    : false;
};

//Is the file readable
const isFileReadable = args => {
  var isFileReadable = true;
  fs.readFile(args.path, "utf-8", (err, data) => {
    //Check if file is readable
    if (err) {
      isFileReadable = false;
    }
  });
  return isFileReadable;
};

//Does the selected file exist
const doesFileExist = args => {
  var doesFileExist = true;
  fs.stat(args.path, function(err, stat) {
    //Check for non existing file
    if (err) {
      if (err.code === "ENOENT") {
        doesFileExist = false;
      }
    }
  });
  return doesFileExist;
};
