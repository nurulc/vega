import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {withStyles} from "@material-ui/core/styles";

import SelectedFileList from "./SelectedFileList";

import {inputConfig, dashboardConfig} from "../../../resources/config.js";
const containerStyles = {
  flexDirection: "row",
  height: "50%",
  backgroundColor: "#fdfdfd"
};
const classes = theme => ({
  root: {
    padding: "10px",
    margin: "5px",
    marginTop: "15px"
  }
});

const SelectedFileListPanel = props => {
  var selectedInputList;
  if (props.filePaths !== null) {
    selectedInputList = Object.keys(inputConfig).map((inputObj, index) => {
      var typeName = inputConfig[inputObj].type;
      return (
        <div style={containerStyles}>
          <Typography variant="h5" gutterBottom>
            Selected {typeName} files
          </Typography>
          <Divider variant="middle" />
          <SelectedFileList
            key={index}
            choosenFiles={props.filePaths[typeName]}
            onDelete={(fileName, type) => props.onDelete(fileName, type)}
          />
        </div>
      );
    });
  }
  return selectedInputList;
};
export default SelectedFileListPanel;
