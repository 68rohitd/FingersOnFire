import { Line } from "react-chartjs-2";
import React, { Component } from "react";
import Axios from "axios";
import { Consumer } from "../../context";
import { Redirect } from "react-router-dom";

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      deleteAccount: false,

      labels: [], //x axis
      datasets: [
        {
          label: "Progress",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "rgba(0,0,0,1)",
          borderWidth: 2,
          data: [], //y axis
        },
      ],
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem("auth-token");
    const userId = localStorage.getItem("userId");

    if (userId) {
      try {
        const tokenRes = await Axios.post("/users/tokenIsValid", null, {
          headers: { "x-auth-token": token },
        });

        if (tokenRes.data) {
          const userRes = await Axios.get("/users", {
            headers: { "x-auth-token": token },
          });

          console.log(userRes.data);

          let datasets = [...this.state.datasets];
          datasets[0].data = userRes.data.progress;

          this.setState({
            labels: userRes.data.progress,
            datasets,
          });
        }
      } catch (err) {
        console.log("ERROR: ", err);
      }
    }
  }

  OnDeleteAccount = async (dispatch) => {
    const token = localStorage.getItem("auth-token");
    const userId = localStorage.getItem("userId");

    try {
      await Axios.delete(`/users/delete/${userId}`, {
        headers: { "x-auth-token": token },
      });

      localStorage.setItem("auth-token", "");
      localStorage.setItem("userId", "");

      dispatch({
        type: "LOGGED_OUT",
      });
    } catch (err) {
      console.log(err.response.data);
    }
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { dispatch, user, token } = value;
          if (user === undefined) user = "";

          if (token) {
            return (
              <div className="container">
                <div className="row" style={{ display: "block" }}>
                  <h1>Profile</h1>
                  <p className="mb-0">
                    <b>Name: </b>
                    {user.displayName}
                  </p>
                  <p className="mb-0">
                    <b>Highest WPM: </b>
                    {user.userHighestNetWpm}
                  </p>
                  <p
                    className="mb-0"
                    onClick={() =>
                      this.setState({
                        deleteAccount: !this.state.deleteAccount,
                      })
                    }
                  >
                    <span
                      className="text-secondary"
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      Delete my account
                    </span>
                  </p>

                  {this.state.deleteAccount ? (
                    <>
                      <p className="text-secondary">
                        Are you sure? There's no going back!
                      </p>
                      <button
                        className="btn btn-danger"
                        onClick={this.OnDeleteAccount.bind(this, dispatch)}
                      >
                        Delete Account
                      </button>
                    </>
                  ) : null}
                </div>

                <hr />

                <div className="row" style={{ display: "block" }}>
                  <div className="">
                    <h4>Recent Activity</h4>
                  </div>
                  <div style={{ width: "700px" }}>
                    <Line
                      data={this.state}
                      options={{
                        title: {
                          display: true,
                          fontSize: 20,
                        },
                        legend: {
                          display: true,
                          position: "right",
                        },
                      }}
                    />
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
