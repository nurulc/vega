import React from "react";
import {Panel, ListGroup} from "react-bootstrap";
import SelectedFileList from "./SelectedFileList";

const SelectedFileListPanel = props => {
  const {choosenFiles, dragtype} = props;
  const selectionText = choosenFiles.map(fileName => (
    <SelectedFileList
      fileName={fileName}
      handleDelete={() => props.onDelete(fileName, dragtype)}
    />
  ));

  return (
    <Panel dragtype={dragtype}>
      <Panel.Heading>Selected {dragtype}</Panel.Heading>
      <ListGroup dragtype={dragtype}>{selectionText}</ListGroup>
    </Panel>
  );
};

export default SelectedFileListPanel;
