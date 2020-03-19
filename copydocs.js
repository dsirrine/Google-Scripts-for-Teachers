function runMe() {
  setVars();
}

function setVars() {
    var sheetConfig = {'sheetName': '',
                       'rowStart': '', 
                       'firstNameColumn': '', 
                       'lastNameColumn': '', 
                       'emailColumn': ''};
    
    var scriptConfig = {'srcSheetName': '',
                        'srcDocName': '',
                        'dstFolder': '',
                        'sheetConfig': sheetConfig,
                        'isTest': '0',
                        'dryRun': '0',
                        'share': '0'};
    Logger.log('Source Sheet Name: ' + scriptConfig.srcSheetName);
    Logger.log('Source Document Name: ' + scriptConfig.srcDocName);
    Logger.log('Destination Folder: ' + scriptConfig.dstFolder);
    Logger.log('Test Run: ' + scriptConfig.isTest);
    Logger.log('Dry Run: ' + scriptConfig.dryRun);
    Logger.log('Sheet Configs: ');
    Logger.log('    Sheet Name: ' + scriptConfig.sheetConfig.sheetName);
    Logger.log('    Row Start: ' + scriptConfig.sheetConfig.rowStart);
    Logger.log('    First Name: ' + scriptConfig.sheetConfig.firstNameColumn);
    Logger.log('    Last Name: ' + scriptConfig.sheetConfig.lastNameColumn);
    Logger.log('    Email: ' + scriptConfig.sheetConfig.emailColumn);
                       
    copyDoc(scriptConfig);
  }
  
/**
 * Function: copyDoc
 * Purpose: Function for creating a new file from the master file. 
 * 
 * @param scriptConfig {dict} Master config variable with all pre-set options.
 * 
 */
function copyDoc(scriptConfig) {

  // Creating list of students from createStudentList function 
  var studentInfo = createStudentList(scriptConfig);
  var listLength = studentInfo.length;
  
  // Iterate over student information array to create a new file with format of "firstName lastName srcDocName"
  for (var i = 0; i < listLength; i++) {  
    var dstFileName = studentInfo[i].firstName + ' ' + studentInfo[i].lastName + ' ' + scriptConfig.srcDocName;
    var docID = docsIterator(scriptConfig.srcDocName);

    if (scriptConfig.dstFolder == '') {
      DriveApp.getFileById(docID).makeCopy(dstFileName);
    } else {
      DriveApp.getFileById(docID).makeCopy(dstFileName, scriptConfig.dstFolder);      
    }
    shareDoc(dstFileName, studentInfo[i].email);
  }  
}

/**
 * Function: shareDoc
 * Purpose: Share the newly created file with the student by email address. 
 * 
 * @param dstFileName {string} Newly created file name to add the student as an editor.
 * @param email       {string} Email address of the student with whom the file is being shared. 
 */
function shareDoc(dstFileName, email) {
  var docID = docsIterator(dstFileName);
  DocumentApp.openById(docID).addEditor(email);
}

/** 
 * createStudentList creates an array of dictionaries containing the student 
 * information pulleed from student info Google spreadsheet. 
 * 
 * @param   scriptConfig.isTest                    {boolean}           Flags whether the user wants to use test data provided in-script for testing purposes or bring their own Google sheet.
 * @param   scriptConfig.srcSheetName              {string}            The name of the Google sheet containing the student information. 
 * @param   scriptConfig.srcDocName                {string}            The name of the file that needs to be copied.
 * @param   scriptCOnfig.sheetCOnfig.sheetName     {string}            The name of the individual sheet in the Google spreadsheet with the student information required. 
 * @param   student                                {dict}              Dictionary of student information containing firstName, lastName, and email.
 * @return  studentInfo                            {array}             The compiled list of student information
 *
 */
function createStudentList(scriptConfig) {
  var studentInfo = [];
  
  // Check if isTest is set properly. If not, bail. 
  if (scriptConfig.isTest != '0' && scriptConfig.isTest != '1') {
    throw ("error: isTest must be 0 or 1 where 0 = False and 1 = True.");
  }

  // Check to see if the source Google sheet is set. If not, bail. 
  if (scriptConfig.srcSheetName == '') {
    throw ("error: scriptConfig.srcSheetName must not be empty.");
  }
  
  // Check to see if the source Google file is set. If not, bail. 
  if (scriptConfig.srcDocName == '') {
    throw ("error: scriptConfig.srcDocName must not be empty.");
  }
  
  // Check to see if the Google spreadsheet sheet name is set. If not, bail.
  // We can not assume what the sheet name will be, even though the default is "Sheet1".
  if (scriptConfig.sheetConfig.sheetName == '') {
    throw ("error: scriptConfig.sheetConfig.sheetName must not be empty.");
  }  
  
  // Returning studentInfo list object with test data if scriptConfig.isTest is True.
  if (scriptConfig.isTest == '1') {
    studentInfo.push({'firstName': "Student", 'lastName': "One", 'email': "studnet1@example.com"});
    studentInfo.push({'firstName': "Student", 'lastName': "Two", 'email': "studnet2@example.com"});
    studentInfo.push({'firstName': "Student", 'lastName': "Three", 'email': "studnet3@example.com"});
    return studentInfo;
  } 
  
  // Creating studentInfo from spreadsheet and returning studentInfo list object. 
  if (scriptConfig.isTest == '0') {
    var docID = docsIterator(scriptConfig.srcSheetName);
    var ss = SpreadsheetApp.openById(docID);
    
    // Activating the appropriate spreadsheet that houses the student information. 
    var sheet = ss.getSheetByName(scriptConfig.sheetConfig.sheetName).activate();
    
    // Determining the last row number with data in it. 
    var lastRow = ss.getLastRow();

    var i = scriptConfig.sheetConfig.rowStart;
    while (i <= lastRow) {
      var firstName = sheet.getRange(scriptConfig.sheetConfig.firstNameColumn + i).getValue();
      var lastName = sheet.getRange(scriptConfig.sheetConfig.lastNameColumn + i).getValue();
      var email = sheet.getRange(scriptConfig.sheetConfig.emailColumn + i).getValue();
      var student = {'firstName': firstName, 'lastName': lastName, 'email': email};
      studentInfo.push(student);
      i++;
    }
    return studentInfo; 
  }  
}

/**
 * Function: docsIterator
 * Purpose: Code re-use to derive ID of the file to be copied and the new copy of the file for processing. 
 * 
 * @param docName {string} Name of the document that is being worked on, either the spreadsheet, file to be copied, or the new file. 
 * @return docID  {string} Unique identifier for the file that's being operated on. 
 * 
 */
function docsIterator(docName) {
  var files = DriveApp.getFilesByName(docName);
  while (files.hasNext()) {
    var srcDoc = files.next();
    if (docName == srcDoc.getName()) {
      var docID = srcDoc.getId();
      return docID;
    } else {
      throw ("error: Did not find document matching name " + scriptConfig.srcDocName);
    }
  }
}