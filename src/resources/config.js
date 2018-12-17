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
export const config = {
  dashboards: [
    {
      name: "Lyra Dashboard",
      input: [inputConfig.segment, inputConfig.tree],
      filePaths: {segment: [], tree: []},
      databasePaths: {
        files: "/src/database/db/files.db",
        anaylsis: "/src/database/db/anaylsis.db",
        relations: "/src/database/db/relations.db"
      }
    }
  ]
};

export const projectColours = {
  color1: "0, 16, 17, 1",
  color2: "9, 58, 62, 1",
  color3: "58, 175, 185, 1",
  color4: "182, 235, 237, 1",
  color5: "159, 203, 234, 1"
};
