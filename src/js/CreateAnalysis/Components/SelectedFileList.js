import React from "react";
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";

var closeButtonStyle = {
  float: "right",
  cursor: "pointer"
};
const classes = theme => ({
  root: {
    padding: "7px",
    margin: "5px"
  }
});

const SelectedFileList = props => {
  const {classes} = props;
  const {dragType, choosenFiles} = {...props};
  const selectedPanel = choosenFiles.map(fileName => {
    return (
      <Paper className={classes.root} elevation="1">
        {fileName}
        <span
          aria-hidden="true"
          onClick={() => props.onDelete(fileName, dragType)}
          style={closeButtonStyle}
        >
          &times;
        </span>
      </Paper>
    );
  });
  return <div>{selectedPanel}</div>;
};
export default withStyles(classes)(SelectedFileList);
