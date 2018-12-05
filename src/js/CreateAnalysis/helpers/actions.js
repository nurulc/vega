 import {getFileType } from "./utils.js"

export const setUserActions = (holder, ipcRenderer) => {
  holder.ondragover = () => {
    return false;
  };

  holder.ondrop = e => {
    e.preventDefault();
    var dropTargetType =
      e.target.attributes.getNamedItem("dragtype") === null
        ? e.target.parentElement.attributes.dragtype.nodeValue
        : e.target.attributes.dragtype.nodeValue;

    var fileType = getFileType(e.dataTransfer.files[0]);
    var filePath = e.dataTransfer.files[0].path;
    
    ipcRenderer.send("action-dropFile",{ path: filePath, target: dropTargetType, type: fileType });
  };

};
