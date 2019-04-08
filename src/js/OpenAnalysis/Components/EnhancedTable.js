import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";

import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EnhancedTableHead from "./EnhancedTableHeader";
import EnhancedTableRow from "./EnhancedTableRow.js";

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

    const allAnalysis = analysisData.length > 0 ? analysisData : [];

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar
          defaultBannerText={
            allAnalysis.length > 0
              ? "All Analysis"
              : "No analysis found in the database."
          }
          goToExternalLink={name => goToExternalLink(name)}
          deleteAnalysis={analysis => deleteAnalysis(analysis)}
          selectedAnalysis={this.state.selected}
          resetSelect={this.resetSelect}
          classes={classes}
        />
        {allAnalysis.length > 0 ? (
          <div style={tableWrapper}>
            <Table className={classes.table} aria-labelledby="All Analysis">
              <EnhancedTableHead
                selected={this.state.selected}
                order={this.state.order}
                orderBy={this.state.orderBy}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
                {allAnalysis.map((analysis, index) => {
                  return (
                    <EnhancedTableRow
                      handleClick={(event, analysis) =>
                        this.handleClick(event, analysis)
                      }
                      key={analysis.title + index}
                      analysis={analysis}
                      isSelected={this.isSelected(analysis.analysis_id)}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          ""
        )}
      </Paper>
    );
  }
}
export default withStyles(styles)(EnhancedTable);
