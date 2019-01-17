import React from "react";
import {allAnalysisTableHeaders} from "../../../resources/config.js";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const TableHeader = props => {
  return (
    <TableHead>
      <TableRow>
        {allAnalysisTableHeaders.map(row => {
          return (
            <TableCell
              key={row.databaseColumn}
              padding="default"
              sortDirection={false}
            >
              {row.name}
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
