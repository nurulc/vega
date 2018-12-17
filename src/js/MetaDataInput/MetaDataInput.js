import React, {Component} from "react";
import {FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {Button} from "react-bootstrap";

const ipcRenderer = window.ipcRenderer;

var formStyles = {
  width: "50%",
  margin: "20% 5% 20% 25%",
  textAlign: "left",
  padding: "0% 2% 50% 2%"
};
var inputStyles = {
  marginBottom: "2%"
};
var backButtonStyles = {
  float: "left",
  marginRight: "5%"
};
var continueButtonStyles = {
  float: "right",
  marginRight: "5%"
};

class MetaDataInput extends Component {
  constructor(props, context) {
    super(props, context);

    this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);

    this.state = {
      name: "",
      descripton: "",
      canContinue: false,
      filePaths: this.props.location.state.filePaths
    };
  }
  componentDidMount() {
    ipcRenderer.on("analysisAdded", (event, args) => {
      console.log(args);
    });
  }
  getValidationState() {
    const length = this.state.name.length;
    if (length > 3) return "success";
    else if (length > 0) return "error";
    return null;
  }

  setName(e) {
    //  var continue = e.target.value.length > 2 ? true : false;
    this.setState({
      name: e.target.value,
      canContinue: e.target.value.length > 2
    });
  }

  setDescription(e) {
    this.setState({
      description: e.target.value
    });
  }
  createNewAnalysis = () => {
    console.log(this.state);
    ipcRenderer.send("createNewAnalysis", this.state);
  };
  render() {
    const backButton = (
      <Button style={backButtonStyles}>
        <NavLink to="/CreateAnalysis">Back</NavLink>
      </Button>
    );

    var continueButton = "";
    if (this.state.canContinue) {
      continueButton = (
        <Button style={continueButtonStyles} onClick={this.createNewAnalysis}>
          Create
        </Button>
      );
    }
    return (
      <div>
        <form style={formStyles}>
          <FormGroup
            controlId="formBasicText"
            validationState={this.getValidationState()}
          >
            <ControlLabel>Analysis Name:</ControlLabel>
            <FormControl
              type="text"
              name={this.state.name}
              onChange={this.setName}
              style={inputStyles}
            />
            <ControlLabel>Description:</ControlLabel>
            <FormControl
              type="text"
              description={this.state.description}
              onChange={this.setDescription}
              style={inputStyles}
            />
            <FormControl.Feedback />
          </FormGroup>
        </form>
        {backButton}
        {continueButton}
      </div>
    );
  }
}

export default MetaDataInput;
