import React, { Component } from "react";

export default class About extends Component {
  render() {
    return (
      <div className="container mt-5">
        <div className="row m-0">
          <div className="col-12 col-sm-12 ">
            <h1 style={{ fontWeight: "lighter mt-5" }}>
              <span className="font-italic">About</span>{" "}
              <span style={{ fontFamily: "Pacifico, cursive" }}>
                Fingers.on.Fire
              </span>
            </h1>
            <p className="lead font-italic">
              Best place to practice touch typing!
            </p>
            <h1 className="font-italic">Features</h1>
            <p className="mb-1 font-italic">Login/Register feature</p>
            <p className="mb-1 font-italic">Leaderboard</p>
            <p className="mb-1 font-italic">graph of your past activities</p>
            <p className="mb-1 font-italic">More features to come sooooon!</p>
            <p className="text-secondary font-italic mt-5">Version 1.0.0</p>
            <p className="text-secondary font-italic ">
              Developed by:{" "}
              <a href="mailto:6rohit8@gmail.com">6rohit8@gmail.com</a> <br />{" "}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
