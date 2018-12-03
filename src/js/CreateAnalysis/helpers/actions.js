 import {getFileType } from "./utils.js"

export const setActionOnDragOver = holder => {
  holder.ondragover = () => {
    return false;
  };
};

export const setActionOnDrop = (holder, ipcRenderer) => {
  holder.ondrop = e => {
    e.preventDefault();
    var dropTargetType =
      e.target.attributes.getNamedItem("dragtype") === null
        ? e.target.parentElement.attributes.dragtype.nodeValue
        : e.target.attributes.dragtype.nodeValue;
        console.log(dropTargetType)
        
    var fileType = getFileType(e.dataTransfer.files[0]);

    //If the file has a matching extension add the file path to the state
    if (dropTargetType === fileType) {
      var filePath = e.dataTransfer.files[0].path;
      console.log(filePath)
      ipcRenderer.send("drop-file", { path: filePath, target: dropTargetType });
    }
  };
};
