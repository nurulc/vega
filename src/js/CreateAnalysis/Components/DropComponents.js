import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import EnhancedButton from "./EnhancedButton.js";

const classes = theme => ({
  root: {
    padding: "7px",
    width: "35vw",
    height: "100%",
    margin: "2.5% 5% 0% 5%",
    textAlign: "center",
    backgroundColor: "white",
    border: "1px dashed #e3e3e3",
    borderRadius: "4px",
    boxShadow: "inset 0 1px 1px rgba(0,0,0,.05)"
  },
  buttonText: {
    fontWeight: "bold"
  }
});
const headerStyles = {
  margin: "0 auto",
  paddingTop: "60%"
};
const DropComponents = ({
  input,
  fileList,
  fileSelection,
  children,
  onDelete,
  classes
}) => {
  //Create a boxed component for the user to drop and delete files

  const header = (
    <div>
      <Typography variant="h5" gutterBottom>
        Drag and drop files here
      </Typography>
      <Typography variant="h5" gutterBottom>
        or
      </Typography>
    </div>
  );
  const uploadButton = type => (
    <div>
      <input
        style={{display: "none"}}
        accept="*"
        id={"fileSelectionButton"}
        multiple
        onChange={() => fileSelection()}
        type="file"
      />
      <label htmlFor={"fileSelectionButton"}>
        <EnhancedButton text={"Upload"} />
      </label>
    </div>
  );
  //Entire drop component with box outline
  return (
    <Paper
      className={classNames(classes.root, "dragWells", "wells")}
      elevation={1}
    >
      {" "}
      <div style={headerStyles}>
        {header}
        {uploadButton()}
      </div>
    </Paper>
  );
};

export default withStyles(classes)(DropComponents);
