import React, {Component} from "react";
import EnhancedProgressBar from "./Components/EnhancedProgressBar.js";
import MetaDataInput from "./Components/MetaDataInput.js";
import AddInput from "./Components/AddInput.js";
import "./style.css";

class CreateAnalysis extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0,
      filePaths: null
    };
  }
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
      ) : (
        <MetaDataInput
          filePaths={this.state.filePaths}
          nextClick={this.increaseStep}
          backClick={this.decreaseStep}
        />
      );
    return (
      <div>
        <EnhancedProgressBar activeStep={this.state.activeStep} />
        {content}
      </div>
    );
  }
}
export default CreateAnalysis;
