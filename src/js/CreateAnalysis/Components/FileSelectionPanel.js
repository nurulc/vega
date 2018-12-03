import React from "react";
import { ListGroupItem } from "react-bootstrap";
var closeButtonStyle = {
  float: "right"
};
const FileSelectionPanel = ({ fileName }) => (
  <ListGroupItem>
    {fileName}
    <span aria-hidden="true" style={closeButtonStyle}>
      &times;
    </span>
  </ListGroupItem>
);
export default FileSelectionPanel;
