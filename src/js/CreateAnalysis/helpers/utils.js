//Retrieve file extension from a given file path
export const getFileType = file => {
  var fileName = file.name;
  var index = fileName.lastIndexOf(".");
  return fileName.substring(index + 1);
};
