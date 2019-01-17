import React from "react";
import classNames from "classnames";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import NextIcon from "@material-ui/icons/NavigateNext";
import AddIcon from "@material-ui/icons/Add";
import {NavLink} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {lighten} from "@material-ui/core/styles/colorManipulator";

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

const EnhancedTableToolbar = ({selectedAnalysis, classes}) => {
  var isSelected = selectedAnalysis && selectedAnalysis.hasOwnProperty("$loki");
  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: isSelected
      })}
    >
      <div className={classes.title}>
        {isSelected ? (
          <Typography color="inherit" variant="subtitle1">
            {selectedAnalysis.name} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            All Analysis
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {isSelected ? (
          <Tooltip title="Next">
            <IconButton aria-label="Next">
              <NextIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton aria-label="Add">
            <NavLink to="/CreateAnalysis">
              <AddIcon />
            </NavLink>
          </IconButton>
        )}
      </div>
    </Toolbar>
  );
};
export default withStyles(toolbarStyles)(EnhancedTableToolbar);
