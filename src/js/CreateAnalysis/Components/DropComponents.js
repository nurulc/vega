import React, {Component} from "react";
import {Panel, ListGroup} from "react-bootstrap";
import SelectedFileListPanel from "./SelectedFileListPanel";
import {PageHeader} from "react-bootstrap";

var wellStyles = {
  width: "40%",
  margin: "2.5% 5% 10% 5%",
  textAlign: "center",
  padding: "0% 2% 40% 2%",
  marginBottom: "20px",
  backgroundColor: "#f5f5f5",
  border: "2px dashed #e3e3e3",
  borderRadius: "4px",
  boxShadow: "inset 0 1px 1px rgba(0,0,0,.05)"
};

class DropComponents extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {state} = this.props;
    //Create a boxed component for the user to drop and delete files
    const dropComponents = state.input.map(inputObj => {
      const filePaths = state.filePaths[inputObj.type];

      var fileListComponent = "";
      if (filePaths.length !== 0) {
        fileListComponent = (
          <SelectedFileListPanel
            choosenFiles={state.filePaths[inputObj.type]}
            dragtype={inputObj.type}
            onDelete={(file, type) => this.props.setFileList(type, file, true)}
          />
        );
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
          {header} {fileListComponent}
        </div>
      );
    });
    return dropComponents;
  }
}

export default DropComponents;
