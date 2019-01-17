import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EnhancedTableHead from "./EnhancedTableHeader";

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5,
      selected: {},
      order: "asc",
      orderBy: "name"
    };
  }
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({order, orderBy});
  };
  handleClick = (event, id) => {
    var newSelected;
    if (
      this.state.selected.hasOwnProperty("$loki") &&
      this.state.selected["$loki"] === id
    ) {
      newSelected = {};
    } else {
      newSelected = this.props.allAnalysis.filter(
        analysis => analysis.$loki === id
      )[0];
    }
    this.setState({selected: newSelected});
  };

  isSelected = id =>
    this.state.selected.hasOwnProperty("$loki") &&
    this.state.selected["$loki"] === id;

  render() {
    const {classes} = this.props;
    const data = this.props.allAnalysis;
    const relationMap = this.props.relationMap;

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar
          selectedAnalysis={this.state.selected}
          classes={classes}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              selected={this.state.selected}
              order={this.state.order}
              orderBy={this.state.orderBy}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {data.map(analysis => {
                const isSelected = this.isSelected(analysis.$loki);

                var formattedDate = new Date(analysis.meta.created);
                return (
                  <TableRow
                    hover
                    onClick={event => this.handleClick(event, analysis.$loki)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={analysis.name}
                    selected={isSelected}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      padding={classes.cellPadding}
                    >
                      {analysis.name}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      padding={classes.cellPadding}
                    >
                      {analysis.description}
                    </TableCell>{" "}
                    <TableCell
                      component="th"
                      scope="row"
                      padding={classes.cellPadding}
                    >
                      <div style={{whiteSpace: "pre-wrap"}}>
                        {relationMap[analysis.$loki]}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formattedDate.toLocaleDateString("en-US") +
                        " " +
                        formattedDate.toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }
}
export default EnhancedTable;
