import React from "react";
import {ButtonGroup} from "reactstrap";
import {dashboardConfig, projectColours} from "../resources/config";
import {NavLink} from "react-router-dom";
import "./Home.css";

const wellStyles = {
  paddingTop: "30%",
  left: "17%"
};

const buttonStyles = {
  padding: "20px",
  marginRight: "180px",
  backgroundColor: "transparent"
};

const Home = () => {
  return (
    <ButtonGroup style={wellStyles}>
      <NavLink to="/OpenAnalysis">
        <button style={buttonStyles} className="homeButton">
          Open Existing Analysis{" "}
        </button>{" "}
      </NavLink>{" "}
      <NavLink to="/CreateAnalysis">
        <button style={buttonStyles} className="homeButton">
          Create New Analysis{" "}
        </button>{" "}
      </NavLink>{" "}
    </ButtonGroup>
  );
};
export default Home;
