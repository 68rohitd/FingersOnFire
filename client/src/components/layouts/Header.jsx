import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Consumer } from "../../context";
import "../../assets/header.css";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      deleteAccount: false,
    };
  }

  OnLogout = (dispatch) => {
    localStorage.setItem("auth-token", "");
    localStorage.setItem("userId", "");
    console.log("Logged out!");

    dispatch({
      type: "LOGGED_OUT",
    });
  };

  render() {
    const { branding } = this.props;

    return (
      <Consumer>
        {(value) => {
          let { dispatch, token, user } = value;

          if (token === undefined) token = "";
          if (user === undefined) user = "";

          // getting token from localstorage for removing delay
          const localToken = localStorage.getItem("auth-token");

          return (
            <>
              <nav className="myNavBar navbar sticky-top navbar-expand-lg navbar-light pb-1">
                <Link to="/" className="navbar-brand text-light block mx-4">
                  <span
                    style={{
                      fontFamily: "Pacifico, cursive",
                    }}
                  >
                    {branding}
                  </span>
                </Link>

                <button
                  className="hamIcon navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarNavAltMarkup"
                  style={{
                    position: "fixed",
                    right: "10px",
                    top: "10px",
                  }}
                >
                  <i className="fa fa-bars"></i>
                </button>

                <div
                  className="collapse navbar-collapse"
                  id="navbarNavAltMarkup"
                >
                  <div className="navbar-nav">
                    {/* leaderboard  */}
                    <li className="nav-item ">
                      <Link
                        to="/leaderboard"
                        className="nav-link text-light"
                        style={{ cursor: "pointer", fontSize: 16 }}
                      >
                        Leaderboard
                      </Link>
                    </li>
                    {/* about  */}
                    <li className="nav-item ">
                      <Link
                        to="/about"
                        className="nav-link text-light"
                        style={{ cursor: "pointer", fontSize: 16 }}
                      >
                        About
                      </Link>
                    </li>
                    {/* logout */}
                    {localToken ? (
                      <>
                        <li className="nav-item ">
                          <span
                            onClick={this.OnLogout.bind(this, dispatch)}
                            className="nav-link mb-2 text-light"
                            style={{ cursor: "pointer", fontSize: 16 }}
                          >
                            Logout
                          </span>
                        </li>
                      </>
                    ) : (
                      // signup or sign in
                      <>
                        <li className="nav-item ">
                          <Link
                            to="/signup"
                            className="nav-link text-light"
                            style={{ cursor: "pointer", fontSize: 16 }}
                          >
                            SignUp
                          </Link>
                        </li>
                        <li className="nav-item ">
                          <Link
                            to="/login"
                            className="nav-link text-light"
                            style={{ cursor: "pointer", fontSize: 16 }}
                          >
                            Login
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <Link
                        to="/contactUs"
                        className="nav-link text-light"
                        style={{ cursor: "pointer", fontSize: 16 }}
                      >
                        Contact Us
                      </Link>
                    </li>

                    {localToken ? (
                      <li>
                        <Link
                          to="/profile"
                          className="nav-link text-light"
                          style={{ cursor: "pointer", fontSize: 16 }}
                        >
                          Profile (
                          {user.displayName ? user.displayName : ". . ."})
                        </Link>
                      </li>
                    ) : null}
                  </div>
                </div>
              </nav>
            </>
          );
        }}
      </Consumer>
    );
  }
}

export default Header;
