import Button from "@material-ui/core/Button";
import {NavLink} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import React from "react";

const buttonStyles = theme => ({
  root: {
    float: "right",
    marginRight: "5%",
    marginTop: "8px"
  }
});

const EnhancedButton = props => {
  const {classes} = props;
  return (
    <Button
      component={NavLink}
      to={{
        pathname: "/MetaDataInput",
        state: {filePaths: {...props.filePaths}}
      }}
      className={classes.root}
      size="large"
      variant="contained"
    >
      Continue
    </Button>
  );
};
export default withStyles(buttonStyles)(EnhancedButton);
