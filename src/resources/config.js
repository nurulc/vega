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
  databasePaths: {
    files: "/src/database/db/files.db",
    analysis: "/src/database/db/analysis.db",
    relations: "/src/database/db/relations.db"
  }
};

export const projectColours = {
  colour1: "#001011",
  colour2: "#003333",
  colour3: "#3399cc",
  colour4: "#b6ebed",
  colour5: "#9fcbea"
};
