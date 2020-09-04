import { Line } from "react-chartjs-2";
import React, { Component } from "react";

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      labels: [
        "1/20",
        "2/20",
        "3/20",
        "4/20",
        "5/20",
        "6/20",
        "7/20",
        "8/20",
        "9/20",
        "10/20",
        "11/20",
        "12/20",
        "13/20",
        "14/20",
        "15/20",
        "16/20",
        "17/20",
        "18/20",
        "19/20",
        "20/20",
      ],
      datasets: [
        {
          label: "Progress",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "rgba(0,0,0,1)",
          borderWidth: 2,
          data: [
            65,
            66,
            55,
            56,
            65,
            59,
            65,
            60,
            66,
            55,
            65,
            66,
            55,
            56,
            65,
            59,
            65,
            60,
            66,
            55,
            100,
          ],
        },
      ],
    };
  }

  render() {
    return (
      <div style={{ width: "500px" }}>
        <Line
          data={this.state}
          options={{
            title: {
              display: true,
              //   text: "Average Rainfall per month",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      </div>
    );
  }
}
