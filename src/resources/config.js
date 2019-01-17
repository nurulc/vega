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

export const projectColours = {
  colour1: "#001011",
  colour2: "#003333",
  colour3: "#3399cc",
  colour4: "#b6ebed",
  colour5: "#9fcbea"
};
