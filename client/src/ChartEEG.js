import React from 'react'
import { Line } from "react-chartjs-2";
import Client from "./Client";

export default class ChartEEG extends React.Component {
  state = {
    seconds: 0,
    eeg: [],
    lineChartData: {
      //labels: [],
      datasets: [
        {
          type: "line",
          //label: "Theta",
          backgroundColor: "rgba(255, 255, 255, 0)",
          data: []
        }
      ]
    },
    lineChartOptions: {
      legend: {
        display: false
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
                     xAxes: [{
                           type: 'linear', // MANDATORY TO SHOW YOUR POINTS! (THIS IS THE IMPORTANT BIT)
                           display: false, // mandatory
                           scaleLabel: {
                                //display: true, // mandatory
                                //labelString: 'Your label' // optional
                           },
                      }],
                     yAxes: [{ // and your y axis customization as you see fit...
                        display: true,
                        scaleLabel: {
                             //display: true,
                             //labelString: 'Count'
                        },
                        ticks: {
                          min: 0,
                          max: 10
                        }
                    }],
                }
    }
  };

  tickingTimer = () => {
     let new_second = this.state.seconds + 1;

     Client.eegValue(eeg_value => {
       let eeg=[]
       for (let i = 0; i < eeg_value.length; i++){
         eeg.push({x:i, y:Math.min(Math.max(eeg_value[eeg_value.length - i - 1].value / 10, 0), 10)})
       }
       console.log(eeg)
       this.setState({
         seconds:new_second,
         eeg: eeg,
         lineChartData: {
           //labels: [],
           datasets: [
             {
               type: "line",
               borderColor: "#ffc107",
               //label: "Theta",
               data: eeg
             }
           ]
         }
       });
       const arrAvg = eeg.reduce((sum, {y}) => sum + y, 0) / eeg.length
       this.props.updateLike(Math.round(arrAvg))
     });

     /*
     let eeg = this.state.eeg.slice(0);
     let val = (20 - new_second % 20) / 2
     eeg.push({x:new_second, y: val});
     if (eeg.length > 10){
       eeg.shift()
     }




     */

    }

  componentDidMount(){
       setInterval(this.tickingTimer, 1000)
     }

  render() {

    return (
      <div>
        <Line
          data={this.state.lineChartData}
          options={this.state.lineChartOptions}
        />
      </div>
    );
  }
}
