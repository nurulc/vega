import React, {Component} from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import {Redirect} from "react-router-dom";
import isElectron from "is-electron";

import {twirl, twirlData} from "./loadingArt.js";
import * as d3 from "d3";

const ipcRenderer = window.ipcRenderer;
class DBStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dbStatus: true,
      onChange: false
    };
  }
  componentDidMount() {
    if (isElectron()) {
      ipcRenderer.on("signalLyraChange", (event, status) => {
        this.setState({onChange: status});
      });

      ipcRenderer.on("dbStatus", (event, status) => {
        this.setState({dbStatus: status});
      });
    }
  }
  componentDidUpdate() {
    var svg = d3
      .select(this._rootNode)
      .append("svg")
      .attr("width", "100vw")
      .attr("height", "80vh")
      .attr("class", "container")
      .append("g")
      .attr("transform", "translate(425,400)");

    twirl(svg);
  }
  _setRef(componentNode) {
    this._rootNode = componentNode;
  }

  svgCleanupCheck = (onChange, dbStatus) => {
    if (dbStatus & (onChange === "starting")) {
      d3.select(this._rootNode)
        .exit()
        .remove();
    }
  };
  getStyleStatus = onChange =>
    onChange
      ? {
          background: "white",
          opacity: 0.4,
          width: "100vw",
          height: "100vh"
        }
      : {};

  getLoaderVisual = (onChange, dbStatus) =>
    dbStatus & (onChange === "stopping") ? (
      <div id="loadingArt" ref={this._setRef.bind(this)} />
    ) : (
      ""
    );
  render() {
    const {onChange, dbStatus} = this.state;
    const statusStyle = this.getStyleStatus(onChange);
    const loader = this.getLoaderVisual(onChange, dbStatus);

    this.svgCleanupCheck(onChange, dbStatus);

    return dbStatus & (onChange === "starting") ? (
      <div>
        <Redirect to="/LoadBackend" push />
      </div>
    ) : (
      <div>
        {loader}
        <FormControlLabel
          value="start"
          control={<Radio color="primary" />}
          label={dbStatus ? "Lyra is on" : "Lyra is off"}
          labelPlacement="start"
          checked={dbStatus}
          style={{position: "absolute", bottom: 0, right: 20}}
        />
        <div style={statusStyle} />
      </div>
    );
  }
}
export default DBStatus;
