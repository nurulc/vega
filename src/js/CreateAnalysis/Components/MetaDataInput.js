import React, {Component} from "react";
import {FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import EnhancedButton from "./EnhancedButton.js";
const ipcRenderer = window.ipcRenderer;

var formStyles = {
  width: "50%",
  margin: "20% 5% 0% 25%",
  textAlign: "left",
  height: "60vh"
};
var inputStyles = {
  marginBottom: "2%"
};
var backButtonStyles = {
  float: "left",
  marginLeft: "5%"
};
var nextButtonStyles = {
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
      filePaths: this.props.filePaths
    };
  }
  componentDidMount() {
    ipcRenderer.on("analysisAdded", (event, args) => {
      //Display files that were added
      //console.log(args);
    });
  }
  getValidationState() {
    const length = this.state.name.length;
    if (length > 3) return "success";
    else if (length > 0) return "error";
    return null;
  }

  setName(e) {
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
      <EnhancedButton
        style={backButtonStyles}
        click={() => this.props.backClick({...this.state.filePaths})}
        text={"Back"}
      />
    );

    var continueButton = "";
    if (this.state.canContinue) {
      continueButton = (
        <EnhancedButton
          style={nextButtonStyles}
          click={() => this.createNewAnalysis()}
          text={"Next"}
        />
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
