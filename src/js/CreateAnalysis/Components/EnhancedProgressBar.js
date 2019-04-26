import React from "react";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

import {inputStagesLabels} from "../../../resources/config.js";

import {withStyles} from "@material-ui/core/styles";
const styles = theme => ({
  root: {
    width: "100vw"
  },
  backButton: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});

class EnhancedProgressBar extends React.Component {
  render() {
    const {classes, activeStep} = this.props;

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {inputStagesLabels.map(label => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>
    );
  }
}

export default withStyles(styles)(EnhancedProgressBar);
