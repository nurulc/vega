import {
  parseFileContents,
  pythonParseFileContents
} from "../resources/utils.js";
const appRoot = require("app-root-path");
var writeYaml = require("write-yaml");
const exec = require("child_process").exec;
var path = require("path");
const fs = require("fs");
const _HOME_ = require("os").homedir();
const _SEP_ = require("path").sep;
const tempPath = `${_HOME_}${_SEP_}.vega${_SEP_}`;
const fixPath = require("fix-path");

import {
  getFileTypeByFileName,
  getExpectedFileTargetByType
} from "../js/CreateAnalysis/utils/utils";
import {dashboardConfig, inputConfig, sysCommands} from "../resources/config";
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

//Retireve all created anaylsis
export const getAllAnalysisFromES = async event => {
  const results = await client.search({
    index: `analysis`,
    body: {
      size: 100
    }
  });
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
export const loadBackend = async (event, params) => {
  var initScript = path.join(__dirname, "/init.sh");

  return new Promise((resolve, reject) => {
    //Needed to execute scripts in production
    fixPath();

    var load = exec(initScript);

    load.stderr.on("data", data => {
      var liveOutput = data.toString();
      if (!liveOutput.indexOf("up to date")) {
        event.sender.send("error-WithMsg", data, 30000);
      }
    });

    load.stdout.on("data", data => {
      var liveOutput = data.toString();
      event.sender.send("intputStages", liveOutput);
    });
  });
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
      event.sender.send("test", data);
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
  event.sender.send("test", analysisName);
  event.sender.send("test", client);
  var version = "";
  await client.search(
    {
      index: `analysis`,
      body: {
        query: {
          wildcard: {
            analysis_id: analysisName + "*"
          }
        }
      }
    },
    function callback(err, response) {
      event.sender.send("test", response);
      event.sender.send("test", err);
      //index does not yet exist
      if (err) {
        event.sender.send("test", "err");
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
  event.sender.send("test", "version");
  event.sender.send("test", version);
  return {
    analysisID: analysisName + version,
    version: version,
    fileName: fileName,
    filePath: filePath
  };
};

//Write into a ymal file
const createYamlFile = async (yamlMetaObject, yamlObj, event) => {
  return new Promise((resolve, reject) => {
    writeYaml(yamlMetaObject.filePath, yamlObj, function(err) {
      if (err) {
        event.sender.send("error-WithMsg", err.toString(), 30000);
        reject(err);
      } else {
        resolve(yamlMetaObject);
      }
    });
  });
};

//Insert yaml for history purposes
async function insertYamlIntoES(yamlObj, yamlMeta, event) {
  yamlObj.fileName = yamlMeta.fileName;
  var id = yamlMeta.analysisID;

  return await client.create({
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
  event.sender.send("test", "params");
  event.sender.send("test", params);
  var yamlMetaObject = await createYamlMetaObject(params.name, event);

  event.sender.send("test", "eyaml");
  event.sender.send("test", yamlMetaObject);
  var yamlObj = new lyraYamlFile(params, yamlMetaObject.analysisID);

  event.sender.send("test", yamlObj);
  await insertYamlIntoES(yamlObj, yamlMetaObject, event);

  return new Promise(async (resolve, reject) => {
    //create yamlfile
    return await createYamlFile(yamlMetaObject, yamlObj, event).then(
      yamlMeta => {
        resolve(yamlMeta.filePath);
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
