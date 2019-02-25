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
      canSelect: true,
      order: "asc",
      orderBy: "name"
    };
  }
  //Unselect selected analysis
  resetSelect = () => {
    this.setState({selected: {}});
  };
  //If analysis is clicked
  handleClick = (event, clickedAnalysis) => {
    var newSelected = {};
    if (!this.isSelected(clickedAnalysis.analysis_id)) {
      newSelected = this.props.analysisData.filter(
        analysis => analysis.analysis_id === clickedAnalysis.analysis_id
      )[0];
    }
    this.setState({selected: newSelected});
  };

  //Check to see if given ID is currently selected
  isSelected = analysis_id =>
    this.state.selected.hasOwnProperty("analysis_id") &&
    this.state.selected["analysis_id"] === analysis_id;

  render() {
    const {
      classes,
      analysisData,
      goToExternalLink,
      deleteAnalysis
    } = this.props;

    const data = analysisData.length > 0 ? analysisData : [];
    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar
          goToExternalLink={name => goToExternalLink(name)}
          deleteAnalysis={analysis => deleteAnalysis(analysis)}
          selectedAnalysis={this.state.selected}
          resetSelect={this.resetSelect}
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
              {data.map((analysis, index) => {
                const isSelected = this.isSelected(analysis.analysis_id);

                var formattedDate = new Date(analysis.upload_date);
                return (
                  <TableRow
                    hover
                    onClick={event => this.handleClick(event, analysis)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={analysis.title + index}
                    selected={isSelected}
                  >
                    <TableCell component="th" scope="row">
                      {analysis.title}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {analysis.description}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {analysis.jira_id}
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
