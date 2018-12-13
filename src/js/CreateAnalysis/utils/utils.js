import {inputConfig} from "../../../resources/config.js";

//Retrieve file extension from a given file path
export const getFileType = file => {
  var fileName = file.name;
  var index = fileName.lastIndexOf(".");
  return fileName.substring(index + 1);
};

//Retreive the appropriate arguments for the file being opened
export const getFileArgs = e => {
  e.preventDefault();
  var dropTargetType =
    e.target.attributes.getNamedItem("dragtype") === null
      ? e.target.parentElement.attributes.dragtype.nodeValue
      : e.target.attributes.dragtype.nodeValue;

  var fileType = getFileType(e.dataTransfer.files[0]);
  var filePath = e.dataTransfer.files[0].path;
  //check for error
  return {
    path: filePath,
    target: dropTargetType,
    ext: fileType
  };
};
