import React, { Component } from "react";
import Axios from "axios";
import classNames from "classnames";
import { Consumer } from "../../context";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import "../../assets/home.css";

export default class home extends Component {
  constructor() {
    super();

    this.state = {
      entireUserText: "",
      userText: "",
      timeElapsed: 0,
      completed: false,
      grossWpm: 0,
      netWpm: 0,
      index: 0,
      wrong: 0,
      wrongChar: 0,
    };

    this.myInterval = null;
  }

  getData = async () => {
    try {
      const poem = await Axios.get(
        "https://poetrydb.org/author/Thomas%20Moore"
      );

      const num = Math.floor(Math.random() * 29 + 1);

      let text = poem.data[num].lines;
      let final = "";
      for (let i = 0; i < 5; i++) final += text[i] + " ";
      final = final.trim();

      return final;
    } catch (err) {
      console.log(err);
    }
  };

  onRefresh = async (dispatch) => {
    dispatch({
      type: "REFRESH",
      payload: {
        sampleText: "",
      },
    });

    clearInterval(this.myInterval);
    this.myInterval = null;

    toast.notify("Getting new poem...", {
      position: "top-right",
    });

    this.setState({
      userText: "",
      entireUserText: "",
      timeElapsed: 0,
      completed: false,
      grossWpm: 0,
      netWpm: 0,
      wrong: 0,
      wrongChar: 0,
      index: 0,
    });
    this.myInterval = null;

    const sampleText = await this.getData();

    dispatch({
      type: "REFRESH",
      payload: {
        sampleText,
      },
    });
  };

  onChange = (user, sampleText, dispatch, e) => {
    let len = this.state.entireUserText.length;
    const grossWpm = Math.floor(len / 5 / (this.state.timeElapsed / 60));

    let timeTaken = this.state.timeElapsed / 60;
    let chars = this.state.entireUserText.length;
    let wrong = this.state.wrongChar;
    let raw = chars / timeTaken / 5;
    let errorRate = wrong / timeTaken;
    const netWpm = Math.floor(raw - errorRate);

    this.setState(
      {
        [e.target.name]: e.target.value,
        grossWpm,
        netWpm: netWpm < 0 ? 0 : netWpm,
      },
      () => {
        if (this.state.userText.length >= 0 && this.myInterval === null)
          this.onStart();

        if (this.state.index === sampleText.split(" ").length)
          this.stopTimer(this.state.timeElapsed, user, sampleText, dispatch);
      }
    );
  };

  stopTimer = async (time, user, sampleText, dispatch) => {
    clearInterval(this.myInterval);

    this.setState({
      timeElapsed: time,
      completed: true,
    });

    // calculate WPM
    //  Gross WPM = ((no of char)/5 )/ min
    const len = sampleText.length;
    const grossWpm = Math.floor(len / 5 / (time / 60));

    let timeTaken = time / 60;
    let chars = sampleText.length;
    let wrong = this.state.wrongChar;
    let raw = chars / timeTaken / 5;
    let errorRate = wrong / timeTaken;
    const netWpm = Math.floor(raw - errorRate);

    this.setState({ grossWpm, netWpm: netWpm < 0 ? 0 : netWpm });

    const { userHighestNetWpm } = user;
    const userId = localStorage.getItem("userId");

    // new personal  record! so update user and leaderboard table, but only if hes logged in
    if (netWpm > userHighestNetWpm && userId !== undefined) {
      toast.notify("New Personal Record!", {
        position: "top-right",
      });
      const obj = {
        netWpm,
        name: user.displayName,
        userId,
      };
      const res = await Axios.post("/leaderboard/add", obj);
      console.log(res.data);

      dispatch({
        type: "NEW_RECORD",
        payload: {
          leaderboard: res.data,
          user: {
            id: res.data.userId,
            progress: res.data.progress,
            displayName: res.data.displayName,
            email: res.data.email,
            userHighestNetWpm: res.data.userHighestNetWpm,
          },
        },
      });
    }
    if (userId) {
      let progress = [...user.progress, netWpm];
      const obj = {
        progress,
        userId,
      };

      const res = await Axios.put(`/users/updateProgress/`, obj);

      dispatch({
        type: "UPDATE_PROGRESS",
        payload: {
          user: {
            id: res.data.userId,
            progress: res.data.progress,
            displayName: res.data.displayName,
            email: res.data.email,
            userHighestNetWpm: res.data.userHighestNetWpm,
          },
        },
      });
    }
  };

  onStart = () => {
    this.setState({ completed: false });

    this.myInterval = setInterval(() => {
      this.setState({ timeElapsed: this.state.timeElapsed + 1 });
    }, 1000);

    toast.notify("Timer started!", {
      position: "top-right",
    });
  };

  onReset = () => {
    clearInterval(this.myInterval);
    this.myInterval = null;
    console.log(this.myInterval);
    this.setState({
      timeElapsed: 0,
      grossWpm: 0,
      netWpm: 0,
      userText: "",
      entireUserText: "",
      completed: false,
      index: 0,
      wrong: 0,
      wrongChar: 0,
    });
  };

  onKeyPress = (sampleText, user, dispatch, e) => {
    if (
      e.key === " " &&
      this.state.completed === false &&
      this.state.userText.trim().length !== 0
    ) {
      e.preventDefault();
      if (
        this.state.userText.trim() !== sampleText.split(" ")[this.state.index]
      ) {
        let wrongChar = 0;
        let ut = this.state.userText.trim();
        let st = sampleText.split(" ")[this.state.index];
        for (let i = 0; i < st.length; i++) if (ut[i] !== st[i]) wrongChar++;
        this.setState(
          {
            entireUserText:
              this.state.entireUserText + this.state.userText + " ",
            userText: "",
            index: this.state.index + 1,
            wrong: this.state.wrong + 1,
            wrongChar: this.state.wrongChar + wrongChar,
          },
          () => {
            if (this.state.index === sampleText.split(" ").length)
              this.stopTimer(
                this.state.timeElapsed,
                user,
                sampleText,
                dispatch
              );
          }
        );
      } else {
        this.setState(
          {
            entireUserText:
              this.state.entireUserText + this.state.userText + " ",
            userText: "",
            index: this.state.index + 1,
          },
          () => {
            if (this.state.index === sampleText.split(" ").length)
              this.stopTimer(
                this.state.timeElapsed,
                user,
                sampleText,
                dispatch
              );
          }
        );
      }
    } else if (e.key === " " && this.state.userText.trim().length === 0) {
      e.preventDefault();
      this.setState({ userText: "" });
    }
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user, sampleText, dispatch } = value;
          if (user === undefined) user = "";
          const { index, entireUserText } = this.state;

          return (
            <div className="container">
              <div className="row" style={{ justifyContent: "center" }}>
                <div className="sampleText m-5">
                  <h2>
                    {sampleText ? (
                      sampleText.split(" ").map((word, i) => (
                        <span
                          className={classNames({
                            currentWord: index === i,
                            "text-success":
                              entireUserText.split(" ")[i] ===
                                sampleText.split(" ")[i] && i < index,
                            "text-danger":
                              entireUserText.split(" ")[i] !==
                                sampleText.split(" ")[i] && i < index,
                          })}
                          key={i}
                        >
                          {word}{" "}
                        </span>
                      ))
                    ) : (
                      <span className="text-secondary">loading...</span>
                    )}
                  </h2>
                </div>
              </div>

              <div className="row inputRow">
                <div className="input-group userInput m-5">
                  <input
                    className="form-control userInputTextBox"
                    type="text"
                    name="userText"
                    value={this.state.userText}
                    onChange={this.onChange.bind(
                      this,
                      user,
                      sampleText,
                      dispatch
                    )}
                    onKeyPress={this.onKeyPress.bind(
                      this,
                      sampleText,
                      user,
                      dispatch
                    )}
                    style={{ fontSize: "20px" }}
                    readOnly={this.state.completed}
                  />
                </div>
              </div>

              <div className="row optionRow">
                <div className="btn-group optionPanel" role="group">
                  <button
                    type="button"
                    className="btn btn-dark btn-lg"
                    onClick={this.onReset}
                  >
                    <b>RESET</b>
                  </button>

                  <button
                    type="button"
                    className="btn btn-dark btn-lg"
                    onClick={this.onRefresh.bind(this, dispatch)}
                  >
                    <i className="fa fa-refresh"></i>
                  </button>

                  <button type="button" className="btn btn-dark btn-lg">
                    <i className="fa fa-clock-o">
                      <b> {this.state.timeElapsed} s</b>
                    </i>
                  </button>

                  <button type="button" className="btn btn-dark btn-lg">
                    <b>INCORRECT WORDS: {this.state.wrong}</b>
                  </button>

                  <button type="button" className="btn btn-dark btn-lg">
                    <b>GROSS WPM: {this.state.grossWpm}</b>
                  </button>

                  <button type="button" className="btn btn-dark btn-lg">
                    <b>NET WPM: {this.state.netWpm}</b>
                  </button>
                </div>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
