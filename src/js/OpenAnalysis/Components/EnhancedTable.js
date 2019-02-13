import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EnhancedTableHead from "./EnhancedTableHeader";
import {withStyles} from "@material-ui/core/styles";
const tableWrapper = {
  overflowX: "auto"
};

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: 15,
    cursor: "pointer"
  }
});

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
  handleClick = (event, id) => {
    var newSelected;
    if (this.isSelected(id)) {
      newSelected = {};
    } else {
      newSelected = this.props.analysisData.allAnalysis.filter(
        analysis => analysis.$loki === id
      )[0];
    }
    this.setState({selected: newSelected});
  };

  isSelected = id =>
    this.state.selected.hasOwnProperty("$loki") &&
    this.state.selected["$loki"] === id;

  render() {
    const {classes, analysisData} = this.props;
    const data = analysisData.hasOwnProperty("allAnalysis")
      ? analysisData.allAnalysis
      : [];
    const relationMap = analysisData.hasOwnProperty("formatedRelations")
      ? analysisData.formatedRelations
      : [];

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar
          selectedAnalysis={this.state.selected}
          classes={classes}
        />
        <div style={tableWrapper}>
          <Table className={classes.table} aria-labelledby="All Analysis">
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
                    <TableCell component="th" scope="row">
                      {analysis.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {analysis.description}
                    </TableCell>
                    <TableCell component="th" scope="row">
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
export default withStyles(styles)(EnhancedTable);
