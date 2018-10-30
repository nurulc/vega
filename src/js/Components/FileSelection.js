import React from "react";
import { Panel, ListGroup } from "react-bootstrap";
import FileSelectionPanel from "./FileSelectionPanel";

const FileSelection = ({ choosenFiles, type, id }) => {
  const removeOption = removedOption => {
    choosenFiles.reduce(file => {
      if (file !== removedOption) return file;
    }, []);
    return choosenFiles;
  };

  const selectionText = choosenFiles.map(fileName => (
    <FileSelectionPanel fileName={fileName} />
  ));
  return (
    <Panel id={id}>
      <Panel.Heading>Selected {type}</Panel.Heading>
      <ListGroup id={id + "-option"}>{selectionText}</ListGroup>
    </Panel>
  );
};

export default FileSelection;
