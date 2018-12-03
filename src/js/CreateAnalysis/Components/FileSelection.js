import React from "react";
import { Panel, ListGroup } from "react-bootstrap";
import FileSelectionPanel from "./FileSelectionPanel";

const FileSelection = ({ choosenFiles, type, id, dragtype }) => {
  const removeOption = removedOption => {
    choosenFiles.reduce(file => {
      if (file !== removedOption) return file;
    }, []);
    return choosenFiles;
  };

  const selectionText = choosenFiles.map(fileName => (
    <FileSelectionPanel fileName={fileName} dragtype={dragtype}/>
  ));
  return (
    <Panel id={id} dragtype={dragtype}>
      <Panel.Heading>Selected {type}</Panel.Heading>
      <ListGroup id={id + "-option"} dragtype={dragtype}>{selectionText}</ListGroup>
    </Panel>
  );
};

export default FileSelection;
