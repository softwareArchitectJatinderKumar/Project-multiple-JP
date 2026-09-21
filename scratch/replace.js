const fs = require('fs');
const path = require('path');

const srcDir = 'e:\\2025\\Projects\\Journal\\src\\app';

const migratedFunctions = [
  'GetAllBooksDetails',
  'GetJournalAuthorDetails',
  'GetAllJournalMasterwithEditorDetails',
  'GetJournalProperties',
  'GetAllJournalEditorsDetails',
  'GetJournalDetailsforAboutPage',
  'GetJournalIssues',
  'AddJournalUserAccount',
  'GetAuthoriseUserData',
  'AuthoriseUserDetails',
  'GetUserRolesforUser',
  'AssignExternalReviewerForJournal',
  'JournalUpdatePasswordSecure',
  'GetEditorsDetailsIdWise',
  'GetBooksDataWithEditorDetails'
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  // Skip the service files themselves
  if (file.includes('lpujournalbook.service.ts') || file.includes('lpujournalCommon.service.ts') || file.includes('--lpujournalbook.service')) return;

  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('LpujournalbookService')) {
    
    // Check if the file uses any migrated function
    let usesMigrated = false;
    migratedFunctions.forEach(func => {
      if (content.includes(func)) usesMigrated = true;
    });

    if (usesMigrated) {
      console.log('Processing:', file);
      
      // 1. Add Import
      if (!content.includes('LpujournalCommonService')) {
        // Find the LpujournalbookService import and add LpujournalCommonService below it
        content = content.replace(
          /(import {.*?LpujournalbookService.*?} from '.*?';)/,
          "$1\nimport { LpujournalCommonService } from 'src/app/_services/lpujournalCommon.service';"
        );
      }

      // 2. Add to constructor
      // We need to find the constructor and add private commonService: LpujournalCommonService
      if (!content.includes('private commonService: LpujournalCommonService')) {
        content = content.replace(
          /constructor\s*\(/,
          "constructor(private commonService: LpujournalCommonService, "
        );
      }

      // 3. Replace the calls
      // We need to find the instance name of LpujournalbookService
      // Usually it's something like `private journalWebApiService: LpujournalbookService`
      const match = content.match(/private\s+(\w+)\s*:\s*LpujournalbookService/);
      if (match) {
        const instanceName = match[1];
        
        migratedFunctions.forEach(func => {
          // Replace `this.instanceName.FunctionName` with `this.commonService.FunctionName`
          const regex = new RegExp(`this\\.${instanceName}\\.${func}`, 'g');
          content = content.replace(regex, `this.commonService.${func}`);
        });
      }

      fs.writeFileSync(file, content, 'utf8');
    }
  }
});

console.log("Done");
