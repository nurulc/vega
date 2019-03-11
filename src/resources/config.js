import {createMuiTheme} from "@material-ui/core/styles";
var root = require("os").homedir();

export const sysCommands = {
  pythonParseCommand:
    "docker run --net=vega_default -e YAMLVAR={yaml} -v " +
    root +
    ":" +
    root +
    " shahcompbio/vega_loader",
  esDeleteIndex: "curl -XDELETE http://localhost:9200/ce00_{analysisName}*",
  esDeleteAnalysisMetaData:
    "curl -XDELETE http://localhost:9200/analysis/analysis/{_id}",
  esGetAllAnalysis: "curl -XGET http://localhost:9200/analysis/_search?pretty",
  esRefresh: "curl -XPOST http:/localhost:9200/_refresh"
};

export const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: '"Helvetica Neue"'
  },
  palette: {
    type: "light",
    primary: {
      light: "#e2eee9",
      main: "#c9e2d8",
      dark: "#88ad9e",
      contrastText: "#000000"
    },
    secondary: {
      light: "#418e8d",
      main: "#006060",
      dark: "#003536",
      contrastText: "#fff"
    },
    error: {
      light: "#ffdbdd",
      main: "#ffafb5",
      dark: "#ba646a",
      contrastText: "#383838"
    }
  },
  overrides: {
    Paper: {
      root: {
        padding: "15px"
      }
    },
    MuiExpansionPanel: {root: {backgroundColor: "#fdfdfd !important"}},
    MuiButton: {
      root: {
        fontColor: "#60606f",
        fontWeight: "bold"
      },
      contained: {
        backgroundColor: "#e8e8e8",
        color: "rgba(0, 0, 0, 0.61)",
        boxShadow:
          "0px 1px 5px 0px rgba(0,0,0,0.2), 0px 1px 2px 0px rgba(0,0,0,0.14), 0px 1px 1px -2px rgba(0,0,0,0.12);"
      }
    },
    MuiStepLabel: {
      label: {
        fontSize: 11
      }
    },
    MuiInputBase: {
      root: {
        fontSize: 20
      }
    },
    MuiFormLabel: {
      root: {fontSize: 20}
    },
    MuiTableCell: {
      head: {
        fontSize: "14px"
      },
      body: {
        fontSize: "12px"
      }
    },
    MuiStepIcon: {
      text: {
        fontWeight: "200",
        fontSize: "0.85rem"
      }
    },
    MuiStepper: {
      root: {backgroundColor: "#fdfdfd"}
    },
    MuiFab: {
      root: {
        backgroundColor: "#e2eee9",
        "&:hover": {
          backgroundColor: "#c9e2d8"
        },
        boxShadow:
          "0px 1px 5px 0px rgba(0,0,0,0.2), 0px 1px 2px 0px rgba(0,0,0,0.14), 0px 1px 1px -2px rgba(0,0,0,0.12);"
      },
      label: {
        color: "#006060"
      }
    }
  }
});

export const inputConfig = {
  segs: {
    type: "segs",
    displayName: "segement",
    name: "CSV",
    extensions: ["csv"],
    requiredFields: ["chr", "start", "end", "state", "median", "cell_id"],
    minFiles: 1
  },
  tree: {
    type: "tree",
    displayName: "tree",
    name: "GML",
    pythonLoader: "loader/vega/vega_loader.py",
    extensions: ["gml", "newick"],
    maxFiles: 1,
    minFiles: 1
  }
};
export const dashboardConfig = {
  name: "Lyra Dashboard",
  project: "fitness",
  input: [inputConfig.segs, inputConfig.tree],
  filePaths: {segs: [], tree: []},
  databasePath: "/src/database/db/database.db",
  collectionsList: ["files", "analysis", "relations", "versions"]
};
export const allAnalysisTableHeaders = [
  {
    name: "Analysis Name",
    key: "name",
    numeric: false,
    canOrderBy: true,
    disablePadding: false
  },
  {
    name: "Description",
    key: "description",
    numeric: false,
    canOrderBy: false,
    disablePadding: false
  },
  {
    name: "Jira ID",
    key: "jiraId",
    numeric: false,
    canOrderBy: false,
    disablePadding: false
  },
  {
    name: "Creation Date",
    key: "date",
    numeric: false,
    canOrderBy: true,
    disablePadding: false
  }
];
