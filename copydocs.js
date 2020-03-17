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
  
  function copyDoc(scriptConfig) {
  
    var studentInfo = createStudentList(scriptConfig);
    var listLength = studentInfo.length;
    
    for (var i = 0; i < listLength; i++) {  
      var dstFileName = studentInfo[i].firstName + ' ' + studentInfo[i].lastName + ' ' + scriptConfig.srcDocName;
      
      var files = DriveApp.getFilesByName(scriptConfig.srcDocName);
  
      while (files.hasNext()) {
        var srcDoc = files.next();
        if (scriptConfig.srcDocName == srcDoc.getName()) {
          var docID = srcDoc.getId();
        } else {
          throw ("error: Did not find document matching name " + scriptConfig.srcDocName);
        }
      }
  
      if (scriptConfig.dstFolder == '') {
        DriveApp.getFileById(docID).makeCopy(dstFileName);
        shareDoc(dstFileName, studentInfo[i].email);
      } else {
        DriveApp.getFileById(docID).makeCopy(dstFileName, dstFolder);
      }
    }
    
  }
  
  function shareDoc(dstFileName, email) {
    var files = DriveApp.getFilesByName(dstFileName);
    while (files.hasNext()) {
      var srcDoc = files.next();
      if (scriptConfig.srcDocName == srcDoc.getName()) {
        var docID = srcDoc.getId();
      } else {
        throw ("error: Did not find document matching name " + scriptConfig.srcDocName);
      }
    }
    srcDoc.setOwner(email);
  }
  
  function createStudentList(scriptConfig) {
    var studentInfo = [];
    
    if (scriptConfig.isTest != '0' && scriptConfig.isTest != '1') {
      throw ("error: isTest must be 0 or 1 where 0 = False and 1 = True.");
    }
  
    if (scriptConfig.srcSheetName == '') {
      throw ("error: scriptConfig.srcSheetName must not be empty.");
    }
    
    if (scriptConfig.srcDocName == '') {
      throw ("error: scriptConfig.srcDocName must not be empty.");
    }
    
    if (scriptConfig.sheetConfig.sheetName == '') {
      throw ("error: scriptConfig.sheetConfig.sheetName must not be empty.");
    }  
  
    // Returning with test data if scriptConfig.isTest is True.
    if (scriptConfig.isTest == '1') {
      studentInfo.push({'firstName': "Student", 'lastName': "One", 'email': "studnet1@example.com"});
      studentInfo.push({'firstName': "Student", 'lastName': "Two", 'email': "studnet2@example.com"});
      studentInfo.push({'firstName': "Student", 'lastName': "Three", 'email': "studnet3@example.com"});
      return studentInfo;
    } 
    
    // Creating studentInfo from spreadsheet and returning. 
    if (isTest == '0') {
      var sheetIterator = DriveApp.getFilesByName(scriptConfig.srcSheetName);
      // Ensuring that the file found matches the source file name supplied in scriptConfig.srcSheetName and opening the sheet. 
      while (sheetIterator.hasNext()) {
        var srcSheet = sheetIterator.next();
        if (srcSheet.getName() == scriptConfig.srcSheetName) {
          var ss = SpreadsheetApp.open(srcSheet);
        }
      }
      
      // Activating the appropriate spreadsheet that houses the student information. 
      var sheet = ss.getSheetByName(scriptConfig.sheetConfig.sheetName).activate();
      
      // Determining the last row number with data in it. 
      var lastRow = ss.getLastRow();
  
      
      var i = scriptConfig.sheetConfig.rowStart;
      while (i <= lastRow) {
        var firstName = sheet.getRange(scriptConfig.sheetConfig.firstNameColumn + i);
        var lastName = sheet.getRange(scriptConfig.sheetConfig.lastNameColumn + i);
        var email = sheet.getRange(scriptConfig.sheetConfig.emailColumn + i);
        var student = {'firstName': firstName, 'lastName': lastName, 'email': email};
        studentInfo.push(student);
        i++;
      }
      return studentInfo; 
    }  
  }