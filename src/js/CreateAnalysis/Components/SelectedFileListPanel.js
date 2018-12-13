import React, {Component} from "react";
import {Panel, ListGroup} from "react-bootstrap";
import SelectedFileList from "./SelectedFileList";

class FileListPanel extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(filePath, type) {
    this.props.onDelete(filePath, type);
  }

  render() {
    const {choosenFiles, type, id, dragtype} = this.props;
    const selectionText = choosenFiles.map(fileName => (
      <SelectedFileList
        fileName={fileName}
        dragtype={dragtype}
        handleDelete={() => this.handleDelete(fileName, dragtype)}
      />
    ));

    return (
      <Panel id={id} dragtype={dragtype}>
        <Panel.Heading>Selected {type}</Panel.Heading>
        <ListGroup id={id + "-option"} dragtype={dragtype}>
          {selectionText}
        </ListGroup>
      </Panel>
    );
  }
}

export default FileListPanel;
