import React, {Component} from "react";
import isElectron from "is-electron";

import {initStages} from "../../resources/config";
import OpenAnalysis from "./../OpenAnalysis/OpenAnalysis";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import {Redirect} from "react-router-dom";
import Delay from "react-delay";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import CheckIcon from "@material-ui/icons/Check";

import {twirl} from "./loadingArt.js";
import * as d3 from "d3";

const ipcRenderer = window.ipcRenderer;

class LoadBackend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCompleted: [],
      canContinue: false,
      numStages: 6,
      completeStageMessages: {
        0: "Created a clean workspace",
        1: "Fetched Lyra frontend components",
        2: "Fetched database components",
        3: "Fetched graphql components",
        4: "Built Lyra",
        5: "Created your data loaders",
        6: "Complete"
      },
      pendingStageMessages: {
        0: "Creating a clean workspace",
        1: "Fetching Lyra frontend components",
        2: "Fetching database components",
        3: "Fetching graphql components",
        4: "Building Lyra",
        5: "Creating your data loaders",
        6: "Complete"
      },
      currStage: 0
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

    twirl(svg);

    if (isElectron()) {
      ipcRenderer.on("test", (event, args) => {
        console.log(args);
      });
      ipcRenderer.on("intputStages", (event, args, consoleStep) => {
        console.log(args);
        var completeMarker = initStages[consoleStep].completeMarker;
        if (args.includes(completeMarker) || completeMarker === "none") {
          if (this.state.numStages === this.state.hasCompleted.length + 1) {
            //New stage
            setTimeout(
              function() {
                this.setState({canContinue: true});
              }.bind(this),
              2000
            );
          } else {
            console.log(this.state.hasCompleted);
            console.log(consoleStep);
            var completeSet = [...this.state.hasCompleted, consoleStep];
            this.setState({hasCompleted: completeSet});
          }
        }
      });
    }
  }
  stepHasCompleted = i => this.state.hasCompleted.includes(i);
  componentWillMount() {
    //Get all analysis
    ipcRenderer.send("loadBackend");
  }
  _setRef(componentNode) {
    this._rootNode = componentNode;
  }

  render() {
    var stages = "";
    if (this.state.canContinue) {
      return (
        <div>
          <Redirect to="/OpenAnalysis" push />
        </div>
      );
    } else {
      stages = [...Array(this.state.numStages).keys()].map((stage, i) => {
        const stageStatus = this.stepHasCompleted(i) ? (
          <CheckIcon color="primary" />
        ) : (
          <FiberManualRecord fontSize="small" />
        );
        return (
          <div>
            <ExpansionPanel style={{boxShadow: "none"}}>
              <ExpansionPanelSummary expandIcon={stageStatus}>
                <Typography variant="h5" component="h3">
                  {this.stepHasCompleted(i)
                    ? this.state.completeStageMessages[i]
                    : this.state.pendingStageMessages[i]}
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
        <div id="loadingArt" ref={this._setRef.bind(this)} />
        {stages}
      </div>
    );
  }
}
export default LoadBackend;
