import React, {Component} from "react";
import {Redirect} from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import CheckIcon from "@material-ui/icons/Check";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";

import {withStyles} from "@material-ui/core/styles";

import {twirl} from "./../../BackendInit/loadingArt.js";
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

const loadingStageTypes = ["Tree", "Segment", "Analysis"];
const textCompleteDisplay = {
  0: "Tree data has been loaded.",
  1: "Segment data has been loaded.",
  2: "Analysis has been loaded"
};
const textPendingDisplay = {
  0: "Loading tree data.",
  1: "Loading segement data.",
  2: "Loading anaylsis data."
};

class GoToAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      if (loadingStageTypes.length === stepNumber) {
        loadedAnalysisId = JSON.parse(
          currSteps.Analysis.split("-AnalysisDone")[0]
        ).analysis_id;
        //Force the header to advance to complete
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

  forceStopSimulation = () =>
    d3
      .select(this._rootNode)
      .selectAll("*")
      .interrupt();

  typeHasBeenLoaded = type => this.state.completeTypes.indexOf(type) !== -1;

  externalLinkClick(analysisId) {
    ipcRenderer.send("goToExternalLink", analysisId, true);
  }

  _setRef(componentNode) {
    this._rootNode = componentNode;
  }

  render() {
    var {loadedAnalysisId} = this.state;
    var progressElements =
      this.state.loadedAnalysisId === null ? (
        <AnalysisLoadingProgress
          getStageStatusIcon={getStageStatusIcon}
          typeHasBeenLoaded={this.typeHasBeenLoaded}
        />
      ) : (
        <AnalysisLoadingComplete
          wrapper={wrapper}
          forceRedirect={this.externalLinkClick(this.state.loadedAnalysisId)}
        />
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
const AnalysisLoadingProgress = ({typeHasBeenLoaded, stageStatusIcon}) => {
  return loadingStageTypes.map((stage, index) => {
    var isTypeLoaded = typeHasBeenLoaded(stage);
    var stageStatusIcon = getStageStatusIcon(isTypeLoaded);
    return (
      <div>
        <ExpansionPanel style={{boxShadow: "none"}}>
          <ExpansionPanelSummary expandIcon={stageStatusIcon}>
            <Typography variant="h5" component="h3">
              {isTypeLoaded
                ? textCompleteDisplay[index]
                : textPendingDisplay[index]}
            </Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      </div>
    );
  });
};

const AnalysisLoadingComplete = ({wrapper, forceRedirect}) => (
  <div style={wrapper}>
    {forceRedirect}
    <Redirect to="/OpenAnalysis" push />
  </div>
);

const getStageStatusIcon = isTypeLoaded =>
  isTypeLoaded ? (
    <CheckIcon color="primary" />
  ) : (
    <FiberManualRecord fontSize="small" />
  );

export default withStyles(styles)(GoToAnalysis);
