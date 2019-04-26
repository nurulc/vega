export const Messages = {
  errorWrongFileExt: "Wrong file extension used, please try another file.",
  errorNotReadable: "This file is broken, please use another.",
  errorBadFilePath: "This file path does not exist, please try another file.",
  errorMaxNumFilesReached: "Max number of files reached for this input.",
  errorMaxNumFilesReachedWithPlaceholder:
    "Max number of files reached for {inputs} inputs. Please try again",
  errorIsDuplicate: "Cannot add the same file twice",
  errorWrongColumns: "This file does not contain the correct columns.",
  errorMissingRequiredHeader:
    "That selected file is missing the following columns: ",
  errorDBOff: "Please turn on Lyra to perform that action",

  warningFieldNotMinLength: "{field} should be no less than 5 characters",
  warningFieldIsEmpty: "{field} cannot be empty",
  warningFieldHasSpaces: "{field} field cannot contain spaces",
  warningFieldHasSpecialCharacters:
    "{field} field cannot contain special characters",

  successDelete: "Analysis was successfully deleted",
  successPrune: "Supplementary data successfully deleted",
  successStop: "Lyra has successfully shutdown",
  successStart: "Lyra has successfully started"
};
