import React from "react";
import {Panel, ListGroup} from "react-bootstrap";
import SelectedFileList from "./SelectedFileList";

const SelectedFileListPanel = props => {
  const {choosenFiles, dragType} = props;

  const selectedPanel = choosenFiles.map(fileName => {
    return React.Children.map(props.children, child => {
      if (child.type === SelectedFileList) {
        return React.cloneElement(child, {
          fileName: fileName,
          onDelete: () => props.onDelete(fileName, props.dragType)
        });
      }
    });
  });

  return (
    <Panel dragtype={dragType}>
      <Panel.Heading>Selected {dragType} files</Panel.Heading>
      <ListGroup dragtype={dragType}>{selectedPanel}</ListGroup>
    </Panel>
  );
};

export default SelectedFileListPanel;
