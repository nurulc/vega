import Button from "@material-ui/core/Button";
import React from "react";

const EnhancedButton = props => {
  const {click, style, text} = props;
  return (
    <Button
      onClick={() => (click ? click() : "")}
      size="large"
      variant="contained"
      style={style}
      component="span"
    >
      {text}
    </Button>
  );
};
export default EnhancedButton;
