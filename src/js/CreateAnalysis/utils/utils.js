import {inputConfig} from "../../../resources/config";
//Retrieve file extension from a given file path
export const getFileType = file => {
  var fileName = file.name;
  var index = fileName.lastIndexOf(".");
  return fileName.substring(index + 1);
};

const getExpectedFileTarget = type => {
  var fileType = "DNE";
  Object.keys(inputConfig).map(input => {
    if (inputConfig[input]["extensions"].indexOf(type) !== -1) {
      fileType = inputConfig[input]["type"];
    }
  });
  return fileType;
};

//Retreive the appropriate arguments for the file being opened
export const getFileArgs = e => {
  e.preventDefault();
  var files = e.dataTransfer.files;
  return Array.from(files).map(selectedFile => {
    var fileType = getFileType(selectedFile);

    var target = getExpectedFileTarget(fileType);
    var filePath = selectedFile.path;
    //check for error
    return {
      path: filePath,
      target: target,
      ext: fileType
    };
  });
};
