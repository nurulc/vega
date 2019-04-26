import React, {Component} from "react";
import isElectron from "is-electron";

import {initStages} from "../../resources/config";

import LoadingCounter from "./LoadingCounter.js";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import CheckIcon from "@material-ui/icons/Check";

import {Redirect} from "react-router-dom";
import {twirl, twirlData} from "./loadingArt.js";
import * as d3 from "d3";

const ipcRenderer = window.ipcRenderer;
const numStages = 6;
const completeStageMessages = {
  0: "Created a clean workspace",
  1: "Fetched Lyra frontend components",
  2: "Fetched database components",
  3: "Fetched graphql components",
  4: "Built Lyra",
  5: "Created your data loaders",
  6: "Complete"
};
const pendingStageMessages = {
  0: "Creating a clean workspace",
  1: "Fetching Lyra frontend components",
  2: "Fetching database components",
  3: "Fetching graphql components",
  4: "Building Lyra",
  5: "Creating your data loaders",
  6: "Complete"
};
class LoadBackend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dbIsUp: false,
      hasCompleted: [],
      canContinue: false
    };
  }

  componentDidMount() {
    var svg = d3
      .select(this._rootNode)
      .append("svg")
      .attr("width", "100vw")
      .attr("height", "50vh")
      .attr("class", "container")
      .append("g")
      .attr("transform", "translate(400,300)");

    twirl(svg, twirlData);

    if (isElectron()) {
      ipcRenderer.on("pollDb", event => {
        ipcRenderer.send("pollDb");
      });
      ipcRenderer.on("dbIsUp", event => {
        this.setState({dbIsUp: true});
      });

      ipcRenderer.on("intputStages", (event, args, consoleStep) => {
        var completeMarker = initStages[consoleStep].completeMarker;
        //If feedback from the process is the complete marker or it is "none" continue
        if (args.includes(completeMarker) || completeMarker === "none") {
          //Is this the last stage?
          if (numStages === this.state.hasCompleted.length + 1) {
            this.setState({canContinue: true});
          } else {
            var completeSet = [...this.state.hasCompleted, consoleStep];
            this.setState({hasCompleted: completeSet});
          }
        }
      });
    }
  }

  stepHasCompleted = i => this.state.hasCompleted.includes(i);
  getStageStatusIcon = isStepComplete =>
    isStepComplete ? (
      <CheckIcon color="primary" />
    ) : (
      <FiberManualRecord fontSize="small" />
    );

  componentWillMount() {
    //Get all analysis and poll to see if the db is up
    ipcRenderer.send("pollDb");
    ipcRenderer.send("loadBackend");
  }
  _setRef(componentNode) {
    this._rootNode = componentNode;
  }

  render() {
    var stages = "";
    if (this.state.canContinue && this.state.dbIsUp) {
      return (
        <div>
          <Redirect to="/OpenAnalysis" push />
        </div>
      );
    } else {
      stages = [...Array(numStages).keys()].map((stage, i) => {
        const stageStatus = this.getStageStatusIcon(this.stepHasCompleted(i));
        return (
          <div>
            <ExpansionPanel style={{boxShadow: "none"}}>
              <ExpansionPanelSummary expandIcon={stageStatus}>
                <Typography variant="h5" component="h3">
                  {this.stepHasCompleted(i)
                    ? completeStageMessages[i]
                    : pendingStageMessages[i]}
                </Typography>
              </ExpansionPanelSummary>
            </ExpansionPanel>
          </div>
        );
      });
    }

    return (
      <div>
        {" "}
        <div style={{transform: `translate(406px, 307px)`}}>
          <LoadingCounter
            completedSteps={this.state.hasCompleted.length}
            totalSteps={numStages}
          />
        </div>
        <div id="loadingArt" ref={this._setRef.bind(this)} />
        {stages}
      </div>
    );
  }
}
export default LoadBackend;
