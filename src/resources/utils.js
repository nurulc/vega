var fs = require("fs");
const path = require("path");
const url = require("url");
const exec = require("child_process").exec;
const csv = require("fast-csv");
const getLine = require("get-line");
const es = require("event-stream");

import {Messages} from "../js/Alerts/Messages";
import {getRandomJsonFileName} from "../database/utils";
import {inputConfig, sysCommands} from "./config";

/*For each file check if it has the correct parameters. Function will fire off
 * messages to the render process - either confirmed-correctFilePath or error-WithMsg
 *
 *
 * @param selectedFiles {Array}   - A list of selected files
 * @param allParams     {Object}  - All file information
 * @param event         {Object}  - Sends out events to render processes
 *
 */
export const checkIndividualFiles = (selectedFiles, allParams, event) => {
  selectedFiles.map(async individualFileParam => {
    var paramCheckObj = Object.assign({}, allParams);
    paramCheckObj["args"] = Object.assign({}, individualFileParam);

    var errors = checkForFileErrors(paramCheckObj);

    if (errors) {
      event.sender.send("error-WithMsg", errors);
    } else {
      await fileParsing(individualFileParam).then(eventPromise => {
        //Map all of the confirmations or rejections and fire the events off
        Object.keys(eventPromise).map(eventType => {
          //Will either be confirmed-correctFilePath or error-WithMsg
          event.sender.send(eventType, eventPromise[eventType]);
        });
      });
    }
  });
};

/*Checks to see if the number of files selected is less than the max # allowed
 *
 * @param args          {Array}   - A list of file arguments
 * @param event         {Object}  - Sends out events to render processes
 *
 * @return {Object}     - Will return an object of allowed file paths
 */
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
        //Remove those files from the list
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

/* Checks for various file errors
 *
 * @param params    {Object}  - A file object
 *
 * @return {String} - An error message
 */
const checkForFileErrors = params => {
  var errorMsg;
  if (!isCorrectExt(params.args)) {
    //create error, wrong ext
    errorMsg = Messages.errorWrongFileExt;
  } else if (!lessThanMaxNumFile(params)) {
    //Attempting to add too many files
    errorMsg = Messages.errorMaxNumFilesReached;
  } else if (!isFileReadable(params.args.path)) {
    //create error, not readable
    errorMsg = Messages.errorNotReadable;
  } else if (!doesFileExist(params.args.path)) {
    //create error, path does not exist
    errorMsg = Messages.errorBadFilePath;
  } else if (isDuplicate(params)) {
    errorMsg = Messages.errorIsDuplicate;
  }
  return errorMsg;
};

/* Returns a list of missing csv headers
 *
 * @param param         {Object}  - A file object
 * @param headerList    {Array}   - A list of headers
 *
 * @return {String} - An error or confirmation message
 */
const getMissingFileHeaders = (headerList, param) =>
  inputConfig[param.target].requiredFields.filter(
    header => !headerList.includes(header)
  );

/* Parses the selected file and returns an error or confirmation event
 *
 * @param param         {Object}  - A file object
 *
 * @return {String} - An error or confirmation message
 */
const fileParsing = async param => {
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

/* Parse the first row in the csv file
 *
 * @param param         {Object}  - A file object
 * @param callback      {Object}  - A callback function
 *
 */
export const parseFileHeaderContents = async (param, callback) => {
  var getLinesConfig = getLine({
    lines: [1],
    encoding: "utf8"
  });

  return new Promise(async function(resolve, reject) {
    await fs
      .createReadStream(param.path)
      .pipe(getLinesConfig)
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

/* Check to see if file is a duplicated
 *
 * @param param         {Object}  - A file object
 *
 */
const isDuplicate = param => {
  return param.filePaths[param.args.target].indexOf(param.args.path) > -1;
};

/* Check to see if a user has input the correct min # of files
 *
 * @param param     {Object}  - A file object
 *
 */
const lessThanMaxNumFile = param =>
  !inputConfig[param.args.target].hasOwnProperty("maxFiles")
    ? true
    : inputConfig[param.args.target].maxFiles >=
      param.filePaths[param.args.target].length + 1;

/* Does the selected file have the correct extension
 *
 * @param args   {Object}  - A file object
 *
 */
const isCorrectExt = args =>
  inputConfig.hasOwnProperty(args.target) &&
  inputConfig[args.target]["extensions"].indexOf(args.ext) > -1
    ? true
    : false;

/* Is the file readable
 *
 * @param args   {Object}  - A file object
 *
 */
const isFileReadable = path => {
  var isFileReadable = true;
  fs.readFile(path, "utf-8", (err, data) => {
    //Check if file is readable
    if (err) {
      isFileReadable = false;
    }
  });
  return isFileReadable;
};

/* Does the selected file exist
 *
 * @param args   {Object}  - A file object
 *
 */
const doesFileExist = path => {
  var doesFileExist = true;
  fs.stat(path, function(err, stat) {
    //Check for non existing file
    if (err) {
      if (err.code === "ENOENT") {
        doesFileExist = false;
      }
    }
  });
  return doesFileExist;
};
