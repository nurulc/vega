import React from "react";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import NextIcon from "@material-ui/icons/NavigateNext";
import BackIcon from "@material-ui/icons/NavigateBefore";
import {withStyles} from "@material-ui/core/styles";
import {lighten} from "@material-ui/core/styles/colorManipulator";

const style = theme => ({
  root: {
    padding: "0px",
    borderRadius: "30px",
    color: lighten(theme.palette.secondary.light, 0.85)
  }
});
const NavigationButton = ({click, style, isBack, classes}) => {
  return (
    <Fab
      variant="extended"
      style={style}
      className={classes.root}
      onClick={() => click()}
    >
      {isBack ? <BackIcon /> : <NextIcon />}
    </Fab>
  );
};
export default withStyles(style)(NavigationButton);
