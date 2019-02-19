import React, {Component} from "react";
import Snackbar from "@material-ui/core/Snackbar";
import EnhancedSnackBarContents from "./EnhancedSnackBarContents.js";
import isElectron from "is-electron";
import {withStyles} from "@material-ui/core/styles";

const ipcRenderer = window.ipcRenderer;

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  }
});

class Alerts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      open: false
    };
    this.timer = undefined;
  }
  componentDidMount() {
    if (isElectron()) {
      ipcRenderer.on("error-WithMsg", (event, msg, timeOut) => {
        this.handleError(msg, timeOut);
      });
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleError = (msg, setTimeOut) => {
    var timeOut = setTimeOut ? setTimeOut : 1500;
    this.setState({
      open: true,
      message: msg
    });

    this.timer = setTimeout(() => {}, timeOut);
  };

  onClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const {classes} = this.props;
    return (
      <div>
        <Snackbar
          open={this.state.open}
          onClose={this.onClose}
          autoHideDuration={3000}
        >
          <EnhancedSnackBarContents
            onClose={this.onClose}
            message={this.state.message}
            className={classes.margin}
            variant="error"
          />
        </Snackbar>
      </div>
    );
  }
}
export default withStyles(styles)(Alerts);
