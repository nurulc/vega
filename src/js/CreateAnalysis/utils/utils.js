import {inputConfig} from "../../../resources/config";

/* Retrieve file extension from a given file path
 *
 * @param - file   {Object - of type file}  - Contains information on the selected input file
 *
 * @return {String} Extension of the file provided
 */
export const getFileExtension = file => {
  var fileName = file.name ? file.name : file.pathName;
  var index = fileName.lastIndexOf(".");
  return fileName.substring(index + 1);
};

/* Retrieve the matching file target to the extension
 *
 * @param - type   {String}  - Contains file extension
 *
 * @return {String} The expected input type
 */
export const getExpectedInputTarget = fileExtension => {
  var fileType = "DNE";
  Object.keys(inputConfig).map(input => {
    if (inputConfig[input]["extensions"].indexOf(fileExtension) !== -1) {
      fileType = inputConfig[input]["type"];
    }
    return input;
  });
  return fileType;
};

/* Retreive the appropriate arguments for the file being opened.
 *
 * @param - event     {Object - of type DragEvent or FileList}  - contains the files that were dragged and dreopped                               -
 *
 * @return {Object}   Object includes file path, target input and extension type.
 */
export const getFileArgs = event => {
  const files = event.dataTransfer ? event.dataTransfer.files : event;

  return Array.from(files).map(selectedFile => {
    var fileExtension = getFileExtension(selectedFile);
    var target = getExpectedInputTarget(fileExtension);

    var filePath = selectedFile.path;
    //check for error
    return {
      path: filePath,
      target: target,
      ext: fileExtension
    };
  });
};
