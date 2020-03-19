# Google-Scripts-for-Teachers
Google scripts to help teachers automate their remote learning tasks if they use Google Suite. 

## How to use

1. Create a new script in google drive by clicking New -> More -> Google Apps Script

\## TODO: add screenshot 

2. The new file will be unnamed. Name the file whatever makes sense for you. 

\## TODO: add screenshot

3. Remove all the text from the default Code.gs file that was created. The default is usuall something like the following:
    
        function myFunction() {
          
        }
 
 4. Copy and paste the code from copydocs.js into Code.gs

 5. Find the block of code at the top labled "function setVars" that looks like the following:
      
            var sheetConfig = {'sheetName': '',
                     'rowStart': '', 
                     'firstNameColumn': '', 
                     'lastNameColumn': '', 
                     'emailColumn': ''};
    
            var scriptConfig = {'srcSheetName' = '',
                      'srcDocName': '',
                      'dstFolder': '',
                      'sheetConfig': sheetConfig,
                      'isTest': '0',
                      'dryRun': '1'};

    This is what is called a "key:value" pair. The "key" is to the left of the ":" and the value is to the right of the ":". Do **NOT** edit the text to the left of the ":". 

    The settings are as follows:
    
    1. **sheetName** - This is the name of the sheet tab in the spreadsheet. Default is usually "Sheet1". You can find this at the bottom of the spreadsheet. 
    
    2. **rowStart** - The row number the student information starts at. (Row 1 is the first row in the sheet. This is to account for any headers you may have. )

    3. **firstNameColumn** - The column letter that contains the first name of the student.

    4. **lastNameColumn** - The column letter that contains the last name of the student.

    5. **emailColumn** - The column letter that contains the email address of the student.

    6. **srcSheetName** - This is the name of the spreadsheet that contains the student information.

    7. **srcDocName** - The name of the file you would like to share with the student.

    8. **dstFolder** - Name of the folder in which you would like to place the copy. 

    9. **sheetConfig** - Do **NOT** change this setting!

    10. **isTest** - Uses built-in test student information for testing purposes. 0 = off, 1 = on. Default = 0. 

    11. **dryRun** - Run through the script without creating copies or sharing copies. **not implemented yet**

6. Once settings are changed, save the script by pressing CTRL+S or go to File -> Save

7. Run the script by going to Run -> Run function -> runMe.

## TODO
1. Implement ability to copy and share file types other than google doc files
2. Better implementation of variable gathering from user - Better user experience. 