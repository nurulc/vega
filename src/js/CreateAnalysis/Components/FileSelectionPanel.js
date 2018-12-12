import React, {Component} from "react";
import {ListGroupItem} from "react-bootstrap";
var closeButtonStyle = {
  float: "right"
};
class FileSelectionPanel extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {fileName} = this.props;
    return (
      <ListGroupItem>
        {fileName}
        <span
          aria-hidden="true"
          onClick={this.props.handleDelete}
          style={closeButtonStyle}
        >
          &times;
        </span>
      </ListGroupItem>
    );
  }
}
export default FileSelectionPanel;
