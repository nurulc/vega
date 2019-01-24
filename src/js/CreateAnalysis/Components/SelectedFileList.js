import React from "react";
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";

var closeButtonStyle = {
  float: "right",
  cursor: "pointer"
};
const classes = theme => ({
  root: {
    padding: "10px",
    margin: "5px",
    marginTop: "15px"
  }
});

const SelectedFileList = props => {
  const {classes, key} = props;
  const {dragtype, choosenFiles} = {...props};
  const selectedPanel = choosenFiles.map((fileName, index) => {
    return (
      <Paper className={classes.root} elevation={1} key={index}>
        {fileName}
        <span
          aria-hidden="true"
          onClick={() => props.onDelete(fileName, dragtype)}
          style={closeButtonStyle}
        >
          &times;
        </span>
      </Paper>
    );
  });
  return <div key={key}>{selectedPanel}</div>;
};
export default withStyles(classes)(SelectedFileList);
