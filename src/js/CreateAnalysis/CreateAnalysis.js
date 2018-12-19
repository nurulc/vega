import React, {Component} from "react";
import {inputConfig, dashboardConfig} from "../../resources/config.js";
import isElectron from "is-electron";
import {Button} from "react-bootstrap";

import DropComponents from "./Components/DropComponents.js";
import SelectedFileList from "./Components/SelectedFileList";

import {NavLink} from "react-router-dom";
import {getFileArgs} from "./utils/utils.js";

import * as d3 from "d3";
import "./style.css";
const ipcRenderer = window.ipcRenderer;

var continueButtonStyles = {
  float: "right",
  marginRight: "5%",
  marginTop: "8px"
};
var flexContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "90vh"
};

class CreateAnalysis extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.state = {
      ...dashboardConfig,
      proceedToMeta: false
    };
  }
  handleClick(e) {
    this.refs.fileUploader.click();
  }
  setCanProceedToMeta = inputs => {
    //Check if min number of files reached to continue
    var canContinue = true;
    inputs.map(inputObj => {
      const filePaths = this.state.filePaths[inputObj.type];
      const minFileCount = inputConfig[inputObj.type].minFiles;
      if (filePaths.length < minFileCount) {
        canContinue = false;
      }
    });
    if (canContinue) {
      this.setState({proceedToMeta: canContinue});
    }
  };
  onDelete = (fileName, type) => {
    this.setFileList(fileName, type, true);
  };
  //File added to list
  setFileList = (file, type, removeFromList) => {
    let currStatePaths = {...this.state.filePaths};
    //Either remove or add the file to the list
    if (removeFromList) {
      currStatePaths[type] = this.state.filePaths[type].filter(function(path) {
        return path !== file;
      });
    } else {
      currStatePaths[type] =
        currStatePaths[type].length === 0
          ? [file]
          : [...currStatePaths[type], file];
    }
    //Set the new state
    this.setState({filePaths: currStatePaths});
    this.setCanProceedToMeta(this.state.input);
  };

  componentDidMount() {
    if (isElectron()) {
      //Handle correct file path
      ipcRenderer.on("confirmed-correctFilePath", (event, args) => {
        this.setFileList(args.path, args.target);
        this.setCanProceedToMeta(this.state.input);
      });

      //Handle drag and drop on containers
      var dragFilesHolder = document.querySelectorAll(".dragWells");

      dragFilesHolder.forEach(holder => {
        holder.ondragover = e => {
          e.preventDefault();
        };
        holder.ondragenter = e => {
          e.preventDefault();
          d3.select(e.target).classed("onDragOver", true);
          return false;
        };

        holder.ondragleave = e => {
          e.preventDefault();
          d3.select(e.target).classed("onDragOver", false);
        };

        holder.ondrop = e => {
          d3.select(e.target).classed("onDragOver", false);
          var args = getFileArgs(e);
          var currState = {...this.state, args};
          ipcRenderer.send("checkForFileErrors", currState);
        };
      });
    }
  }
  render() {
    //If min # of files reached add the next button
    var continueButton = "";
    if (this.state.proceedToMeta) {
      continueButton = (
        <Button style={continueButtonStyles}>
          <NavLink
            to={{
              pathname: "/MetaDataInput",
              state: {filePaths: {...this.state.filePaths}}
            }}
          >
            Continue
          </NavLink>
        </Button>
      );
    }

    return (
      <div>
        <div id="drag-file" style={flexContainer}>
          <DropComponents
            input={this.state.input}
            fileList={this.state.filePaths}
            onDelete={this.onDelete}
          >
            <SelectedFileList />
          </DropComponents>
        </div>
        {continueButton}
      </div>
    );
  }
}
export default CreateAnalysis;
