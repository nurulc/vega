import {dashboardConfig, sysCommands, initStages} from "../resources/config";
import {parseFileContents} from "../resources/utils.js";

var writeYaml = require("write-yaml");
const exec = require("child_process").exec;
var path = require("path");
const fs = require("fs");
const _HOME_ = require("os").homedir();
const _SEP_ = require("path").sep;
const tempPath = `${_HOME_}${_SEP_}.vega${_SEP_}`;
const fixPath = require("fix-path");

const log = require("electron-log");

import {Messages} from "../js/Alerts/Messages";
import client from "./api/client.js";

/* Create an analysisby creating a yaml file and executing it
 *
 * @param params     {Object}  - All file information
 * @param event         {Object}  - Sends out events to render processes
 *
 */
export const createAnalysis = async (params, event) => {
  var yamlFilePath = await createNewYamlVersion(params, event);
  return await executeYamlLoad(yamlFilePath, event);
};

/* Create an a yaml file object
 *
 * @param params            {Object}  - All analysis
 * @param analysisID        {String}  - Analysis ID
 *
 */
var lyraYamlFile = function(params, analysisID) {
  this.project = dashboardConfig.project;
  this.title = analysisID;
  this.sample_ids = [analysisID];
  this.library_ids = [analysisID];
  this.analysis_id = analysisID;
  this.jira_id = params.jiraId;
  this.description = params.description ? params.description : "";
  this.files = {
    segs: params.filePaths.segs,
    tree: params.filePaths.tree[0]
  };
};
/* Poll ES to see if it is running
 *
 * @param event         {Object}  - Sends out events to render processes
 *
 */
export const pollDb = async event => {
  log.info("Polling ES");
  await client.indices
    .refresh({index: "analysis"})
    .then(result => {
      log.info("ES UP");
      event.sender.send("dbIsUp", true);
    })
    .catch(function(err) {
      setTimeout(function() {
        log.info("ES still down");
        event.sender.send("pollDb", err);
      }, 3000);
    });
};

/* Retireve all created anaylsis
 *
 * @param event         {Object}  - Sends out events to render processes
 *
 */
export const getAllAnalysisFromES = async event => {
  log.info("analysis starting");
  await client.indices.refresh({index: "analysis"});
  const results = await client.search(
    {
      index: `analysis`,
      body: {
        size: 100
      }
    },
    {
      ignore: [404],
      maxRetries: 10
    }
  );
  log.info("analysis -" + JSON.stringify(results));
  return formatResults(results.hits.hits);
};

/* Format all analysis to be viewed
 *
 * @param event   {Object}  - Sends out events to render processes
 *
 */
const formatResults = data =>
  data.length > 0
    ? data.map(hit => ({
        ...hit._source,
        id: hit._id
      }))
    : data;

/* Construct a docker yaml file
 *
 * @param event   {Object}  - Sends out events to render processes
 *
 */
export const createDockerComposeYaml = async (filePath, event) => {
  const data = fs.readFileSync(
    path.join(__dirname, "docker-compose.json"),
    "utf8"
  );
  const parsedData = JSON.parse(data);

  return new Promise(async (resolve, reject) => {
    //create yamlfile with parsed data
    return await createYamlFile(
      filePath + "docker-compose.yml",
      parsedData
    ).then(path => {
      resolve(path);
    });
  });
};

/* Return the relative command, with path if needed
 *
 * @param currStage               {Object}  - an initialization stage
 * @param dockerComposeFilePath   {String}  - vega home path + docker-compose.yml
 *
 * @return a command string
 */
const getFullCommand = (currStage, dockerComposeFilePath) =>
  currStage.filePathRequired
    ? sysCommands[currStage.name].replace(
        "{dockerFilePath}",
        dockerComposeFilePath
      )
    : sysCommands[currStage.name];

/* On return of error from a command
 *
 * @param event         {Object}  - Sends out events to render processes
 * @param data          {Object}  - Data returned from the command
 * @param stageNumber   {Int}     - Relative stage number from all
 *
 * @return an event relative to what the feedback is
 */
const commandError = (event, data, stageNumber) => {
  var liveOutput = data.toString();

  log.info("stout (err)" + liveOutput);

  //Output can come back as errors when parts are already running
  //feedback includes "up to date"
  //Send outout back to front end unless it is actually an error
  event.sender.send("intputStages", liveOutput, stageNumber);
  //If actually an error
  if (!liveOutput.indexOf("up to date")) {
    log.info("feedback from error - " + data);

    event.sender.send("error-WithMsg", data, 30000);
  }
};
/* On return of feedback from a command
 *
 * @param event         {Object}  - Sends out events to render processes
 * @param data          {Object}  - Data returned from the command
 * @param stageNumber   {Int}     - Relative stage number from all
 *
 * @return an feedback to front end
 */
const commandFeedback = (event, data, stageNumber) => {
  var liveOutput = data.toString();
  log.info("stout from command" + liveOutput);
  event.sender.send("intputStages", liveOutput, stageNumber);
};

/* Load all parts of the back end
 *
 * @param event   {Object}  - Sends out events to render processes
 *
 */
export const loadBackend = async (event, params, vegaHomePath) => {
  var dockerComposeFilePath = path.join(vegaHomePath, "/docker-compose.yml");

  initStages.map((initStage, stageNumber) => {
    const command = getFullCommand(initStage, dockerComposeFilePath);

    log.info("Loading command" + command);
    return new Promise((resolve, reject) => {
      //Needed to execute scripts in production
      fixPath();
      var load = exec(command);

      //For commands without feedback, such as cleaning the home folder
      if (initStage.completeMarker === "none") {
        event.sender.send("intputStages", "launched", stageNumber);
      } else {
        //Live feedback
        load.stderr.on("data", data => {
          commandError(event, data, stageNumber);
        });

        load.stdout.on("data", data => {
          commandFeedback(event, data, stageNumber);
        });
      }
    });
  });
};

/* Stop lyra backend
 *
 * @param event         {Object}  - Sends out events to render processes
 * @param vegaHomePath  {String}  - The user's vega home path
 *
 */
export const stopLyra = async (event, vegaHomePath) => {
  event.send("signalLyraChange", "stopping");
  var dockerComposeFilePath = path.join(vegaHomePath, "/docker-compose.yml");

  var stopCommand = sysCommands.dockerComposeDown.replace(
    "{dockerFilePath}",
    dockerComposeFilePath
  );
  log.info("Loading command" + stopCommand);
  return new Promise((resolve, reject) => {
    //Needed to execute scripts in production
    fixPath();
    var stopExec = exec(stopCommand);
    //Live feedback
    var doneCounter = 0;
    stopExec.stderr.on("data", data => {
      var liveOutput = data.toString();
      log.info("stout (er)" + liveOutput);

      if (liveOutput.includes("done")) {
        if (doneCounter++ === 2) {
          event.send("dbStatus", false);
          event.send("success-WithMsg", Messages.successStop);
          setTimeout(function() {
            event.send("signalLyraChange", "stopped");
          }, 4000);
        }
        resolve();
      }
    });
  });
};

/* Start lyra backend
 *
 * @param event         {Object}  - Sends out events to render processes
 *
 */
export const startLyra = async event => {
  log.info("Starting Lyra");
  event.send("signalLyraChange", "starting");
  event.send("dbStatus", true);
};

/* Execute yaml commands and wait for responses
 *
 *
 * @param event         {Object}  - Sends out events to render processes
 * @param yamlFilePath  {String}  - The user's path to the yaml file
 *
 */
const executeYamlLoad = async (yamlFilePath, event) => {
  var loadYamlCommand = sysCommands.pythonParseCommand.replace(
    "{yaml}",
    yamlFilePath
  );

  return new Promise((resolve, reject) => {
    //Needed to execute scripts in production
    fixPath();

    var load = exec(loadYamlCommand);
    log.info("Executing command - " + loadYamlCommand);
    load.stderr.on("data", data => {
      event.sender.send("error-WithMsg", data, 100000);
      reject();
    });

    load.stdout.on("data", data => {
      var liveOutput = data.toString();
      var outputType;
      if (liveOutput.indexOf("-TreeDone") !== -1) {
        outputType = "Tree";
      } else if (liveOutput.indexOf("-SegDone") !== -1) {
        outputType = "Segment";
      } else if (liveOutput.indexOf("-AnalysisDone") !== -1) {
        outputType = "Analysis";
        resolve();
      }
      if (outputType) {
        event.sender.send("analysisLoadingStep", liveOutput, outputType);
      }
    });
  });
};

/* Create meta data for a new analysis in ES
 *
 * @param event         {Object}  - Sends out events to render processes
 * @param analysisName  {String}  - The name of the analyis
 *
 */
const createYamlMetaObject = async (analysisName, event) => {
  var fileName = analysisName + ".yml";
  var filePath = tempPath + fileName;
  return {
    analysisID: analysisName,
    fileName: fileName,
    filePath: filePath
  };
};

/* Write into a ymal file
 *
 * @param filePath         {Object}  - file path to where to put the yaml
 * @param yamlObj          {Object}  - yaml obj created from users meta data input
 *
 */
const createYamlFile = async (filePath, yamlObj) => {
  return new Promise((resolve, reject) => {
    writeYaml(filePath, yamlObj, function(err) {
      if (err) {
        event.sender.send("error-WithMsg", err.toString(), 30000);
        reject(err);
      } else {
        resolve(filePath);
      }
    });
  });
};

/* Insert yaml for history purposes
 *
 * @param yamlMeta         {Object}  - Sends out events to render processes
 * @param yamlObj          {Object}  - The name of the analyis
 * @param event            {Object}  - Sends out events to render processes
 *
 */
const insertYamlIntoES = async (yamlObj, yamlMeta, event) => {
  yamlObj.fileName = yamlMeta.fileName;

  return await client.create({
    refresh: true,
    index: "yaml",
    type: "yaml",
    id: yamlMeta.analysisID,
    body: {
      yamlObj
    }
  });
};

/* Create a new version of current analysis
 *
 * @param params           {Object}  - Object from user input
 * @param event            {Object}  - Sends out events to render processes
 *
 * @return FilePath - of the new yaml file
 */
async function createNewYamlVersion(params, event) {
  log.info("creating yaml meta data");
  var yamlMetaObject = await createYamlMetaObject(params.name, event);
  var yamlObj = new lyraYamlFile(params, yamlMetaObject.analysisID);
  //Insert as backup
  await insertYamlIntoES(yamlObj, yamlMetaObject, event);
  log.info("inserted yaml as backup");
  return new Promise(async (resolve, reject) => {
    //create yamlfile
    return await createYamlFile(yamlMetaObject.filePath, yamlObj).then(
      filePath => {
        resolve(filePath);
      }
    );
  });
}

/* Delete an analysis instance from ES
 *
 * @param analysis          {Object}  - Analysis to be deleted
 *
 */
export async function deleteAnalysisFromES(analysis) {
  await client.indices.delete({
    index: `ce00_${analysis.analysis_id.toLowerCase()}_*`
  });
  return await client.bulk({
    refresh: true,
    body: [
      {
        delete: {
          _index: "analysis",
          _type: "analysis",
          _id: analysis.id
        }
      }
    ]
  });
}
