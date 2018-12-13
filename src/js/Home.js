import React, {Component} from "react";
import {
  Button,
  ButtonDropdown,
  ButtonGroup,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import {config} from "../resources/config";
import {NavLink} from "react-router-dom";

const wellStyles = {
  position: "absolute",
  top: "40%",
  left: "25%"
};
const buttonStyles = {
  marginRight: "50px"
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    const dropDownItems = config.dashboards.map(dashboard => {
      var newTo = {
        pathname: "/CreateAnalysis",
        state: {dashboard}
      };
      return (
        <DropdownItem header>
          <NavLink to={newTo}>{dashboard.name}</NavLink>
        </DropdownItem>
      );
    });

    return (
      <ButtonGroup style={wellStyles}>
        <NavLink to="/OpenAnalysis">
          <Button color="primary" size="lg" style={buttonStyles}>
            Open Existing Analysis{" "}
          </Button>{" "}
        </NavLink>{" "}
        <ButtonDropdown
          size="lg"
          isOpen={this.state.dropdownOpen}
          toggle={this.toggle}
          direction="down"
          style={buttonStyles}
        >
          <DropdownToggle caret color="info">
            Create New Analysis
          </DropdownToggle>
          <DropdownMenu right>{dropDownItems}</DropdownMenu>
        </ButtonDropdown>
      </ButtonGroup>
    );
  }
}
export default Home;
