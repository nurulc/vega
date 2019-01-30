import {createMuiTheme} from "@material-ui/core/styles";

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
  segment: {
    type: "segment",
    name: "CSV",
    extensions: ["csv"],
    requiredFields: ["iteration", "locus", "fpr", "fnr", "value"],
    minFiles: 1
  },
  tree: {
    type: "tree",
    name: "GML",
    extensions: ["gml", "newick"],
    maxFiles: 1,
    minFiles: 1
  }
};
export const dashboardConfig = {
  name: "Lyra Dashboard",
  input: [inputConfig.segment, inputConfig.tree],
  filePaths: {segment: [], tree: []},
  databasePath: "/src/database/db/database.db",
  collectionsList: ["files", "analysis", "relations"]
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
    name: "Input Files",
    key: "filePaths",
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
