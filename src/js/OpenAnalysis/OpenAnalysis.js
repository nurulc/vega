import React, {Component} from "react";
import isElectron from "is-electron";
import EnhancedTable from "./Components/EnhancedTable.js";
const ipcRenderer = window.ipcRenderer;

class OpenAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysisData: {}
    };
  }

  parseOutFileName(pathName) {
    const index = pathName.lastIndexOf("/");
    return pathName.substring(index + 1);
  }

  deleteAnalysis(analysis) {
    ipcRenderer.send("deleteAnalysis", analysis);
  }

  goToExternalLink(name) {
    ipcRenderer.send("goToExternalLink", name, true);
  }

  formatDatabaseResults(databaseResults) {
    const formattedFiles = databaseResults["allFiles"].reduce(
      (finalObj, file) => {
        finalObj[file.$loki] = {
          pathName: file.pathName,
          jsonPath: file.jsonPath,
          fileName: this.parseOutFileName(file.pathName)
        };
        return finalObj;
      },
      {}
    );

    databaseResults["formatedRelations"] = databaseResults[
      "allRelations"
    ].reduce((finalObj, curr) => {
      finalObj[curr.analysisID] = finalObj.hasOwnProperty(curr.analysisID)
        ? finalObj[curr.analysisID] +
          "\n" +
          formattedFiles[curr.fileID].fileName
        : formattedFiles[curr.fileID].fileName;
      return finalObj;
    }, {});
    return databaseResults;
  }

  componentDidMount() {
    if (isElectron()) {
      ipcRenderer.on("test", (event, args) => {
        console.log(args);
      });
      //Handle correct file path
      ipcRenderer.on("allAnalysis", (event, databaseResults) => {
        const allData = this.formatDatabaseResults(databaseResults);
        this.setState({analysisData: allData});
      });
    }
  }
  componentWillMount() {
    ipcRenderer.send("getAllAnalysis");
  }

  render() {
    return (
      <div>
        {" "}
        <EnhancedTable
          goToExternalLink={this.goToExternalLink}
          analysisData={this.state.analysisData}
          deleteAnalysis={this.deleteAnalysis}
          resetSelect={this.state.resetSelect}
        />
      </div>
    );
  }
}
export default OpenAnalysis;
