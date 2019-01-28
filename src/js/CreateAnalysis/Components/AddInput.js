import React, {Component} from "react";
import {inputConfig, dashboardConfig} from "../../../resources/config.js";
import isElectron from "is-electron";
import DropComponents from "./DropComponents.js";
import SelectedFileListPanel from "./SelectedFileListPanel";
import NavigationButton from "./NavigationButton.js";
import {getFileArgs} from "../utils/utils.js";
import Paper from "@material-ui/core/Paper";
import * as d3 from "d3";
import "../style.css";
const ipcRenderer = window.ipcRenderer;

const listStyles = {
  float: "right",
  width: "60vw",
  height: "100%",
  margin: "2.5% 5% 0% 0%",
  textAlign: "center",
  backgroundColor: "white",
  borderRadius: "4px",
  flexDirection: "column",
  display: "flex",
  boxShadow: "inset 0 1px 1px rgba(0,0,0,0)"
};

const buttonStyles = {
  float: "right",
  marginRight: "5vw",
  marginTop: "-20px"
};

const flexContainer = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-round",
  height: "78vh"
};

class AddInput extends Component {
  constructor(props) {
    super(props);

    var setCanProceedToMeta = false;
    if (props.filePaths !== null) {
      dashboardConfig["filePaths"] = props.filePaths;
      setCanProceedToMeta = true;
    }

    this.state = {
      ...dashboardConfig,
      proceedToMeta: setCanProceedToMeta
    };
  }
  canProceedToMeta = newPathList => {
    //Check if min number of files reached to continue
    var canContinueList = this.state.input.map(inputObj => {
      const filePaths = newPathList[inputObj.type];
      const minFileCount = inputConfig[inputObj.type].minFiles;
      return filePaths.length >= minFileCount;
    });
    var canContinue = canContinueList.indexOf(false) > -1;
    return !canContinue;
  };
  fileSelection = test => {
    var uploadButton = document.getElementById("fileSelectionButton");
    var args = getFileArgs(uploadButton.files);
    var currState = {...this.state, args};
    ipcRenderer.send("checkForFileErrors", currState);
    //console.log(uploadButton.files);
  };
  onDelete = (fileName, type) => {
    this.setFileList(fileName, type, true);
  };
  //File added to list
  setFileList = (file, type, removeFromList) => {
    let currStatePaths = {...this.state.filePaths};
    //Either remove or add the file to the list
    if (removeFromList) {
      currStatePaths[type] = this.state.filePaths[type].filter(
        path => path !== file
      );
    } else {
      currStatePaths[type] =
        currStatePaths[type].length === 0
          ? [file]
          : [...currStatePaths[type], file];
    }
    //Set the new state
    this.setState({
      filePaths: currStatePaths
    });

    this.setState({
      proceedToMeta: this.canProceedToMeta(currStatePaths)
    });
  };

  componentDidMount() {
    if (isElectron()) {
      //Handle correct file path
      ipcRenderer.on("confirmed-correctFilePath", (event, args) => {
        this.setFileList(args.path, args.target);
      });

      //Handle drag and drop on containers
      var dragFilesHolder = document.querySelectorAll(".dragWells");

      dragFilesHolder.forEach(holder => {
        holder.ondragover = e => {
          d3.select(holder).classed("onDragOver", true);
          e.preventDefault();
        };
        holder.ondragenter = e => {
          e.preventDefault();
          d3.select(holder).classed("onDragOver", true);
          return false;
        };

        holder.ondragleave = e => {
          e.preventDefault();
          d3.select(holder).classed("onDragOver", false);
        };

        holder.ondrop = e => {
          d3.select(holder).classed("onDragOver", false);
          e.preventDefault();
          var args = getFileArgs(e, true);
          var currState = {...this.state, args};
          ipcRenderer.send("checkForFileErrors", currState);
        };
      });
    }
  }
  render() {
    if (this.state.filePaths !== null) {
      var selectedFilePanelList = (
        <SelectedFileListPanel
          filePaths={this.state.filePaths}
          onDelete={this.onDelete}
        />
      );
    }

    //If min # of files reached add the next button
    var continueButton = "";
    if (this.state.proceedToMeta) {
      continueButton = (
        <NavigationButton
          style={buttonStyles}
          click={() => this.props.nextClick({...this.state.filePaths})}
        />
      );
    }

    return (
      <div>
        <div id="drag-file" style={flexContainer}>
          <DropComponents
            input={this.state.input}
            fileList={this.state.filePaths}
            onDelete={this.onDelete}
            fileSelection={this.fileSelection}
          />
          <Paper style={listStyles}> {selectedFilePanelList} </Paper>
        </div>
        {continueButton}
      </div>
    );
  }
}
export default AddInput;
