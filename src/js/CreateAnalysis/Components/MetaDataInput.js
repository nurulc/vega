import React, {Component} from "react";
import NavigationButton from "./NavigationButton.js";
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core/styles";
import {Messages} from "../../Alerts/Messages.js";
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

class MetaDataInput extends Component {
  constructor(props, context) {
    super(props, context);

    this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setJiraId = this.setJiraId.bind(this);

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

  setName(e) {
    var inputText = e.target.value;
    this.setState({
      name: inputText
    });
  }

  setJiraId(e) {
    var inputText = e.target.value;
    this.setState({
      jiraId: inputText
    });
  }

  setDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  createNewAnalysis = () => {
    ipcRenderer.send("createNewAnalysis", this.state);
    this.props.nextClick({...this.state.filePaths});
  };

  isCorrectInput = (type, fieldName) => {
    console.log(typeof field);
    var field = this.state[type];
    var message;
    if (field.indexOf(" ") >= 0) {
      message = Messages.warningFieldHasSpaces.replace("{field}", fieldName);
    } else if (/[~`!#$%\^&*+=\';,/{}|\\":<>\?]/g.test(field)) {
      message = Messages.warningFieldHasSpecialCharacters.replace(
        "{field}",
        fieldName
      );
    } else if (field.length <= this.state.inputMinLength) {
      message = Messages.warningFieldNotMinLength.replace("{field}", fieldName);
    } else if (field.length === 0) {
      message = Messages.warningFieldIsEmpty.replace("{field}", fieldName);
    }

    if (message) {
      ipcRenderer.send("sendOutWarning", message);
      return false;
    } else {
      return true;
    }
  };
  checkInput = () => {
    if (
      this.isCorrectInput("name", "Analysis name") &&
      this.isCorrectInput("jiraId", "Jira ID")
    ) {
      this.createNewAnalysis();
    }
  };
  render() {
    var {classes} = this.props;
    const backButton = (
      <NavigationButton
        style={backButtonStyles}
        click={() => this.props.backClick({...this.state.filePaths})}
        isBack={true}
      />
    );

    var continueButton = (
      <NavigationButton style={nextButtonStyles} click={this.checkInput} />
    );

    return (
      <div>
        <form className={classes.container}>
          <TextField
            required
            id="name"
            label="Analysis Name"
            className={classes.textField}
            value={this.state.name}
            onChange={this.setName}
            margin="normal"
          />{" "}
          <TextField
            required
            id="jiraId"
            label="Jira ID"
            className={classes.textField}
            value={this.state.jiraId}
            onChange={this.setJiraId}
            margin="normal"
          />
          <TextField
            multiline
            id="description"
            label="Description"
            className={classes.textField}
            value={this.state.description}
            onChange={this.setDescription}
            margin="normal"
          />
        </form>
        {backButton}
        {continueButton}
      </div>
    );
  }
}

export default withStyles(styles)(MetaDataInput);
