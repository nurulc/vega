var fs = require("fs");
const path = require("path");
const url = require("url");
import {Messages} from "../js/Alerts/ErrorConsts";
import {inputConfig} from "./config";
var Papa = require("papaparse");

export const checkForErrors = params => {
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
function verifyFileHeaders(results, event, param) {
  var headerList = results.meta.fields;
  var requiredHeaders = inputConfig[param.args.target].requiredFields;
  var missingRequiredHeaders = [];

  requiredHeaders.map(requiredHeader => {
    if (headerList.indexOf(requiredHeader) < 0) {
      missingRequiredHeaders.push(requiredHeader);
    }
  });

  if (missingRequiredHeaders.length !== 0) {
    var errorMsg =
      Messages.errorMissingRequiredHeader + missingRequiredHeaders.join(", ");
    event.sender.send("error-WithMsg", errorMsg);
  } else {
    event.sender.send("confirmed-correctFilePath", param.args);
  }
}

export const fileParsing = (event, param) => {
  var input = param.args.target;
  if (inputConfig[input].hasOwnProperty("requiredFields")) {
    parseFileContents(event, param, verifyFileHeaders);
  } else {
    event.sender.send("confirmed-correctFilePath", param.args);
  }
};

const parseFileContents = (event, param, callback) => {
  const content = fs.createReadStream(param.args.path);
  Papa.parse(content, {
    worker: true,
    download: true,
    header: true,
    fastMode: true,
    complete: function(results) {
      callback(results, event, param);
    }
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
