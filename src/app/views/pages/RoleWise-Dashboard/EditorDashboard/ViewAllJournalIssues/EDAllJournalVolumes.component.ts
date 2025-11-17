import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-EDAllJournalVolumes',
  templateUrl: './EDAllJournalVolumes.component.html',
  styleUrls: ['./EDAllJournalVolumes.component.css']
})
export class EDAllJournalVolumesComponent implements OnInit {
  dataSource: any[] = [];
  journalListsData: any[] = [];
  JournalIssuesData: any[] = [];
  paginatedJournalIssuesData: any[] = [];
  currentPageEditor: number = 1;
  pageSizeEditor: number = 10;
  totalPagesEditor: number = 1;
  JournalTitle: any = '';
  isLoadingPage: boolean = true;            // For initial page load
  isLoadingJournal: boolean = false;       // For journal selection load
  serverUrl: any;
  displayedEditorColumns: string[] = [
    'journalTitle',
    'volume',
    'publishDate',
    'issueTitle',
    'issueFileName',
    'issueDescription'
  ];

  displayedEditorColumnHeaders: { [key: string]: string } = {
    journalTitle: 'Journal Title',
    volume: 'Journal Volume',
    publishDate: 'Publish Date',
    issueTitle: 'Issue Title',
    issueFileName: 'File',
    issueDescription: 'Issue Description'
  };
  BookId: any;
  currentJournalId: any;
  currentJournalTitle: any;
  currentJournalVolume: any; // Added to store the current journal volume
  name: any;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private AuthSession: LoginSessionService,
    private cookieService: CookieService,
    private journalWebApiService: LpujournalbookService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.serverUrl = 'https://files.lpu.in/umsweb/Journal/';
    this.BookId = this.route.snapshot.params['Id'];
    this.name = this.route.snapshot.params['name'];
    this.loadJournals(); // Load journals on initialization
  }

  loadJournals() {
    this.isLoadingPage = true; // Show loading spinner
    this.journalWebApiService.GetAllBooksDetails().subscribe({
      next: (dataX: any) => {
        this.journalListsData = dataX.item1 || [];
        this.setJournalId(); // Set journal ID after loading journals
        this.isLoadingPage = false; // Hide loading spinner
      },
      error: (error: any) => {
        console.error('Error fetching journals', error);
        this.isLoadingPage = false; // Hide loading spinner on error
      }
    });
  }

  setJournalId() {
    const selectedJournal = this.journalListsData.find(j => j.id == this.BookId);
    if (selectedJournal) {
      this.currentJournalId = selectedJournal.journalId;
      this.currentJournalTitle = selectedJournal.journalTitle;
      this.currentJournalVolume = selectedJournal.volume; // Set the current journal volume
      this.isLoadingJournal = true; // Show loader when fetching journal issues
      this.GetAllIssues(this.BookId);
    } else {
      console.warn('Selected journal not found');
    }
  }

  GetAllIssues(JournalId: any) {
    this.journalWebApiService.GetJournalIssues(JournalId).subscribe({
      next: (dataX: any) => {
        this.JournalIssuesData = dataX.item1 || [];
        this.calculateTotalPagesEditor();
        this.updatePaginatedDataEditor();
        this.isLoadingJournal = false; // Hide loading spinner after fetching issues
      },
      error: (error: any) => {
        console.error('Error fetching journal issues', error);
        this.isLoadingJournal = false; // Hide loading spinner on error
      }
    });
  }

  calculateTotalPagesEditor() {
    this.totalPagesEditor = Math.ceil(this.JournalIssuesData.length / this.pageSizeEditor) || 1;
  }

  updatePaginatedDataEditor() {
    const startIndex = (this.currentPageEditor - 1) * this.pageSizeEditor;
    const endIndex = Math.min(startIndex + this.pageSizeEditor, this.JournalIssuesData.length);
    this.paginatedJournalIssuesData = this.JournalIssuesData.slice(startIndex, endIndex);
  }

  nextPageEditor() {
    if (this.currentPageEditor < this.totalPagesEditor) {
      this.currentPageEditor++;
      this.updatePaginatedDataEditor();
    }
  }

  previousPageEditor() {
    if (this.currentPageEditor > 1) {
      this.currentPageEditor--;
      this.updatePaginatedDataEditor();
    }
  }

  onSelectFileEditorX(fileUrl: string) {
    window.open(this.serverUrl + fileUrl, '_blank');
  }
}

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import { LoginSessionService } from 'src/app/_services/login-session.service';
// import { HttpClient } from '@angular/common/http';
// import { FormBuilder } from '@angular/forms';
// import { AuthService } from 'src/app/_services/auth.service';
// import { StorageService } from 'src/app/_services/storage.service';

// @Component({
//   selector: 'app-EDAllJournalVolumes',
//   templateUrl: './EDAllJournalVolumes.component.html',
//   styleUrls: ['./EDAllJournalVolumes.component.css']
// })
// export class EDAllJournalVolumesComponent implements OnInit {
//   dataSource: any[] = [];
//   journalListsData: any[] = [];
//   JournalIssuesData: any[] = [];
//   paginatedJournalIssuesData: any[] = [];
//   currentPageEditor: number = 1;
//   pageSizeEditor: number = 10;
//   totalPagesEditor: number = 1;
//   JournalTitle: any = '';
//   isLoadingPage: boolean = true;            // For initial page load
//   isLoadingJournal: boolean = false;       // For journal selection load
//   serverUrl: any;
//   displayedEditorColumns: string[] = [
//     'journalTitle',
//     'volume',
//     'publishDate',
//     'issueTitle',
//     'issueFileName',
//     'issueDescription'
//   ];

//   displayedEditorColumnHeaders: { [key: string]: string } = {
//     journalTitle: 'Journal Title',
//     volume: 'Journal Volume',
//     publishDate: 'Publish Date',
//     issueTitle: 'Issue Title',
//     issueFileName: 'File',
//     issueDescription: 'Issue Description'
//   };
//   BookId: any;
//   currentJournalId: any;
//   currentJournalTitle: any;
//   name:any;
//   constructor(
//     private storageService: StorageService,
//     private authService: AuthService,
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private router: Router,
//     private AuthSession: LoginSessionService,
//     private StoragesServices: StorageService,
//     private route: ActivatedRoute, private cookieService: CookieService,
//     private journalWebApiService: LpujournalbookService
//   ) {}

//   ngOnInit(): void {
//     this.serverUrl = 'https://files.lpu.in/umsweb/Journal/';
//     this.BookId = this.currentJournalId = this.route.snapshot.params['Id'];
//     this.name = this.currentJournalTitle= this.route.snapshot.params['name'];
//     this.setJournalId();
//   }

//   setJournalId() {
//     const selectedJournal = this.BookId;
//     if (selectedJournal) {
//       this.isLoadingJournal = true;  // Show loader when journal is selected
//       this.GetAllIssues(this.BookId);
//       this.isLoadingJournal=false;
//     }
//   }

//   GetAllIssues(JournalId: any) {
//     this.journalWebApiService.GetJournalIssues(JournalId).subscribe({
//       next: (dataX: any) => {
//         this.JournalIssuesData = dataX.item1 || [];
//         this.calculateTotalPagesEditor();
//         this.updatePaginatedDataEditor();
//         // this.delayHideLoader('journal');  // Delay hiding the journal loader
//       },
//       error: (error: any) => {
//         console.error('Error fetching journal issues', error);
//         // this.delayHideLoader('journal');  // Delay hiding the journal loader if error occurs
//       }
//     });
//   }

//   delayHideLoader(loaderType: 'page' | 'journal') {
//     const delay = 500; // Delay in milliseconds
//     setTimeout(() => {
//       if (loaderType === 'page') {
//         this.isLoadingPage = false;
//       } else if (loaderType === 'journal') {
//         this.isLoadingJournal = false;
//       }
//     }, delay);
//   }

//   calculateTotalPagesEditor() {
//     this.totalPagesEditor = Math.ceil(this.JournalIssuesData.length / this.pageSizeEditor) || 1;
//   }

//   updatePaginatedDataEditor() {
//     const startIndex = (this.currentPageEditor - 1) * this.pageSizeEditor;
//     const endIndex = Math.min(startIndex + this.pageSizeEditor, this.JournalIssuesData.length);
//     this.paginatedJournalIssuesData = this.JournalIssuesData.slice(startIndex, endIndex);
//   }

//   nextPageEditor() {
//     if (this.currentPageEditor < this.totalPagesEditor) {
//       this.currentPageEditor++;
//       this.updatePaginatedDataEditor();
//     }
//   }

//   previousPageEditor() {
//     if (this.currentPageEditor > 1) {
//       this.currentPageEditor--;
//       this.updatePaginatedDataEditor();
//     }
//   }

//   onSelectFileEditorX(fileUrl: string) {
//     window.open(this.serverUrl + fileUrl, '_blank');
//   }
// }
