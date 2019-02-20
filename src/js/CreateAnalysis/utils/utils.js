import {inputConfig} from "../../../resources/config";
//Retrieve file extension from a given file path
export const getFileTypeByFileName = file => {
  var fileName = file.name ? file.name : file.pathName;
  var index = fileName.lastIndexOf(".");
  return fileName.substring(index + 1);
};

export const getExpectedFileTargetByType = type => {
  var fileType = "DNE";
  Object.keys(inputConfig).map(input => {
    if (inputConfig[input]["extensions"].indexOf(type) !== -1) {
      fileType = inputConfig[input]["type"];
    }
    return;
  });
  return fileType;
};

//Retreive the appropriate arguments for the file being opened
export const getFileArgs = (e, isDragEvent) => {
  const files = isDragEvent ? e.dataTransfer.files : e;

  return Array.from(files).map(selectedFile => {
    var fileType = getFileTypeByFileName(selectedFile);

    var target = getExpectedFileTargetByType(fileType);
    var filePath = selectedFile.path;
    //check for error
    return {
      path: filePath,
      target: target,
      ext: fileType
    };
  });
};
