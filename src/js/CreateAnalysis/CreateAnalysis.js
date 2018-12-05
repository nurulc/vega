import React, {Component} from "react";
import isElectron from "is-electron";
import {Button} from "react-bootstrap";
import FileSelection from "./Components/FileSelection.js";

import {
  setUserActions
} from "./helpers/actions.js";
const ipcRenderer = window.ipcRenderer;

const wellStyles = {
  maxWidth: 500,
  margin: "25% auto 10px"
};

const buttonStyles = {
  float: "right",
  display: "inline",
  marginLeft: "10px"
};

class CreateAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      csv: {filePaths: null},
      gml: {filePaths: null}
  }
}

 setFileList = (type, newFile) => {
   let currState = {...this.state[type]};
   currState.filePaths = currState.filePaths === null ? [newFile] : [...currState.filePaths, newFile];
   this.setState({[type]:currState})
  };

  componentDidMount() {
    if (isElectron()) {

      var dragFilesHolder = document.getElementById("drag-file");

      ipcRenderer.on("confirmed-correctFilePath", (event, args) => {
        this.setFileList(args.target, args.path);
      });

      setUserActions(dragFilesHolder, ipcRenderer);

    }
  }

  render() {
    const gmlComponent =
      this.state.gml.filePaths === null ? (
        <Button
          dragtype="gml"
          bsSize="large"
          bsStyle="primary"
          style={buttonStyles}
        >
          Drag and drop GML files here{" "}
        </Button>
      ) : (
        <FileSelection
          choosenFiles={this.state.gml.filePaths}
          type="GML's"
          dragtype="gml"
        />
      );
    const csvComponent =
      this.state.csv.filePaths === null ? (
        <Button
          dragtype="csv"
          bsSize="large"
          bsStyle="primary">
          Drag and drop CSV files here{" "}
        </Button>
      ) : (
        <FileSelection
          dragtype="csv"
          choosenFiles={this.state.csv.filePaths}
          type="CSV's"
        />
      );

    return (
      <div className="well" id="drag-file" styles={wellStyles}>
        {" "}{csvComponent} {gmlComponent}{" "}
      </div>
    );
  }
}
export default CreateAnalysis;
