import React from "react";
import SelectedFileList from "./SelectedFileList";
import {withStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";

const classes = theme => ({
  root: {
    padding: "7px",
    width: "90vw",
    height: "100%",
    margin: "2.5% 5% 0% 5%",
    textAlign: "center",
    backgroundColor: "white",
    border: "1px dashed #e3e3e3",
    borderRadius: "4px",
    boxShadow: "inset 0 1px 1px rgba(0,0,0,.05)"
  },
  buttonText: {
    fontWeight: "bold"
  }
});
const DropComponents = ({
  input,
  fileList,
  fileSelectionButton,
  children,
  onDelete,
  classes
}) => {
  //Create a boxed component for the user to drop and delete files
  const dropComponents = input.map((inputObj, index) => {
    const filePaths = fileList[inputObj.type];

    var childrenWithMoreProps = "";
    //If there are any already selected files
    if (filePaths.length !== 0) {
      childrenWithMoreProps = React.Children.map(children, child => {
        if (child.type === SelectedFileList) {
          return React.cloneElement(child, {
            key: index,
            choosenFiles: filePaths,
            dragtype: inputObj.type,
            onDelete: (fileName, type) => onDelete(fileName, type)
          });
        }
      });
    }

    const header = (
      <Typography variant="h5" gutterBottom dragtype={inputObj.type}>
        Drag and drop {inputObj.type} files here
      </Typography>
    );
    //Entire drop component with box outline
    return (
      <Paper
        className={classNames(classes.root, "dragWells", "wells")}
        elevation={1}
        dragtype={inputObj.type}
      >
        {" "}
        {header} {childrenWithMoreProps}
      </Paper>
    );
  });
  return dropComponents;
};

export default withStyles(classes)(DropComponents);
