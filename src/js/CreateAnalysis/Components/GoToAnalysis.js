import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import classNames from "classnames";
import Paper from "@material-ui/core/Paper";
import Check from "@material-ui/icons/Check";
import OpenInNew from "@material-ui/icons/OpenInNew";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Link from "@material-ui/core/Link";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";

import {NavLink} from "react-router-dom";
const ipcRenderer = window.ipcRenderer;

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 4,
    backgroundColor: "inherit",
    boxShadow: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  list: {marginLeft: "-10vw"},
  link: {cursor: "-webkit-grab"}
});
const typeStyle = {
  display: "inline",
  paddingTop: "4vh"
};
const wrapper = {
  display: "flex",
  verticalAlign: "middle",
  justifyContent: "center",
  marginTop: "25vh"
};
const iconStyle = {
  width: 60,
  height: 60,
  display: "block",
  marginTop: " 10%",
  marginLeft: "35%"
};
class GoToAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: {},
      types: [],
      maxTypes: 3,
      loadedAnalysisId: null,
      roundProgressActive: false
    };
  }
  componentDidMount() {
    ipcRenderer.on("isRoundProgressActive", (event, isActive) => {
      this.setState({roundProgressActive: isActive});
    });

    ipcRenderer.on("analysisLoadingStep", (event, args, type) => {
      var currSteps = this.state.steps;

      currSteps[type] = currSteps.hasOwnProperty(type)
        ? [...currSteps[type], args]
        : [args];

      var types =
        this.state.types.indexOf(type) === -1
          ? [...this.state.types, type]
          : [...this.state.types];

      var loadedAnalysisId = null;
      if (this.state.maxTypes === types.length) {
        loadedAnalysisId = JSON.parse(
          currSteps.Analysis[0].replace("-AnalysisDone", "")
        ).analysis_id;
        this.props.nextClick({});
        this.props.nextClick({});
      }

      this.setState({
        steps: currSteps,
        types: types,
        loadedAnalysisId: loadedAnalysisId
      });
    });
  }

  externalLinkClick(id) {
    ipcRenderer.send("goToExternalLink", id, true);
  }

  render() {
    const {classes} = this.props;
    return (
      <div style={wrapper}>
        <List
          component="nav"
          className={classNames(
            classes.root,
            this.state.types.length > 0 ? classes.list : ""
          )}
        >
          {this.state.types.map(type => {
            return (
              <div>
                <ListItem button>
                  <Check color="primary" />
                  <ListItemText>
                    {" "}
                    <Typography variant="h5" component="h3" style={typeStyle}>
                      {type} data has been added
                    </Typography>
                  </ListItemText>
                </ListItem>
                <Divider />
              </div>
            );
          })}{" "}
        </List>{" "}
        <Paper className={classes.root} elevation={1}>
          {this.state.roundProgressActive ? (
            <CircularProgress color="primary" />
          ) : this.state.loadedAnalysisId ? (
            <Typography variant="h5" component="h3" style={typeStyle}>
              Analysis loading complete.
              <Link
                className={classes.link}
                onClick={() =>
                  this.externalLinkClick(this.state.loadedAnalysisId)
                }
              >
                <NavLink to="/OpenAnalysis">
                  <OpenInNew color="primary" style={iconStyle} />
                </NavLink>
              </Link>
              {this.state.successLink}
            </Typography>
          ) : (
            ""
          )}{" "}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(GoToAnalysis);
