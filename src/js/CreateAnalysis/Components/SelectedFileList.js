import React from "react";
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";

const closeButtonStyle = {
  float: "right",
  cursor: "pointer"
};
const classes = theme => ({
  root: {
    padding: "10px",
    margin: "5px",
    marginTop: "15px",
    textAlign: "left",
    boxShadow:
      "0px 1px 2px 0px #dfe0e0, 0px 1px 1px 0px #dfe0e0, 0px 1px 1px -1px #dfe0e0"
  }
});

const SelectedFileList = props => {
  const {classes, key} = props;
  const {type, choosenFiles} = {...props};
  const selectedPanel = choosenFiles.map((fileName, index) => {
    return (
      <Paper square={true} className={classes.root} elevation={1} key={index}>
        {fileName}
        <span
          aria-hidden="true"
          onClick={() => props.onDelete(fileName, type)}
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
