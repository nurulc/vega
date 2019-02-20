import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Check from "@material-ui/icons/Check";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Link from "@material-ui/core/Link";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import CircularProgress from "@material-ui/core/CircularProgress";
const ipcRenderer = window.ipcRenderer;

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});
const spinnerStyle = {
  marginLeft: "45vw",
  marginTop: "10vh"
};
const typeStyle = {
  display: "inline"
};
const wrapper = {
  display: "flex",
  verticalAlign: "middle",
  marginTop: "25vh"
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
        <List component="nav" className={classes.root}>
          {this.state.types.map(type => {
            return (
              <div>
                <ListItem button>
                  <Check color="primary" />
                  <ListItemText>
                    {" "}
                    <Typography variant="h5" component="h3" style={typeStyle}>
                      {type} added
                    </Typography>
                  </ListItemText>
                </ListItem>
                <Divider />
              </div>
            );
          })}{" "}
          {this.state.roundProgressActive ? (
            <CircularProgress style={spinnerStyle} color="primary" />
          ) : (
            ""
          )}
        </List>
        {this.state.loadedAnalysisId ? (
          <Paper className={classes.root} elevation={1}>
            {" "}
            <Typography variant="h5" component="h3" style={typeStyle}>
              <Link
                className={classes.link}
                onClick={() =>
                  this.externalLinkClick(this.state.loadedAnalysisId)
                }
              >
                Analysis loaded here!
              </Link>
              {this.state.successLink}
            </Typography>
          </Paper>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withStyles(styles)(GoToAnalysis);
