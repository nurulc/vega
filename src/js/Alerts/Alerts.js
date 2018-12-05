import React from "react";
import Snackbar from "material-ui/Snackbar";
import isElectron from "is-electron";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

const ipcRenderer = window.ipcRenderer;
export default class Alert extends React.Component {
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
      ipcRenderer.on("error-WithMsg", (event, msg) => {
        this.handleError(msg);
      });
    }
  }
  componentWillUnMount() {
    clearTimeout(this.timer);
  }

  handleError = msg => {
    this.setState({
      open: true,
      message: msg
    });

    this.timer = setTimeout(() => {}, 1500);
  };

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <Snackbar
            open={this.state.open}
            message={this.state.message}
            action="X"
            autoHideDuration={3000}
            onRequestClose={this.handleRequestClose}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}
