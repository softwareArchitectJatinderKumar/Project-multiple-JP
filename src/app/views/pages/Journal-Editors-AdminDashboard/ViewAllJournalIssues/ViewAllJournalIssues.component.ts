declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import Swal from 'sweetalert2';
import { StorageService } from 'src/app/_services/storage.service';
@Component({
  selector: 'app-ViewAllJournalIssues',
  templateUrl: './ViewAllJournalIssues.component.html',
  styleUrls: ['./ViewAllJournalIssues.component.css']
})
export class ViewAllJournalIssuesComponent implements OnInit {
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
    'issueDescription',
    'authorName',
    'pageNumber',
    'Action',
    // 'id'
  ];

  displayedEditorColumnHeaders: { [key: string]: string } = {
    journalTitle: 'Journal Title',
    volume: 'Journal Volume',
    publishDate: 'Publish Date',
    issueTitle: 'Issue Title',
    issueFileName: 'File',
    issueDescription: 'Issue Description',
    authorName:'Author Name',
    pageNumber:'Page Number',
    Action:'Action',
    // id:'Event Id'
  };

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private journalWebApiService: LpujournalbookService,
    private AuthSession: LoginSessionService,
    private StoragesServices: StorageService,
  ) {}

  ngOnInit(): void {
    this.serverUrl = 'https://files.lpu.in/umsweb/Journal/';
    // this.serverUrl = 'http://172.19.2.52/umsweb/webftp/Journal/';
    if(this.getUserDetails())
      this.loadJournals();
    else
      {
        Swal.fire(
          'Invalid Login Details !',
          '',
          'error'
        ) 
        this.Logout();
      }
  }

  loadJournals() {
    this.isLoadingPage = true;
    this.journalWebApiService.GetAllBooksDetails().subscribe({
      next: (dataX: any) => {
        this.journalListsData = dataX.item1;
        this.delayHideLoader('page');
      },
      error: (error: any) => {
        console.error('Error fetching journals', error);
        this.delayHideLoader('page');
      }
    });
  }

  setJournalId() {
    const selectedJournal = this.journalListsData.find(journal => journal.id == this.JournalTitle);
    if (selectedJournal) {
      this.isLoadingJournal = true;  // Show loader when journal is selected
      this.GetAllIssues(selectedJournal.id);
    }
  }

  GetAllIssues(JournalId: any) {
    this.journalWebApiService.GetJournalIssues(JournalId).subscribe({
      next: (dataX: any) => {
        this.JournalIssuesData = dataX.item1 || [];
        // console.log(JSON.stringify(this.JournalIssuesData))
        this.calculateTotalPagesEditor();
        this.updatePaginatedDataEditor();
        this.delayHideLoader('journal');  // Delay hiding the journal loader
      },
      error: (error: any) => {
        console.error('Error fetching journal issues', error);
        this.delayHideLoader('journal');  // Delay hiding the journal loader if error occurs
      }
    });
  }

  delayHideLoader(loaderType: 'page' | 'journal') {
    const delay = 500; // Delay in milliseconds
    setTimeout(() => {
      if (loaderType === 'page') {
        this.isLoadingPage = false;
      } else if (loaderType === 'journal') {
        this.isLoadingJournal = false;
      }
    }, delay);
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
  // aded on 5-sep-25



  UserRole:any; user_Email: any;candidateName:any;
  
  getUserDetails(): boolean {
    const GetCookieData = this.cookieService.get('authData');
    const status = this.StoragesServices.isLoggedIn();

    // console.log('Cookie:', GetCookieData, 'Session status:', status);

    if (GetCookieData && status) {
      try {
        const retrievedCookies = JSON.parse(GetCookieData);

        this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
        this.user_Email = retrievedCookies.EmailId || '';
        this.candidateName = retrievedCookies.CandidateName || '';

        return true;
      } catch (err) {
        console.error('Invalid cookie data:', err);
        return false;
      }
    }

    return false;
  }


  selectedEventId:any; AssignedById:any; RecordId: any; currentJournalTitle:any;
  Reason: any;

  DisapproveStatus(rowData: any) {
    Swal.fire({
      title: "Reason for Rejection",
      // text: "Disapproval reason",
      input: 'text',
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        this.Reason = result.value;
        const formData = new FormData();
        formData.append('RecordId', rowData.id);
        formData.append('DisapprovalReason', this.Reason);
        formData.append('UpdatedBy',  this.user_Email);
        this.handleStatusChange(formData);
      } else {
        this.showCancelledSwal();
      }
    });
  }
  private handleStatusChange(formData: FormData) {
    this.journalWebApiService.DisableIssue(formData).subscribe((data: any) => {
      if (data.responseData === 'Cancel') {
        Swal.fire(
          'No Change!',
          ' ',
          'error'
        );
      } else {
        Swal.fire(
          'Rejected successfully !',
          '',
          'success'
        ).then(() => {
          window.location.reload();
        });
      }
    });
  }

  private showCancelledSwal() {
    Swal.fire(
      'Cancelled',
      ' ',
      'error'
    );
  }


  Logout(): void {
    this.cookieService.delete('authData');
    this.cookieService.delete('BookData');
    this.cookieService.deleteAll();

    sessionStorage.clear();
    localStorage.clear();

    this.AuthSession.clearSession();
    this.StoragesServices.clean?.();

    this.UserRole = '';
    this.user_Email = '';
    this.candidateName = '';

    this.router.navigateByUrl('Home').then(() => {
      setTimeout(() => {
        location.reload();
      }, 500);
    });
  }

}


// declare var bootstrap: any;
// import { DatePipe } from '@angular/common';
// import { AbstractControl, FormControl, FormGroup, UntypedFormGroup, ValidatorFn } from '@angular/forms';
// import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AuthService } from 'src/app/_services/auth.service';
// import { StorageService } from 'src/app/_services/storage.service';
// import { Validators } from '@angular/forms';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import Swal from 'sweetalert2';
// import { LoginSessionService } from 'src/app/_services/login-session.service';
// import { CookieService } from 'ngx-cookie-service';
// import { forkJoin } from 'rxjs'

// @Component({
//   selector: 'app-ViewAllJournalIssues',
//   templateUrl: './ViewAllJournalIssues.component.html',
//   styleUrls: ['./ViewAllJournalIssues.component.css']
// })
// export class ViewAllJournalIssuesComponent implements OnInit {
//   dataSource: any[] = []; dataX: any; booksData: any; dataShowing: any = false;
//   userRole: any; BookId: any; JournalId: any; JournalTitle: any = ''; name: any;
//   userId: any; serverUrl: any; supervisorName: any; departmentName: any;
//   candidateName: any;
//   Journals: any;
//   LoginStatus: boolean | undefined;
//   constructor(
//     private storageService: StorageService,
//     private authService: AuthService,
//     private fb: FormBuilder,
//     private router: Router,
//     private AuthSession: LoginSessionService,
//     private StoragesServices: StorageService,
//     private route: ActivatedRoute, private cookieService: CookieService,
//     private journalWebApiService: LpujournalbookService
//   ) {

//   }

//   dataLoaded: boolean = false;


//   Logout() {
//     this.cookieService.delete('authData');
//     this.cookieService.delete('BookData');

//     this.cookieService.deleteAll();

//     sessionStorage.clear();
//     localStorage.clear();

//     this.AuthSession.clearSession();
//     this.StoragesServices.clean();

//     this.userRole = null;
//     this.supervisorName = null;
//     this.departmentName = null;
//     this.candidateName = null;
//     this.LoginStatus = false;

//     this.router.navigateByUrl('Home').then(() => {
//       setTimeout(() => {
//         location.reload();
//       }, 500);
//     });
//   }

//   ngOnInit(): void {
//     this.serverUrl = 'https://files.lpu.in/umsweb/Journal/';
//     let loginStatus = this.checkUserLogin();

//     if (loginStatus == true) {
//       this.loadJournals();
//     } else {
//       this.Logout();
//     }
//   }
//   checkUserLogin(): Boolean | any {
//     const GetCookieData = this.cookieService.get('authData');
//     if (GetCookieData) {
//       try {
//         const retrievedCookies = JSON.parse(GetCookieData);
//         this.userRole = retrievedCookies.UserRole?.length > 0 ? retrievedCookies.UserRole : -1;
//         this.userId = retrievedCookies.EmailId;
//         // let Token = retrievedCookies.AccessToken;
//         this.supervisorName = retrievedCookies.SupervisorName;
//         this.departmentName = retrievedCookies.DepartmentName;
//         this.candidateName = retrievedCookies.CandidateName;
//         return true;
//       } catch (error) {
//         console.log("error");
//       }
//     } else {
//       return false;
//     }
//   }
//   currentJournalId: any;
//   currentJournalTitle: any;
//   setJournalId() {
//     // Find the journal object based on the selected ID
//     let idx = this.journalListsData.find(
//       journal => journal.id == this.JournalTitle
//     );
//     this.currentJournalId = idx.id;
//     this.currentJournalTitle = idx.journalTitle;
//     alert(JSON.stringify(idx))
//     this.GetAllIssues(this.currentJournalId);
//   }

//   journalListsData: any[] = [];
//   loadJournals() {
//     this.journalWebApiService.GetAllBooksDetails().subscribe({
//       next: (dataX: any) => {
//         this.dataSource = dataX.item1;
//         this.journalListsData = dataX.item1;
//         // console.info(JSON.stringify(this.journalListsData))
//       },
//       error: (error: any) => {
//         this.dataShowing = false;
//         console.error('Error fetching data', error);
//         // this.LoginFalied();
//       },
//       complete: () => {
//         this.dataShowing = true;
//       }
//     });
//   }
//   JournalIssuesData: any;
//   //journalId":60,"journalTitle":"Journal of Research and Ethics","volume":null,"publishDate":null,"issueTitle":"Test cases data ",

//   // "issueFileName":"IssueFile751714135_Doc-1.pdf","issueFileData":null,"issueDescription":"test case"}]

//     // Simplified and corrected column definitions
//     displayedEditorColumns: string[] = [
//       'journalTitle',
//       'volume',
//       'publishDate',
//       'issueTitle',
//       'issueFileName',
//       'issueDescription',
//       'journalTitle',       
//     ];

//     displayedEditorColumnHeaders: { [key: string]: string } = {
//       journalTitle: 'Journal Title',
//       volume: 'Journal Volume',
//       publishDate: 'publishDate',
//       issueTitle: 'issueTitle',
//       issueFileName: 'File ',
//       issueDescription: 'issueDescription',
//     };



//   displayedColumns: string[] = [
//     // 'journalId',
//     'journalTitle',
//     'volume',
//     'publishDate',
//     'issueTitle',
//     'issueFileName',
//     'issueDescription'
//   ];
//   displayedColumnsHeader: { [key: string]: string } = {
//     journalTitle: 'Journal Title',
//     volume: 'volume',
//     publishDate: 'publish Date',
//     issueTitle: 'issue Title',
//     issueFileName: 'File',
//     issueDescription:   'issue Description'

//   } 


//   GetAllIssues(JournalId: any) {
//     this.journalWebApiService.GetJournalIssues(JournalId).subscribe({
//       next: (dataX: any) => {
//         this.dataSource = dataX.item1;
//         this.JournalIssuesData = dataX.item1;
//         console.info(JSON.stringify(this.JournalIssuesData))
//       },
//       error: (error: any) => {
//         this.dataShowing = false;
//         console.error('Error fetching data', error);
//         // this.LoginFalied();
//       },
//       complete: () => {
//         this.dataShowing = true;
//       }
//     });
//   }

//   isLoading: boolean = false; // Simplified from array to single boolean
//   currentPageEditor: number = 1;
//   pageSizeEditor: number = 10;
//   paginatedJournalIssuesData: any[] = [];
//   totalPagesEditor: number = 1;
//   onSelectFileEditorX(fileUrl: string) {
//     window.open('https://files.lpu.in/umsweb/Journal/' + fileUrl, '_blank');
//   }

//   calculateTotalPagesEditor() {
//     // Fixed: Use pageSizeEditor instead of totalPagesEditor
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



// }






// loader working fine

// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormBuilder } from '@angular/forms';
// import { CookieService } from 'ngx-cookie-service';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import { LoginSessionService } from 'src/app/_services/login-session.service';
// import { finalize } from 'rxjs';

// @Component({
//   selector: 'app-ViewAllJournalIssues',
//   templateUrl: './ViewAllJournalIssues.component.html',
//   styleUrls: ['./ViewAllJournalIssues.component.css']
// })
// export class ViewAllJournalIssuesComponent implements OnInit {
//   dataSource: any[] = [];
//   journalListsData: any[] = [];
//   JournalIssuesData: any[] = [];
//   paginatedJournalIssuesData: any[] = [];
//   currentPageEditor: number = 1;
//   pageSizeEditor: number = 10;
//   totalPagesEditor: number = 1;
//   JournalTitle: any = '';

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
//     private AuthSession: LoginSessionService
//   ) { }

//   ngOnInit(): void {
//     this.loadJournals();
//   }

//   isLoading: boolean = false;
//   loadJournals() {
//     this.isLoading = true;
//     const minLoadingTime = 2500; // 2.5 seconds
//     const startTime = Date.now();
//     this.journalWebApiService.GetAllBooksDetails()
//       .pipe(
//         finalize(() => {
//           const elapsed = Date.now() - startTime;
//           const remaining = Math.max(minLoadingTime - elapsed, 0);
//           setTimeout(() => {
//             this.isLoading = false;
//           }, remaining);
//         })
//       ).subscribe({
//         next: (dataX: any) => {
//           this.journalListsData = dataX.item1;
//         },
//         error: (error: any) => {
//           console.error('Error fetching journals', error);
//         }
//       });
//   }

//   setJournalId() {
//     const selectedJournal = this.journalListsData.find(journal => journal.id == this.JournalTitle);
//     if (selectedJournal) {
//       this.GetAllIssues(selectedJournal.id);
//     }
//   }

//   GetAllIssues(JournalId: any) {
//     this.isLoading = true;
//     const minLoadingTime = 2500; // 2.5 seconds
//     const startTime = Date.now();
//     this.journalWebApiService.GetJournalIssues(JournalId) .pipe(
//       finalize(() => {
//         const elapsed = Date.now() - startTime;
//         const remaining = Math.max(minLoadingTime - elapsed, 0);
//         setTimeout(() => {
//           this.isLoading = false;
//         }, remaining);
//       })
//     ).subscribe({
//       next: (dataX: any) => {
//         this.JournalIssuesData = dataX.item1;
//         console.log(JSON.stringify(this.JournalIssuesData))
//         this.calculateTotalPagesEditor();
//         this.updatePaginatedDataEditor();
//       },
//       error: (error: any) => {
//         console.error('Error fetching journal issues', error);
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
//     window.open('https://files.lpu.in/umsweb/Journal/' + fileUrl, '_blank');
//   }
// }




