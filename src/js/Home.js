import React from "react";
import {ButtonGroup} from "reactstrap";
import {NavLink} from "react-router-dom";
import "./Home.css";

const wellStyles = {
  paddingTop: "40%",
  left: "10vw"
};

const buttonStyles = {
  padding: "20px",
  marginRight: "150px",
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
