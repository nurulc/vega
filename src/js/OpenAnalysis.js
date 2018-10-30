import React, { Component } from "react";
import isElectron from "is-electron";
import { Button } from "react-bootstrap";
import FileSelection from "./Components/FileSelection.js";

const ipcRenderer = window.ipcRenderer;

var dragHolders = {
  dragcsv: { type: "csv" },
  draggml: { type: "gml" }
};

const wellStyles = { maxWidth: 500, margin: "25% auto 10px" };
const buttonStyles = { float: "right", display: "inline", marginLeft: "10px" };

const getFileType = file => {
  var fileName = file.name;
  var index = fileName.lastIndexOf(".");
  return fileName.substring(index + 1);
};
class OpenAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = { dragcsv: null, draggml: null };
  }
  setFileList(type, newFile) {
    this.setState({
      [type]:
        this.state[type] === null ? [newFile] : [...this.state[type], newFile]
    });
  }
  componentDidMount() {
    if (isElectron()) {
      var dragFilesHolder = document.getElementById("drag-file");
      dragFilesHolder.ondragover = () => {
        return false;
      };

      dragFilesHolder.ondrop = e => {
        e.preventDefault();
        var dropTarget =
          e.target.id === ""
            ? e.target.parentElement.id.split("-")[0]
            : e.target.id;

        var fileType = getFileType(e.dataTransfer.files[0]);

        if (dragHolders[dropTarget].type === fileType) {
          var filePath = e.dataTransfer.files[0].path;

          var args = {
            path: filePath,
            target: dropTarget
          };

          ipcRenderer.send("drop-file", args);
        }
      };

      ipcRenderer.on("asynchronous-reply", (event, args) => {
        this.setFileList(args.target, args.path);
      });
    }
  }
  render() {
    const gmlComponent =
      this.state.draggml === null ? (
        <Button
          id="draggml"
          bsSize="large"
          bsStyle="btn btn-outline-primary"
          style={buttonStyles}
        >
          Drag and drop GML files here
        </Button>
      ) : (
        <FileSelection
          choosenFiles={this.state.draggml}
          type="GML's"
          id="draggml"
        />
      );
    const csvComponent =
      this.state.dragcsv === null ? (
        <Button id="dragcsv" bsSize="large" bsStyle="btn btn-outline-primary">
          Drag and drop CSV files here
        </Button>
      ) : (
        <FileSelection
          id="dragcsv"
          choosenFiles={this.state.dragcsv}
          type="CSV's"
        />
      );

    return (
      <div className="well" id="drag-file" styles={wellStyles}>
        {csvComponent}
        {gmlComponent}
      </div>
    );
  }
}
export default OpenAnalysis;
