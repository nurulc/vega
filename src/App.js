import React, {Component} from "react";
import "./App.css";
import {
  Route,
  HashRouter,
  Switch,
  Redirect,
  BrowserRouter
} from "react-router-dom";
import OpenAnalysis from "./js/OpenAnalysis/OpenAnalysis";
import CreateAnalysis from "./js/CreateAnalysis/CreateAnalysis";
import LoadBackend from "./js/BackendInit/LoadBackend";
import Alerts from "./js/Alerts/Alerts";
import {MuiThemeProvider} from "@material-ui/core/styles";
import {theme} from "./resources/config.js";

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <HashRouter>
          <div>
            <Alerts />
            <div className="content">
              <BrowserRouter>
                <Switch>
                  <Route exact path="/OpenAnalysis" component={OpenAnalysis} />
                  <Route path="/CreateAnalysis" component={CreateAnalysis} />
                  <Route path="/LoadBackend" component={LoadBackend} />
                  <Redirect to="/LoadBackend" push />
                </Switch>
              </BrowserRouter>
            </div>
          </div>
        </HashRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
