import React, {Component} from "react";
import NavigationButton from "./NavigationButton.js";
import TextField from "@material-ui/core/TextField";
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

class MetaDataInput extends Component {
  constructor(props, context) {
    super(props, context);

    this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setJiraId = this.setJiraId.bind(this);

    this.state = {
      name: "",
      descripton: "",
      jiraId: "",
      canContinue: false,
      filePaths: this.props.filePaths,
      isInProgress: false
    };
  }
  setName(e) {
    this.setState({
      name: e.target.value
    });
  }
  setJiraId(e) {
    this.setState({
      jiraId: e.target.value
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
  render() {
    var {classes} = this.props;
    const backButton = (
      <NavigationButton
        style={backButtonStyles}
        click={() => this.props.backClick({...this.state.filePaths})}
        isBack={true}
      />
    );

    var continueButton = "";
    if (this.state.name.length > 4 && this.state.jiraId.length > 5) {
      continueButton = (
        <NavigationButton
          style={nextButtonStyles}
          click={() => this.createNewAnalysis()}
        />
      );
    }
    return (
      <div>
        <form className={classes.container}>
          <TextField
            id="name"
            label="Analysis Name"
            inputStyle={{fontSize: "50px"}}
            className={classes.textField}
            value={this.state.name}
            onChange={this.setName}
            margin="normal"
          />{" "}
          <TextField
            id="jiraId"
            label="Jira ID"
            inputStyle={{fontSize: "50px"}}
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
