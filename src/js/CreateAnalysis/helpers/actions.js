import {getFileType} from "./utils.js";
import {inputConfig} from "../../../resources/config.js";

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
export const canProceedToMeta = inputs => {
  var canContinue = true;
  inputs.map(inputObj => {
    const filePaths = this.state.filePaths[inputObj.type];
    const minFileCount = inputConfig[inputObj.type].minFiles;
    if (filePaths.length < minFileCount) {
      canContinue = false;
    }
  });
  return canContinue;
};
