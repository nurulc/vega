import Button from "@material-ui/core/Button";
import React from "react";

const EnhancedButton = ({click, style, text}) => {
  return (
    <Button
      onClick={() => click()}
      size="large"
      variant="contained"
      style={style}
    >
      {text}
    </Button>
  );
};
export default EnhancedButton;
