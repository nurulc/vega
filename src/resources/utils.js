var fs = require("fs");
const path = require("path");
const url = require("url");
import {Messages} from "../js/Alerts/ErrorConsts";
import {inputConfig} from "./config";
const csv = require("fast-csv");
const getLine = require("get-line");
const es = require("event-stream");
//const csvJson = require("csvtojson");

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
  var requiredHeaders = inputConfig[param.args.target].requiredFields;
  return requiredHeaders.filter(x => !headerList.includes(x));
}

export const fileParsing = (event, param) => {
  var input = param.args.target;
  if (inputConfig[input].hasOwnProperty("requiredFields")) {
    parseFileHeaderContents(event, param, getMissingFileHeaders).then(
      missingFileHeaders => {
        if (missingFileHeaders.length !== 0) {
          var errorMsg =
            Messages.errorMissingRequiredHeader +
            missingRequiredHeaders.join(", ");
          event.sender.send("error-WithMsg", errorMsg);
        } else {
          event.sender.send("confirmed-correctFilePath", param.args);
        }
      }
    );
  } else {
    event.sender.send("confirmed-correctFilePath", param.args);
  }
};

export const parseFileHeaderContents = async (event, param, callback) => {
  const path = param.hasOwnProperty("args") ? param.args.path : param;
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

export const parseFileContents = async (param, callback) => {
  const path = param.hasOwnProperty("args") ? param.args.path : param;

  var finalJson = [];
  return new Promise(async function(resolve, reject) {
    csv
      .fromPath(path, {headers: true})
      .on("data", function(data) {
        finalJson = [...finalJson, data];
      })
      .on("end", async function() {
        resolve(callback(finalJson, param));
      });
  });
};

const isDuplicate = param => {
  return param.filePaths[param.args.target].indexOf(param.args.path) > -1;
};

const lessThanMaxNumFile = param => {
  return !inputConfig[param.args.target].hasOwnProperty("maxFiles")
    ? true
    : inputConfig[param.args.target].maxFiles >=
        param.filePaths[param.args.target].length + 1;
};

const isCorrectExt = args => {
  //Does the extension match the location it was dropped
  //Does the extension match the allowed ext
  var allowedExt = inputConfig[args.target].extensions;
  return allowedExt.indexOf(args.ext) > -1;
};

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
