import React, {Component} from "react";
import {inputConfig, dashboardConfig} from "../../resources/config.js";
import isElectron from "is-electron";
import {Button} from "react-bootstrap";

const ipcRenderer = window.ipcRenderer;
class OpenAnalysis extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (isElectron()) {
      //Handle correct file path
      ipcRenderer.on("allAnalysis", (event, databaseResults) => {
        console.log(databaseResults);
      });
    }
  }
  componentWillMount() {
    ipcRenderer.send("getAllAnalysis");
  }
  render() {
    return <div />;
  }
}
export default OpenAnalysis;
