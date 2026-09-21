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
const filesToModify = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('LpujournalbookService')) {
    const usedFunctions = [];
    migratedFunctions.forEach(func => {
      if (content.includes(func)) {
        usedFunctions.push(func);
      }
    });
    
    if (usedFunctions.length > 0) {
      filesToModify.push({
        file: file,
        functions: usedFunctions
      });
    }
  }
});

console.log(JSON.stringify(filesToModify, null, 2));
