import React, {Component} from "react";
import {inputConfig} from "../../resources/config.js";
import isElectron from "is-electron";
import {Alert} from "reactstrap";
import {Button, ButtonGroup, PageHeader} from "react-bootstrap";
import FileSelection from "./Components/FileSelection.js";
import {
  hasFileErrors,
  getFileArgs,
  canProceedToMeta
} from "./helpers/actions.js";

import * as d3 from "d3";
import "./style.css";
const ipcRenderer = window.ipcRenderer;

var wellStyles = {
  width: "40%",
  margin: "2.5% 5% 10% 5%",
  textAlign: "center",
  padding: "0% 2% 40% 2%",
  marginBottom: "20px",
  backgroundColor: "#f5f5f5",
  border: "2px dashed #e3e3e3",
  borderRadius: "4px",
  boxShadow: "inset 0 1px 1px rgba(0,0,0,.05)"
};

class CreateAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.location.state.dashboard
    };
  }

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
      ipcRenderer.on("confirmed-correctFilePath", (event, args) => {
        this.setFileList(args.target, args.path);
      });

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
    var canProceedToMeta = canProceedToMeta(this.state.input);

    const dropComponents = this.state.input.map(inputObj => {
      const filePaths = this.state.filePaths[inputObj.type];

      var innerComponent = "";
      if (filePaths.length !== 0) {
        innerComponent = (
          <FileSelection
            choosenFiles={this.state.filePaths[inputObj.type]}
            dragtype={inputObj.type}
            onDelete={(file, type) => this.setFileList(type, file, true)}
          />
        );
      }
      const header = (
        <PageHeader color="light" dragtype={inputObj.type}>
          <small>Drag and drop {inputObj.type} files here </small>
        </PageHeader>
      );
      const continueButton = "";
      if (canProceedToMeta) {
        continueButton = <Button>Continue</Button>;
      }

      return (
        <div
          className="well dragWells"
          dragType={inputObj.type}
          style={wellStyles}
        >
          {" "}
          {header} {innerComponent} {continueButton}
        </div>
      );
    });

    return (
      <div id="drag-file" style={{display: "flex"}}>
        {dropComponents}
      </div>
    );
  }
}
export default CreateAnalysis;
