import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Route,
  NavLink,
  HashRouter,
  Switch,
  Redirect,
  BrowserRouter
} from "react-router-dom";
import OpenAnalysis from "./js/OpenAnalysis";
import CreateAnalysis from "./js/CreateAnalysis";
import Home from "./js/Home";

import { Button, PageHeader } from "react-bootstrap";
class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <PageHeader>Lyra</PageHeader>
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
