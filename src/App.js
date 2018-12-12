import React, {Component} from "react";
import "./App.css";
import {
  Route,
  HashRouter,
  Switch,
  Redirect,
  BrowserRouter
} from "react-router-dom";
import OpenAnalysis from "./js/OpenAnalysis";
import CreateAnalysis from "./js/CreateAnalysis/CreateAnalysis";
import Home from "./js/Home";
import {PageHeader} from "react-bootstrap";
import Alert from "./js/Alerts/Alerts";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Alert />
          <div className="content">
            <BrowserRouter>
              <Switch>
                <Route exact path="/Home" component={Home} />
                <Route path="/OpenAnalysis" component={OpenAnalysis} />
                <Route path="/CreateAnalysis" component={CreateAnalysis} />
                <Redirect to="/Home" push />
              </Switch>
            </BrowserRouter>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default App;
