import React, {Component} from "react";
import isElectron from "is-electron";
import Typography from "@material-ui/core/Typography";
import {initStages} from "../../resources/config";

const formatStepsIntoPercent = (currentStep, totalSteps) =>
  Math.round((currentStep / totalSteps) * 100);

class LoadingCounter extends Component {
  constructor(props) {
    super(props);
    this.intervalId = null;
    this.state = {
      counter: 0,
      highBound: null,
      lowBound: null
    };
  }

  componentDidMount() {
    const intervalId = setInterval(() => {
      const {highBound, counter} = this.state;
      var newCounter = counter;

      this.setState((previousState, currentProps) => {
        var lowBound = formatStepsIntoPercent(
          currentProps.completedSteps,
          currentProps.totalSteps
        );
        var highBound = formatStepsIntoPercent(
          currentProps.completedSteps + 1,
          currentProps.totalSteps
        );
        if (newCounter < lowBound) {
          newCounter = lowBound;
        } else if (newCounter !== highBound) {
          newCounter = newCounter + 1;
        }
        return {
          counter: newCounter,
          lowBound: lowBound,
          highBound: highBound
        };
      });
    }, 1000);
  }
  render() {
    return <Typography>{this.state.counter}%</Typography>;
  }
}
export default LoadingCounter;
