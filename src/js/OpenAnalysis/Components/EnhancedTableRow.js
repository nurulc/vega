import React from "react";

import {allAnalysisTableHeaders} from "../../../resources/config.js";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

var moment = require("moment-timezone");

//Converts the UTC stored time to the current timezone
const getDateFromUTC = date =>
  moment(date)
    .local()
    .format("HH:mm DD/MM/YY");

const EnhancedTableRow = ({analysis, key, handleClick, isSelected}) => {
  const date = getDateFromUTC(moment.utc(analysis.upload_date));
  return (
    <TableRow
      hover
      onClick={event => handleClick(event, analysis)}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={-1}
      key={key}
      selected={isSelected}
    >
      {[analysis.title, analysis.description, analysis.jira_id, date].map(
        fieldName => {
          return <EnhancedTableCell fieldName={fieldName} />;
        }
      )}
    </TableRow>
  );
};
const EnhancedTableCell = ({fieldName}) => {
  return (
    <TableCell component="th" scope="row">
      {fieldName}
    </TableCell>
  );
};
export default EnhancedTableRow;
