var fs = require("fs");

export const isCorrectExt = args => {
  //Does the extension match the location it was dropped
  return args.type === args.target;
};

export const isFileReadable = path => {
  var isFileReadable = true;
  fs.readFile(path, "utf-8", (err, data) => {
    //Check if file is readable
    if (err) {
      isFileReadable = false;
    }
  });
  return isFileReadable;
};

export const doesFileExist = path => {
  var doesFileExist = true;
  fs.stat(path, function(err, stat) {
    //Check for non existing file
    if (err.code === "ENOENT") {
      doesFileExist = false;
    }
  });
  return doesFileExist;
};
