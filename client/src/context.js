import React, { Component } from "react";
import axios from "axios";
import Axios from "axios";

const Context = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGGED_IN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };

    case "LOGGED_OUT":
      return {
        ...state,
        token: undefined,
        user: undefined,
      };

    case "REFRESH":
      return {
        ...state,
        sampleText: action.payload.sampleText,
      };

    case "NEW_RECORD":
      return {
        ...state,
        user: action.payload.user,
      };

    case "UPDATE_PROGRESS":
      return {
        ...state,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

export class Provider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: undefined,
      user: undefined,
      // leaderboard: [],
      sampleText: "",

      dispatch: (action) => this.setState((state) => reducer(state, action)),
    };
  }

  getData = async () => {
    try {
      const poem = await Axios.get(
        "https://poetrydb.org/author,title/Shakespeare;Sonnet"
      );

      const num = Math.floor(Math.random() * 150 + 1);

      let text = poem.data[num].lines;
      let final = "";
      for (let i = 0; i < 5; i++) final += text[i] + " ";
      final = final.trim();

      return final;
    } catch (err) {
      console.log("ERROR: ", err);
    }
  };

  async componentDidMount() {
    // get sample text
    try {
      const sampleText = await this.getData();
      this.setState({ sampleText });
    } catch (err) {
      console.log("ERROR: ", err);
    }

    // check if logged in
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      localStorage.setItem("auth-token", "");
      token = "";
    }
    try {
      const tokenRes = await axios.post("/users/tokenIsValid", null, {
        headers: { "x-auth-token": token },
      });

      if (tokenRes.data) {
        //is logged in so get token and id
        const userRes = await axios.get("/users", {
          headers: { "x-auth-token": token },
        });
        console.log(userRes.data);
        this.setState({
          token,
          user: userRes.data,
        });
      }
    } catch (err) {
      console.log("ERROR: ", err);
    }
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const Consumer = Context.Consumer;
