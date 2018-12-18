import React, {Component} from "react";
import SelectedFileListPanel from "./SelectedFileListPanel";
import {PageHeader} from "react-bootstrap";

var wellStyles = {
  width: "40%",
  margin: "2.5% 5% 10% 5%",
  textAlign: "center",
  //height: "80%",
  padding: "0% 2% 40% 2%",
  backgroundColor: "white",
  border: "1px dashed #e3e3e3",
  borderRadius: "4px",
  boxShadow: "inset 0 1px 1px rgba(0,0,0,.05)"
};

const DropComponents = props => {
  const {input, fileList} = props;
  //Create a boxed component for the user to drop and delete files
  const dropComponents = input.map(inputObj => {
    const filePaths = fileList[inputObj.type];

    var childrenWithMoreProps = "";
    //If there are any already selected files
    if (filePaths.length !== 0) {
      childrenWithMoreProps = React.Children.map(props.children, child => {
        if (child.type === SelectedFileListPanel) {
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
        <small>Drag and drop {inputObj.type} files here </small>
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
