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
    ipcRenderer.send("createNewAnalysis", this.state);
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
    if (this.state.canContinue) {
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
