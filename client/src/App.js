import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/layouts/Header";
import Home from "./components/layouts/Home";
import About from "./components/layouts/About";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ContactUs from "./components/layouts/ContactUs";
import LeaderBoard from "./components/layouts/LeaderBoard";
import Profile from "./components/layouts/Profile";
import { Provider } from "./context";

import "./App.css";

export default class App extends Component {
  render() {
    return (
      <Provider>
        <Router>
          <Header branding="Fingers.on.Fire"></Header>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/contactus" component={ContactUs} />
            <Route exact path="/leaderboard" component={LeaderBoard} />
            <Route exact path="/profile" component={Profile} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}
