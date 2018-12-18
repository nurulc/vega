import React from "react";
import {Button, ButtonGroup} from "reactstrap";
import {dashboardConfig, projectColours} from "../resources/config";
import {NavLink} from "react-router-dom";
import "./Home.css";

const wellStyles = {
  position: "absolute",
  top: "40%",
  left: "25%"
};

const buttonStyles = {
  padding: "25px",
  marginRight: "50px",
  backgroundColor: [projectColours.colour3],
  borderColor: [projectColours.colour1]
};

const Home = () => {
  return (
    <ButtonGroup style={wellStyles}>
      <NavLink to="/OpenAnalysis">
        <Button color="primary" size="lg" style={buttonStyles}>
          Open Existing Analysis{" "}
        </Button>{" "}
      </NavLink>{" "}
      <NavLink
        to={{
          pathname: "/CreateAnalysis",
          state: {dashboardConfig}
        }}
      >
        <Button color="primary" size="lg" style={buttonStyles}>
          Create New Analysis{" "}
        </Button>{" "}
      </NavLink>{" "}
    </ButtonGroup>
  );
};
export default Home;
