import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
@Component({
  selector: 'app-JournalIssuesDetails',
  templateUrl: './JournalIssuesDetails.component.html',
  styleUrls: ['./JournalIssuesDetails.component.css']
})
export class JournalIssuesDetailsComponent implements OnInit {
  BookId: string | undefined;
  journalTitle: string = '';
  issues: any[] = [];
  isLoading: boolean = true;
  activeAccordionId: string | null = null;
 // serverUrl: string = 'https://files.lpu.in/umsweb/Journal/';
 serverUrl: string = 'https://files.lpu.in/umsweb/Journal/';
  groupedIssuesByYear: { year: string; issues: any[][] }[] = [];
  expandedTitles: Set<string> = new Set<string>();

  constructor(
    private route: ActivatedRoute,
    private journalService: LpujournalbookService
  ) {}

  ngOnInit(): void {
    this.BookId = this.route.snapshot.params['Id'];
    this.journalTitle = this.route.snapshot.params['name']?.replace(/-/g, ' ') || '';

    if (this.BookId) {
      this.loadIssues();
    }
  }

  loadIssues() {
    this.isLoading = true;
    this.journalService.GetJournalIssues(this.BookId).subscribe({
      next: (response: any) => {
        this.issues = response.item1 || [];
        if (this.issues.length > 0) {
          this.activeAccordionId = `year-0`;
        }
        this.groupIssuesByYear(this.issues);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading issues:', error);
        this.isLoading = false;
      }
    });
  }

  groupIssuesByYear(issues: any[]) {
    const grouped: { [key: string]: any[] } = {};

    for (const issue of issues) {
      const year = new Date(issue.publishDate).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(issue);
    }

    this.groupedIssuesByYear = Object.entries(grouped).map(([year, issues]) => ({
      year,
      issues: this.chunkArray(issues, 2)
    }));
  }

  chunkArray(arr: any[], chunkSize: number): any[][] {
    const result: any[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }

  toggleAccordion(itemId: string) {
    this.activeAccordionId = this.activeAccordionId === itemId ? null : itemId;
  }

  formatIssueTitle(title: string, expanded = false): string {
    if (!title) return '';
    const words = title.trim().split(/\s+/);
    return (!expanded && words.length > 5)
      ? words.slice(0, 5).join(' ') + '...'
      : title;
  }

  toggleTitle(key: string): void {
    if (this.expandedTitles.has(key)) {
      this.expandedTitles.delete(key);
    } else {
      this.expandedTitles.add(key);
    }
  }

  isTitleExpanded(key: string): boolean {
    return this.expandedTitles.has(key);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  }

  downloadIssue(fileUrl: string) {
    window.open(this.serverUrl + fileUrl, '_blank');
  }
}



// // using accordion 
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import { LoginSessionService } from 'src/app/_services/login-session.service';

// @Component({
//   selector: 'app-JournalIssuesDetails',
//   templateUrl: './JournalIssuesDetails.component.html',
//   styleUrls: ['./JournalIssuesDetails.component.css']
// })
// export class JournalIssuesDetailsComponent implements OnInit {
//   BookId: string | undefined;
//   journalTitle: string = '';
//   issues: any[] = [];
//   isLoading: boolean = true;
//   serverUrl: string = 'https://files.lpu.in/umsweb/Journal/';//'http://172.19.2.52/umsweb/webftp/Journal/';
//   // this.serverUrl = 'https://files.lpu.in/umsweb/Journal/';
//   activeAccordionId: string | null = null;

//   constructor(
//     private route: ActivatedRoute,
//     private journalService: LpujournalbookService
//   ) {}

//   ngOnInit(): void {
//     this.BookId = this.route.snapshot.params['Id'];
//     this.journalTitle = this.route.snapshot.params['name'].replace(/-/g, ' ');
    
//     if (this.BookId) {
//       this.loadIssues();
//     }
//   }
//   formatIssueTitle(title: string): string {
//     if (!title) return '';
//     const words = title.split(' ');
//     if (words.length > 5) {
//         return words.slice(0, 5).join(' ') + '...';
//     }
//     return title;
// }

//   loadIssues() {
//     this.isLoading = true;
//     this.journalService.GetJournalIssues(this.BookId).subscribe({
//       next: (response: any) => {
//         this.issues = response.item1 || [];
//         if (this.issues.length > 0) {
//           this.activeAccordionId = `issue-0`; // Open first accordion item by default
//         }
//         this.isLoading = false;
//         this.groupIssuesByYear(this.issues);
//       },
//       error: (error) => {
//         console.error('Error loading issues:', error);
//         this.isLoading = false;
//       }
//     });
//   }

//   downloadIssue(fileUrl: string) {
//     window.open(this.serverUrl + fileUrl, '_blank');
//   }

//   toggleAccordion(itemId: string) {
//     this.activeAccordionId = this.activeAccordionId === itemId ? null : itemId;
//   }

//   formatDate(dateString: string): string {
//     if (!dateString) return 'Not specified';
//     return new Date(dateString).toLocaleDateString();
//   }
//   groupedIssuesByYear: { year: string, issues: any[][] }[] = [];

//   groupIssuesByYear(issues: any[]) {
//     const grouped: { [key: string]: any[] } = {};

//     for (const issue of issues) {
//       const year = new Date(issue.publishDate).getFullYear().toString();
//       if (!grouped[year]) {
//         grouped[year] = [];
//       }
//       grouped[year].push(issue);
//     }

//     // Convert to array and chunk into pairs of 2
//     this.groupedIssuesByYear = Object.entries(grouped).map(([year, issues]) => ({
//       year,
//       issues: this.chunkArray(issues, 2)
//     }));
//   }

//   chunkArray(arr: any[], chunkSize: number): any[][] {
//     const result = [];
//     for (let i = 0; i < arr.length; i += chunkSize) {
//       result.push(arr.slice(i, i + chunkSize));
//     }
//     return result;
//   }

  
// }


// using Card to show published journal issues 

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import { LoginSessionService } from 'src/app/_services/login-session.service';

// @Component({
//   selector: 'app-JournalIssuesDetails',
//   templateUrl: './JournalIssuesDetails.component.html',
//   styleUrls: ['./JournalIssuesDetails.component.css']
// })
// export class JournalIssuesDetailsComponent implements OnInit {
//   BookId: any;
//   journalTitle: string = '';
//   issues: any[] = [];
//   isLoading: boolean = true;
//   serverUrl: string = 'http://172.19.2.52/umsweb/webftp/Journal/';

//   constructor(
//     private route: ActivatedRoute,
//     private journalService: LpujournalbookService
//   ) {}

//   ngOnInit(): void {
//     this.BookId = this.route.snapshot.params['Id'];
//     this.journalTitle = this.route.snapshot.params['name'].replace(/-/g, ' ');
    
//     if (this.BookId) {
//       this.loadIssues();
//     }
//   }

//   loadIssues() {
//     this.isLoading = true;
//     this.journalService.GetJournalIssues(this.BookId).subscribe({
//       next: (response: any) => {
//         this.issues = response.item1 || [];
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Error loading issues:', error);
//         this.isLoading = false;
//       }
//     });
//   }

//   downloadIssue(fileUrl: string) {
//     window.open(this.serverUrl + fileUrl, '_blank');
//   }

//   formatDate(dateString: string): string {
//     if (!dateString) return 'Not specified';
//     return new Date(dateString).toLocaleDateString();
//   }
// }


// showing data  with tables 
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import { LoginSessionService } from 'src/app/_services/login-session.service';

// @Component({
//   selector: 'app-JournalIssuesDetails',
//   templateUrl: './JournalIssuesDetails.component.html',
//   styleUrls: ['./JournalIssuesDetails.component.css']
// })
// export class JournalIssuesDetailsComponent implements OnInit {
//   BookId: any;
//   name: any;
//   JournalIssuesData: any[] = [];
//   paginatedJournalIssuesData: any[] = [];
//   currentPageEditor: number = 1;
//   pageSizeEditor: number = 10;
//   totalPagesEditor: number = 1;
//   isLoadingPage: boolean = false; // For initial page load
//   isLoadingJournal: boolean = false; // For journal selection load
//   serverUrl: string = 'http://172.19.2.52/umsweb/webftp/Journal/';

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

//   constructor(
//     private router: Router,
//     private cookieService: CookieService,
//     private journalWebApiService: LpujournalbookService,
//     private AuthSession: LoginSessionService,
//     private route: ActivatedRoute,
//   ) {}

//   ngOnInit(): void {
//     const BookId = this.route.snapshot.params['Id'];
//     this.name = this.route.snapshot.params['name'].replace(/-/g, ' ');

//     if (BookId) {
//       this.BookId = BookId;
//       this.GetAllIssues(BookId);
//     }
//   }

//   GetAllIssues(JournalId: any) {
//     this.isLoadingJournal = true; // Show loader when fetching issues
//     this.journalWebApiService.GetJournalIssues(JournalId).subscribe({
//       next: (dataX: any) => {
//         this.JournalIssuesData = dataX.item1 || [];
//         console.log('Fetched Journal Issues Data:', this.JournalIssuesData); // Log the fetched data
//         this.calculateTotalPagesEditor();
//         this.updatePaginatedDataEditor();
//         this.isLoadingJournal = false; // Hide loader after data is fetched
//       },
//       error: (error: any) => {
//         console.error('Error fetching journal issues', error);
//         this.isLoadingJournal = false; // Hide loader if error occurs
//       }
//     });
//   }

//   calculateTotalPagesEditor() {
//     this.totalPagesEditor = Math.ceil(this.JournalIssuesData.length / this.pageSizeEditor) || 1;
//   }

//   updatePaginatedDataEditor() {
//     const startIndex = (this.currentPageEditor - 1) * this.pageSizeEditor;
//     const endIndex = Math.min(startIndex + this.pageSizeEditor, this.JournalIssuesData.length);
//     this.paginatedJournalIssuesData = this.JournalIssuesData.slice(startIndex, endIndex);
//     console.log('Paginated Data:', this.paginatedJournalIssuesData); // Log paginated data
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



// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import { LoginSessionService } from 'src/app/_services/login-session.service';
// @Component({
//   selector: 'app-JournalIssuesDetails',
//   templateUrl: './JournalIssuesDetails.component.html',
//   styleUrls: ['./JournalIssuesDetails.component.css']
// })
// export class JournalIssuesDetailsComponent implements OnInit {
//   data: any[] =[];    BookId: any;  bookData: any;  JournalDetails: any;  detailsArray: any;
//   name: any;  

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

//   constructor(
//     private router: Router,
//     private cookieService: CookieService,
//     private journalWebApiService: LpujournalbookService,
//     private AuthSession: LoginSessionService,
//     private route: ActivatedRoute,
//   ) {}

  
//   VisitUrl(Id: any, name: any, Sufix: any) {
//     // alert(this.BookId + '/' + this.JournalTitle + '/' + Sufix)
//     this.router.navigateByUrl(Id + '/' + name + '/' + Sufix);
//   }
//   ngOnInit(): void {
//     let BookId  = this.route.snapshot.params['Id'];
//     this.name =this.JournalTitle =  this.route.snapshot.params['name'];
    
//       if (BookId != undefined || BookId != null) {
//         this.BookId = this.route.snapshot.params['Id'];
//         this.JournalTitle = this.name.replace(/-/g, ' ');
//         this.GetAllIssues(BookId);
//         this.serverUrl = 'http://172.19.2.52/umsweb/webftp/Journal/';
//       } 
//   }
 
//   GetAllIssues(JournalId: any) {
//     this.journalWebApiService.GetJournalIssues(JournalId).subscribe({
//       next: (dataX: any) => {
//         this.JournalIssuesData = dataX.item1 || [];
//         this.calculateTotalPagesEditor();
//         this.updatePaginatedDataEditor();
//         this.delayHideLoader('journal');  // Delay hiding the journal loader
//       },
//       error: (error: any) => {
//         console.error('Error fetching journal issues', error);
//         this.delayHideLoader('journal');  // Delay hiding the journal loader if error occurs
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
