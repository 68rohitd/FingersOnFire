import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Consumer } from "../../context";
import "../../assets/login-signup.css";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      error: "",
      disabled: false,
    };
  }

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable loggin btn
    this.setState({
      disabled: true,
    });

    const { email, password } = this.state;

    try {
      const loggedInUser = await axios.post("/users/login", {
        email,
        password,
      });
      console.log("logged in successfully: ", loggedInUser.data);

      localStorage.setItem("auth-token", loggedInUser.data.token);
      localStorage.setItem("userId", loggedInUser.data.user.id);

      dispatch({
        type: "LOGGED_IN",
        payload: {
          user: loggedInUser.data.user,
          token: loggedInUser.data.token,
        },
      });
      this.props.history.push("/");
    } catch (err) {
      // enable login btn
      this.setState({
        disabled: false,
      });

      console.log("ERROR: ", err);
      this.setState({ error: err.response.data.msg });
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <Consumer>
        {(value) => {
          let { dispatch, token } = value;
          if (token === undefined) token = "";
          const { error } = this.state;

          if (!token) {
            return (
              <div
                className="row m-0"
                style={{ "justify-content": "space-evenly" }}
              >
                <div className="col-md-4">
                  <div className="container">
                    <form
                      className="loginForm "
                      onSubmit={this.onSubmit.bind(this, dispatch)}
                      style={{ marginTop: "85px" }}
                    >
                      <h3 className="loginText text-center mt-3">
                        Login to Your Account
                      </h3>
                      {error.length ? (
                        <div className="alert alert-danger mt-4">{error}</div>
                      ) : null}
                      <input
                        type="email"
                        name="email"
                        className="form-control mb-3 mt-4"
                        placeholder="Email id"
                        onChange={this.onChange}
                        required
                      />
                      <input
                        name="password"
                        type="password"
                        className="form-control"
                        placeholder="password"
                        onChange={this.onChange}
                        required
                      />
                      <input
                        disabled={this.state.disabled}
                        type="submit"
                        value="Login"
                        className="btn btn-success btn-block mt-3"
                      />
                    </form>
                  </div>
                </div>
              </div>
            );
          } else {
            return <Redirect to="/" />;
          }
        }}
      </Consumer>
    );
  }
}

export default Login;
