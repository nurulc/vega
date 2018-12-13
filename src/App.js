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
import MetaDataInput from "./js/MetaDataInput/MetaDataInput";
import Home from "./js/Home";
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
                <Route path="/MetaDataInput" component={MetaDataInput} />
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
