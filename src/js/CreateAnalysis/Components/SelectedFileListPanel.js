import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import SelectedFileList from "./SelectedFileList";

import {inputConfig} from "../../../resources/config.js";
const containerStyles = {
  flexDirection: "row",
  height: "50%",
  backgroundColor: "#fdfdfd"
};

const SelectedFileListPanel = ({filePaths, onDelete}) => {
  var selectedInputList;
  if (filePaths !== null) {
    selectedInputList = Object.keys(inputConfig).map((inputObj, index) => {
      var typeName = inputConfig[inputObj].type;
      var displayName = inputConfig[inputObj].displayName;
      return (
        <div
          style={containerStyles}
          key={"SelectedFileListPanelContainer-" + index}
        >
          <Typography variant="h5" gutterBottom>
            Selected {displayName} files
          </Typography>
          <Divider variant="middle" />
          <SelectedFileList
            key={"SelectedFileList-" + index}
            choosenFiles={filePaths[typeName]}
            type={typeName}
            onDelete={(fileName, type) => onDelete(fileName, type)}
          />
        </div>
      );
    });
  }
  return selectedInputList;
};
export default SelectedFileListPanel;
