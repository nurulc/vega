import React, {Component} from "react";
import isElectron from "is-electron";
import EnhancedTable from "./Components/EnhancedTable.js";
const ipcRenderer = window.ipcRenderer;

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: 15
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  },
  cellPadding: 5
});

class OpenAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysisData: {}
    };
  }

  parseOutFileName(pathName) {
    var index = pathName.lastIndexOf("/");
    return pathName.substring(index + 1);
  }

  formatDatabaseResults(databaseResults) {
    var formattedFiles = databaseResults["allFiles"].reduce(
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
      //Handle correct file path
      ipcRenderer.on("allAnalysis", (event, databaseResults) => {
        var allData = this.formatDatabaseResults(databaseResults);
        this.setState({analysisData: allData});
      });
    }
  }
  componentWillMount() {
    ipcRenderer.send("getAllAnalysis");
  }

  render() {
    var analysisTable;
    if (this.state.analysisData.hasOwnProperty("allAnalysis")) {
      analysisTable = (
        <EnhancedTable
          allAnalysis={this.state.analysisData.allAnalysis}
          relationMap={this.state.analysisData.formatedRelations}
          classes={styles}
        />
      );
    } else {
      analysisTable = "Please create an analysis";
    }
    return <div>{analysisTable}</div>;
  }
}
export default OpenAnalysis;
