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

export const projectColours = {
  colour1: "#001011",
  colour2: "#003333",
  colour3: "#3399cc",
  colour4: "#b6ebed",
  colour5: "#9fcbea"
};
