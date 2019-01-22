import {createMuiTheme} from "@material-ui/core/styles";

export const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    type: "light",
    primary: {
      light: "#e9ffff",
      main: "#b6ebed",
      dark: "#85b9bb",
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
      }
    },
    MuiTableCell: {
      head: {
        fontSize: "14px"
      },
      body: {
        fontSize: "12px"
      }
    },
    MuiStepper: {
      root: {paddingLeft: "12vw"}
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
    numeric: false,
    canOrderBy: true,
    disablePadding: false
  },
  {
    name: "Description",
    numeric: false,
    canOrderBy: false,
    disablePadding: false
  },
  {
    name: "Input Files",
    numeric: false,
    canOrderBy: false,
    disablePadding: false
  },
  {
    name: "Creation Date",
    numeric: false,
    canOrderBy: true,
    disablePadding: false
  }
];
