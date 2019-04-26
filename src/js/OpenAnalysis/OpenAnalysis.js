import React, {Component} from "react";
import isElectron from "is-electron";
import EnhancedTable from "./Components/EnhancedTable.js";
import DBStatus from "../BackendInit/DBStatus.js";

const ipcRenderer = window.ipcRenderer;

class OpenAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysisData: {}
    };
  }
  //On click of delete analysis
  deleteAnalysis(analysis) {
    ipcRenderer.send("deleteAnalysis", analysis);
  }
  //On click of analysis
  goToExternalLink(name) {
    ipcRenderer.send("goToExternalLink", name, true);
  }

  componentDidMount() {
    if (isElectron()) {
      //Handle correct file path
      ipcRenderer.on("allAnalysis", (event, databaseResults) => {
        if (databaseResults !== null) {
          this.setState({analysisData: [...databaseResults]});
        }
      });
    }
  }
  componentWillMount() {
    //Get all analysis
    ipcRenderer.send("getAllAnalysis");
  }

  render() {
    return (
      <div>
        {" "}
        <DBStatus />
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
