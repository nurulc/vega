import {
  dashboardConfig,
  inputConfig,
  sysCommands,
  initStages
} from "../resources/config";
import {
  parseFileContents,
  pythonParseFileContents
} from "../resources/utils.js";
var writeYaml = require("write-yaml");
const exec = require("child_process").exec;
var path = require("path");
const fs = require("fs");
const _HOME_ = require("os").homedir();
const _SEP_ = require("path").sep;
const tempPath = `${_HOME_}${_SEP_}.vega${_SEP_}`;
const fixPath = require("fix-path");

const log = require("electron-log");

import {
  getFileTypeByFileName,
  getExpectedFileTargetByType
} from "../js/CreateAnalysis/utils/utils";

import {Messages} from "../js/Alerts/Messages";
import client from "./api/client.js";

//Create a yaml file to load into ES
export const createAnalysis = async (params, event) => {
  var yamlFilePath = await createNewYamlVersion(params, event);

  var finalExecute = await executeYamlLoad(yamlFilePath, event);
  return finalExecute;
};

//Yaml file layout
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

export const pollDb = async event => {
  await client.indices
    .refresh({index: "analysis"})
    .then(result => {
      event.sender.send("dbIsUp", true);
    })
    .catch(function(err) {
      setTimeout(function() {
        event.sender.send("pollDb", err);
      }, 3000);
    });
};
//Retireve all created anaylsis
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
  return formatResults(results);
};

//Format all analysis to be viewed
const formatResults = data => {
  var parsedData = data.hits.hits;
  if (parsedData.length > 0) {
    parsedData = parsedData.map(hit => {
      var formattedObj = hit._source;
      formattedObj.id = hit._id;
      return formattedObj;
    });
  }
  return parsedData;
};

export const createDockerComposeYaml = async (filePath, event) => {
  const data = fs.readFileSync(
    path.join(__dirname, "docker-compose.json"),
    "utf8"
  );
  const parsedData = JSON.parse(data);

  return new Promise(async (resolve, reject) => {
    //create yamlfile
    return await createYamlFile(
      filePath + "docker-compose.yml",
      parsedData
    ).then(path => {
      resolve(path);
    });
  });
};

export const loadBackend = async (event, params, vegaHomePath) => {
  var dockerComposeFilePath = path.join(vegaHomePath, "/docker-compose.yml");

  initStages.map((initStage, stageNumber) => {
    var command = initStage.filePathRequired
      ? sysCommands[initStage.name].replace(
          "{dockerFilePath}",
          dockerComposeFilePath
        )
      : sysCommands[initStage.name];
    log.info("Loading command" + command);
    return new Promise((resolve, reject) => {
      //Needed to execute scripts in production
      fixPath();

      var load = exec(command);
      if (initStage.completeMarker === "none") {
        //For commands without feedback
        event.sender.send("intputStages", "launched", stageNumber);
      } else {
        //Display error if occured
        load.stderr.on("data", data => {
          var liveOutput = data.toString();
          log.info("stout (r)" + liveOutput);
          event.sender.send("intputStages", liveOutput, stageNumber);
          if (!liveOutput.indexOf("up to date")) {
            event.sender.send("error-WithMsg", data, 30000);
          }
        });
        //Live feedback
        load.stdout.on("data", data => {
          var liveOutput = data.toString();
          log.info("stout" + liveOutput);
          event.sender.send("intputStages", liveOutput, stageNumber);
        });
      }
    });
  });
};

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

export const startLyra = async (event, vegaHomePath) => {
  event.send("signalLyraChange", "starting");
  event.send("dbStatus", true);
};

//Execute yaml commands and wait for responses
const executeYamlLoad = async (yamlFilePath, event) => {
  var loadYamlCommand = sysCommands.pythonParseCommand.replace(
    "{yaml}",
    yamlFilePath
  );

  return new Promise((resolve, reject) => {
    //Needed to execute scripts in production
    fixPath();

    event.sender.send("isRoundProgressActive", true);
    var load = exec(loadYamlCommand);

    load.stderr.on("data", data => {
      event.sender.send("error-WithMsg", data, 100000);
      reject();
    });

    load.stdout.on("data", data => {
      var liveOutput = data.toString();

      if (liveOutput.indexOf("-TreeDone") !== -1) {
        event.sender.send("analysisLoadingStep", liveOutput, "Tree");
      } else if (liveOutput.indexOf("-SegDone") !== -1) {
        event.sender.send("analysisLoadingStep", liveOutput, "Segment");
      } else if (liveOutput.indexOf("-AnalysisDone") !== -1) {
        event.sender.send("isRoundProgressActive", false);
        event.sender.send("analysisLoadingStep", liveOutput, "Analysis");
        resolve();
      }
    });
  });
};

//Create meta dat afor a new analysis including versions
const createYamlMetaObject = async (analysisName, event) => {
  var version = "";
  await client.search(
    {
      index: `analysis`,
      requestCache: false,
      body: {
        query: {
          wildcard: {
            analysis_id: analysisName + "*"
          }
        }
      }
    },
    function callback(err, response) {
      //index does not yet exist
      if (err) {
        version = "";
      } else {
        version =
          response.hits.hits.length === 0
            ? ""
            : "_v" + (Number(response.hits.hits.length) + 1);
      }
      return;
    }
  );

  var fileName = analysisName + version + ".yml";
  var filePath = tempPath + fileName;
  return {
    analysisID: analysisName + version,
    version: version,
    fileName: fileName,
    filePath: filePath
  };
};

//Write into a ymal file
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

//Insert yaml for history purposes
async function insertYamlIntoES(yamlObj, yamlMeta, event) {
  yamlObj.fileName = yamlMeta.fileName;
  var id = yamlMeta.analysisID;

  return await client.create({
    refresh: true,
    index: "yaml",
    type: "yaml",
    id: id,
    body: {
      yamlObj
    }
  });
}

//Create a new version of current analysis
async function createNewYamlVersion(params, event) {
  var yamlMetaObject = await createYamlMetaObject(params.name, event);
  var yamlObj = new lyraYamlFile(params, yamlMetaObject.analysisID);

  await insertYamlIntoES(yamlObj, yamlMetaObject, event);

  return new Promise(async (resolve, reject) => {
    //create yamlfile
    return await createYamlFile(yamlMetaObject.filePath, yamlObj).then(
      filePath => {
        resolve(filePath);
      }
    );
  });
}

//Delete an analysis instance from ES
export async function deleteAnalysisFromES(analysis, event) {
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
