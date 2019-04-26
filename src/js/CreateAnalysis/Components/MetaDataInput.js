import React, {Component} from "react";

import NavigationButton from "./NavigationButton.js";
import TextField from "@material-ui/core/TextField";

import {Messages} from "../../Alerts/Messages.js";

import {withStyles} from "@material-ui/core/styles";

const ipcRenderer = window.ipcRenderer;

const styles = theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "20vh 25vw 0vh 28vw",
    textAlign: "left",
    height: "80vh",
    alignItems: "center"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400,
    fontSize: 25
  },
  inputField: {
    fontSize: 25
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
});
var backButtonStyles = {
  marginLeft: "10vw",
  marginTop: "-50px",
  float: "left"
};

var nextButtonStyles = {
  float: "right",
  marginRight: "10vw",
  marginTop: "-50px"
};

const formFields = [
  {
    type: "name",
    label: "Analysis Name"
  },
  {type: "jiraId", label: "Jira ID"},
  {type: "description", label: "Description"}
];

class MetaDataInput extends Component {
  constructor(props, context) {
    super(props, context);

    this.setField = this.setField.bind(this);

    this.state = {
      name: "",
      description: "",
      jiraId: "",
      canContinue: false,
      filePaths: this.props.filePaths,
      isInProgress: false,
      inputMinLength: 5
    };
  }

  setField(event, type) {
    var newValue = {};
    newValue[type] = event.target.value;
    this.setState({...newValue});
  }

  createNewAnalysis = () => {
    ipcRenderer.send("createNewAnalysis", this.state);
    this.props.nextClick({...this.state.filePaths});
  };

  dynamicMessage = (originalMessage, fieldName) =>
    originalMessage.replace("{field}", fieldName);

  isCorrectInput = (type, fieldName) => {
    var field = this.state[type];
    var message;
    if (field.indexOf(" ") >= 0) {
      message = Messages.warningFieldHasSpaces;
    } else if (/[~`!#$%\^&*+=\';,/{}|\\":<>\?]/g.test(field)) {
      message = Messages.warningFieldHasSpecialCharacters;
    } else if (field.length <= this.state.inputMinLength) {
      message = Messages.warningFieldNotMinLength;
    } else if (field.length === 0) {
      message = Messages.warningFieldIsEmpty;
    }

    if (message) {
      ipcRenderer.send(
        "sendOutWarning",
        this.dynamicMessage(message, fieldName)
      );
    }
    return typeof message === "undefined";
  };

  checkInput = () => {
    if (
      this.isCorrectInput("name", "Analysis Name") &&
      this.isCorrectInput("jiraId", "Jira ID")
    ) {
      this.createNewAnalysis();
    }
  };
  render() {
    var {classes} = this.props;

    return (
      <div>
        <form className={classes.container}>
          {formFields.map(field => (
            <TextField
              required
              id={field.type}
              label={field.label}
              className={classes.textField}
              value={this.state[field.type]}
              onChange={e => this.setField(e, field.type)}
              margin="normal"
            />
          ))}
        </form>
        <NavigationButton
          style={backButtonStyles}
          click={() => this.props.backClick({...this.state.filePaths})}
          isBack={true}
        />
        <NavigationButton style={nextButtonStyles} click={this.checkInput} />
      </div>
    );
  }
}

export default withStyles(styles)(MetaDataInput);
