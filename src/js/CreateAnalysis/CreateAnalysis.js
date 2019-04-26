import React, {Component} from "react";
import EnhancedProgressBar from "./Components/EnhancedProgressBar.js";
import MetaDataInput from "./Components/MetaDataInput.js";
import AddInput from "./Components/AddInput.js";
import GoToAnalysis from "./Components/GoToAnalysis.js";
import "./style.css";
import DBStatus from "../BackendInit/DBStatus.js";

class CreateAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      filePaths: null
    };
  }
  setAnalysisLoadingStep = step => {
    var steps = [...this.state.analysisLoadingSteps, step];
    this.setState({
      analysisLoadingSteps: steps
    });
  };
  increaseStep = filePaths => {
    this.setState({
      activeStep: this.state.activeStep + 1,
      filePaths: filePaths
    });
  };

  decreaseStep = filePaths => {
    this.setState({
      activeStep: this.state.activeStep - 1,
      filePaths: filePaths
    });
  };

  render() {
    var content =
      this.state.activeStep === 0 ? (
        <AddInput
          filePaths={this.state.filePaths}
          nextClick={this.increaseStep}
        />
      ) : this.state.activeStep === 1 ? (
        <MetaDataInput
          filePaths={this.state.filePaths}
          nextClick={this.increaseStep}
          backClick={this.decreaseStep}
        />
      ) : (
        <GoToAnalysis nextClick={this.increaseStep} />
      );
    return (
      <div>
        <DBStatus />
        <EnhancedProgressBar activeStep={this.state.activeStep} />
        {content}
      </div>
    );
  }
}
export default CreateAnalysis;
