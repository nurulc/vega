import React from "react";
import {ListGroupItem} from "react-bootstrap";
var closeButtonStyle = {
  float: "right"
};
const SelectedFileList = props => {
  return (
    <ListGroupItem>
      {props.fileName}
      <span
        aria-hidden="true"
        onClick={props.onDelete}
        style={closeButtonStyle}
      >
        &times;
      </span>
    </ListGroupItem>
  );
};
export default SelectedFileList;
