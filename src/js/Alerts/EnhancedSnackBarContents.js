import SnackbarContent from "@material-ui/core/SnackbarContent";
import {withStyles} from "@material-ui/core/styles";
import React from "react";
import classNames from "classnames";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const styles = theme => ({
  error: {
    backgroundColor: "#ef9a9a",
    opacity: 0.8,
    color: "#000000",
    height: 50
  },
  warning: {
    backgroundColor: "#fffde7",
    color: "#000000"
  },
  success: {
    backgroundColor: "#c8e6c9",
    color: "#000000"
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    fontSize: 13,
    display: "flex",
    alignItems: "center"
  }
});
const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const EnhancedSnackBarContents = props => {
  const {classes, className, message, onClose, variant, ...other} = props;
  var Icon = variantIcon[variant];
  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
};
export default withStyles(styles)(EnhancedSnackBarContents);
