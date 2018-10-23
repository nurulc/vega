import React, { Component } from "react";
import { Button, PageHeader } from "react-bootstrap";
import { Route, NavLink, HashRouter } from "react-router-dom";
const wellStyles = { maxWidth: 500, margin: "25% auto 10px" };
const buttonStyles = { float: "right", display: "inline", marginLeft: "10px" };

class Home extends Component {
  render() {
    return (
      <div className="well" style={wellStyles}>
        <NavLink to="/OpenAnalysis">
          <Button bsSize="large" bsStyle="primary">
            Upload New Analysis
          </Button>
        </NavLink>
        <NavLink to="/CreateAnalysis">
          <Button bsSize="large" bsStyle="primary" style={buttonStyles}>
            Create New Analysis
          </Button>
        </NavLink>
      </div>
    );
  }
}
export default Home;
