import React, {Component} from "react";
import SelectedFileList from "./SelectedFileList";
import {PageHeader} from "react-bootstrap";

var wellStyles = {
  width: "90vw",
  margin: "2.5% 5% 0% 5%",
  textAlign: "center",
  backgroundColor: "white",
  border: "1px dashed #e3e3e3",
  borderRadius: "4px",
  boxShadow: "inset 0 1px 1px rgba(0,0,0,.05)"
};

const DropComponents = ({input, fileList, fileSelectionButton}) => {
  //Create a boxed component for the user to drop and delete files
  const dropComponents = input.map(inputObj => {
    const filePaths = fileList[inputObj.type];

    var childrenWithMoreProps = "";
    //If there are any already selected files
    if (filePaths.length !== 0) {
      childrenWithMoreProps = React.Children.map(props.children, child => {
        if (child.type === SelectedFileList) {
          return React.cloneElement(child, {
            choosenFiles: filePaths,
            dragType: inputObj.type,
            onDelete: (fileName, type) => props.onDelete(fileName, type)
          });
        }
      });
    }

    const header = (
      <PageHeader color="light" dragtype={inputObj.type}>
        <small>
          Drag and drop {inputObj.type} files here, or click to choose from file
          system
        </small>
      </PageHeader>
    );
    //Entire drop component with box outline
    return (
      <div
        className="well dragWells"
        dragType={inputObj.type}
        style={wellStyles}
      >
        {" "}
        {header} {childrenWithMoreProps}
      </div>
    );
  });
  return dropComponents;
};

export default DropComponents;
