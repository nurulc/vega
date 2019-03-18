import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import CheckIcon from "@material-ui/icons/Check";
import {Redirect} from "react-router-dom";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";

import {twirl, endSimulation} from "./../../BackendInit/loadingArt.js";
import * as d3 from "d3";

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
const mainContainer = {
  display: "flex",
  flexDirection: "column",
  textAlign: "center"
};
const wrapper = {
  textAlign: "center"
};
class GoToAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      types: ["Tree", "Segment", "Analysis"],
      textCompleteDisplay: {
        0: "Tree data has been loaded.",
        1: "Segment data has been loaded.",
        2: "Analysis has been loaded"
      },
      textPendingDisplay: {
        0: "Loading tree data.",
        1: "Loading segement data.",
        2: "Loading anaylsis data."
      },
      steps: {},
      currStep: 0,
      completeTypes: [],
      numStages: 3,
      loadedAnalysisId: null
    };
  }
  componentDidMount() {
    var svg = d3
      .select(this._rootNode)
      .append("svg")
      .classed("loader", true)
      .attr("width", "100vw")
      .attr("height", "50vh")
      .attr("class", "container")
      .append("g")
      .attr("transform", "translate(350,300)");

    twirl(svg);

    ipcRenderer.on("analysisLoadingStep", (event, args, type) => {
      var currSteps = this.state.steps;
      var stepNumber = this.state.currStep;

      //Is it a new completed event
      if (currSteps.hasOwnProperty(type)) {
        currSteps[type] = currSteps[type] + args;
      } else {
        stepNumber = stepNumber + 1;
        currSteps[type] = args;
      }

      var completeTypes = !this.typeHasBeenLoaded(type)
        ? [...this.state.completeTypes, type]
        : [...this.state.completeTypes];

      var loadedAnalysisId = null;
      //All complete - set analysis ID
      if (this.state.numStages === stepNumber) {
        console.log(currSteps.Analysis.split("-AnalysisDone")[0]);
        loadedAnalysisId = JSON.parse(
          currSteps.Analysis.split("-AnalysisDone")[0]
        ).analysis_id;
        this.props.nextClick({});
        this.forceStopSimulation();
      }

      this.setState({
        currStep: stepNumber,
        steps: currSteps,
        completeTypes: completeTypes,
        loadedAnalysisId: loadedAnalysisId
      });
    });
  }
  forceStopSimulation = () => endSimulation(d3.select(".loader"));

  typeHasBeenLoaded = type => this.state.completeTypes.indexOf(type) !== -1;

  externalLinkClick(id) {
    ipcRenderer.send("goToExternalLink", id, true);
  }

  _setRef(componentNode) {
    this._rootNode = componentNode;
  }

  render() {
    const state = this.state;
    var progressElements =
      this.state.loadedAnalysisId === null ? (
        [...Array(state.numStages).keys()].map((stage, i) => {
          const type = state.types[i];
          const stageStatus = this.typeHasBeenLoaded(type) ? (
            <CheckIcon color="primary" />
          ) : (
            <FiberManualRecord fontSize="small" />
          );
          return (
            <div>
              <ExpansionPanel style={{boxShadow: "none"}}>
                <ExpansionPanelSummary expandIcon={stageStatus}>
                  <Typography variant="h5" component="h3">
                    {this.typeHasBeenLoaded(type)
                      ? state.textCompleteDisplay[i]
                      : state.textPendingDisplay[i]}
                  </Typography>
                </ExpansionPanelSummary>
              </ExpansionPanel>
            </div>
          );
        })
      ) : (
        <div style={wrapper}>
          {this.externalLinkClick(this.state.loadedAnalysisId)}
          <Redirect to="/OpenAnalysis" push />
        </div>
      );

    return (
      <div style={mainContainer}>
        <div>
          <div id="loadingArt" ref={this._setRef.bind(this)} />
          {progressElements}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(GoToAnalysis);
