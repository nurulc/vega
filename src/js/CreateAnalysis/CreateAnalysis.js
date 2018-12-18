import React, {Component, ReactChildren} from "react";
import {inputConfig} from "../../resources/config.js";
import isElectron from "is-electron";
import {Button} from "react-bootstrap";
import DropComponents from "./Components/DropComponents.js";
import {NavLink} from "react-router-dom";
import {getFileArgs} from "./utils/utils.js";

import * as d3 from "d3";
import "./style.css";
const ipcRenderer = window.ipcRenderer;

var continueButtonStyles = {
  float: "right",
  marginRight: "5%"
};

class CreateAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.location.state.dashboardConfig,
      proceedToMeta: false
    };
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
  //File added to list
  setFileList = (type, file, removeFromList) => {
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
  };

  componentDidMount() {
    if (isElectron()) {
      //Handle correct file path
      ipcRenderer.on("confirmed-correctFilePath", (event, args) => {
        this.setFileList(args.target, args.path);
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
        <div id="drag-file" style={{display: "flex"}}>
          <DropComponents state={this.state} setFileList={this.setFileList} />
        </div>
        {continueButton}
      </div>
    );
  }
}
export default CreateAnalysis;
