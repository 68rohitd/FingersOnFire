import React, { Component } from "react";
import { Consumer } from "../../context";
import classNames from "classnames";
import Axios from "axios";

export default class LeaderBoard extends Component {
  constructor() {
    super();

    this.state = {
      leaderboard: [],
    };
  }

  onRefresh = async () => {
    // get leaderboard
    const leaderboard = await Axios.get("/leaderboard/getData");

    this.setState({ leaderboard: leaderboard.data });
  };

  async componentDidMount() {
    // get leaderboard
    const leaderboard = await Axios.get("/leaderboard/getData");

    this.setState({ leaderboard: leaderboard.data });
  }

  render() {
    return (
      <Consumer>
        {(value) => {
          let { leaderboard } = this.state;
          const userId = localStorage.getItem("userId");

          leaderboard = leaderboard.sort(function (a, b) {
            return b.highestNetWpm - a.highestNetWpm;
          });

          return (
            <div className="container mt-5 ">
              <div className="row">
                <div className="col-1">
                  <i
                    className="fa fa-refresh"
                    style={{ cursor: "pointer", fontSize: "20px" }}
                    onClick={this.onRefresh}
                  ></i>
                </div>
                <div className="col">
                  <div className="table-responsive">
                    <table className="table table-hover table-dark">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">WPM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((entry, i) => {
                          return (
                            <tr
                              className={classNames({
                                "table-success font-weight-bold":
                                  userId === entry.userId,
                                "text-dark": userId === entry.userId,
                              })}
                              key={i}
                            >
                              <th scope="row">{i + 1}</th>
                              <td>{entry.name.toUpperCase()}</td>
                              <td>{entry.highestNetWpm}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
