import React from "react";
import {Panel, ListGroup} from "react-bootstrap";
import {ListGroupItem} from "react-bootstrap";

var closeButtonStyle = {
  float: "right",
  cursor: "pointer"
};

const SelectedFileList = props => {
  const {dragType, choosenFiles} = {...props};
  const selectedPanel = choosenFiles.map(fileName => {
    return (
      <ListGroupItem>
        {fileName}
        <span
          aria-hidden="true"
          onClick={() => props.onDelete(fileName, dragType)}
          style={closeButtonStyle}
        >
          &times;
        </span>
      </ListGroupItem>
    );
  });

  return (
    <Panel dragtype={dragType}>
      <ListGroup dragtype={dragType}>{selectedPanel}</ListGroup>
    </Panel>
  );
};
export default SelectedFileList;
