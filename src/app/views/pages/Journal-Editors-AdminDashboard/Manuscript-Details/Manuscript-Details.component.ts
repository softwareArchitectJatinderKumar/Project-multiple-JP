declare var bootstrap: any;
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import Swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-Manuscript-Details',
  templateUrl: './Manuscript-Details.component.html',
  standalone: false, styleUrls: ['./Manuscript-Details.component.scss']
})
export class ManuscriptDetailsComponent implements OnInit {
  fromDate: any; booksDataColumns: any; toDate: any; pipe = new DatePipe('en-CA');
  dataSource: any[] = []; dataX: any; booksData: any; dataShowing: any = false;
  userRole: any; BookId: any; JournalId: any; JournalTitle: any = ''; name: any;
  userId: any; serverUrl: any; supervisorName: any; departmentName: any;
  candidateName: any;
  displayedColumns: string[] = [
    // 'journalId',
    'journalTitle',
    'editorInChief',
    'JournalsType',
    'submissionType',
    // 'fileUrl'
  ];
  displayedColumnsHeader: string[] = [
    // 'journalId',
    'Journal Title',
    'Editor In Chief',
    'Journals Type',
    'Submission Type',
    // 'Action'
  ];
  Journals: any;
  LoginStatus: boolean | undefined;
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private AuthSession: LoginSessionService,
    private StoragesServices: StorageService,
    private route: ActivatedRoute, private cookieService: CookieService,
    private journalWebApiService: LpujournalbookService
  ) {

  }

  dataLoaded: boolean = false;


  Logout() {
    this.cookieService.delete('authData');
    this.cookieService.delete('BookData');

    this.cookieService.deleteAll();

    sessionStorage.clear();
    localStorage.clear();

    this.AuthSession.clearSession();
    this.StoragesServices.clean();

    this.userRole = null;
    this.supervisorName = null;
    this.departmentName = null;
    this.candidateName = null;
    this.LoginStatus = false;

    this.router.navigateByUrl('Home').then(() => {
      setTimeout(() => {
        location.reload();
      }, 500);
    });
  }

  ngOnInit(): void {
    this.serverUrl = 'https://files.lpu.in/umsweb/Journal/';
    let loginStatus = this.checkUserLogin();

    if (loginStatus == true) {
      this.loadJournals();
    } else {
      this.Logout();
    }
  }
  currentJournalId: any;
  currentJournalTitle: any;
  setJournalId() {
    // Find the journal object based on the selected ID
    let idx = this.journalListsData.find(
      journal => journal.id == this.JournalTitle
    );
    this.currentJournalId = idx.id;
    this.currentJournalTitle = idx.journalTitle;
    // alert(JSON.stringify(idx))
    this.showEditorData(this.currentJournalId);
    this.loadReviewers(this.currentJournalId);
  }
  checkUserLogin(): Boolean | any {
    const GetCookieData = this.cookieService.get('authData');
    if (GetCookieData) {
      try {
        const retrievedCookies = JSON.parse(GetCookieData);
        this.userRole = retrievedCookies.UserRole?.length > 0 ? retrievedCookies.UserRole : -1;
        this.userId = retrievedCookies.EmailId;
        // let Token = retrievedCookies.AccessToken;
        this.supervisorName = retrievedCookies.SupervisorName;
        this.departmentName = retrievedCookies.DepartmentName;
        this.candidateName = retrievedCookies.CandidateName;
        return true;
      } catch (error) {
        console.log("error");
      }
    } else {
      return false;
    }
  }

  EditorDataColumns: any;
  loadingTimeout: any[] = []; // Store timeout references

  EditorData: any[] = []; // Typed as array
  isLoading: boolean = false; // Simplified from array to single boolean
  currentPageEditor: number = 1;
  pageSizeEditor: number = 10;
  paginatedEditorData: any[] = [];
  totalPagesEditor: number = 1;

  // Simplified and corrected column definitions
  displayedEditorColumns: string[] = [
    'journalTitle',
    'manuScript',
    'editorInChief',
    'emailId',
    'userName',
    'submissionType',
    'fileUrl',
    'journalId'
  ];

  displayedEditorColumnHeaders: { [key: string]: string } = {
    journalTitle: 'Journal Title',
    manuScript: 'Manuscript',
    editorInChief: 'Author Name',
    emailId: 'Submitted User Email',
    userName: 'Submitted By',
    submissionType: 'Submission Type',
    fileUrl: 'File Download',
    journalId: 'Assign Reviewer'
  };



  showEditorData(journalId: any) {
    this.isLoading = true;
    this.journalWebApiService.GetAllMenuScriptForJournalId(journalId).subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.EditorData = dataX.item1 || [];
        // console.log("Editor Data:", JSON.stringify(this.EditorData));

        this.dataLoaded = true;
        this.dataShowing = true;

        if (this.EditorData.length > 0) {
          this.calculateTotalPagesEditor();
          this.updatePaginatedDataEditor();
        } else {
          this.totalPagesEditor = 1;
          this.paginatedEditorData = [];
        }
      },
      error: (error: any) => {
        this.dataShowing = false;
        this.isLoading = false;
        console.error('Error fetching data', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSelectFileEditorX(fileUrl: string) {
    window.open('https://files.lpu.in/umsweb/Journal/' + fileUrl, '_blank');
  }

  calculateTotalPagesEditor() {
    // Fixed: Use pageSizeEditor instead of totalPagesEditor
    this.totalPagesEditor = Math.ceil(this.EditorData.length / this.pageSizeEditor) || 1;
  }

  updatePaginatedDataEditor() {
    const startIndex = (this.currentPageEditor - 1) * this.pageSizeEditor;
    const endIndex = Math.min(startIndex + this.pageSizeEditor, this.EditorData.length);
    this.paginatedEditorData = this.EditorData.slice(startIndex, endIndex);
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


  AssignedById: any; selectedReviewerId: any = ''; selectedJournalId: any;
  RecordId: any;
  // added on 22-5-25
  SubmittedbyUserId: any; ManuscriptType: any; submissionType: any;
  onTakeAction(rowData: any) {
    // console.log(JSON.stringify(rowData))
    this.selectedJournalId = rowData['journalId'];
    this.AssignedById = rowData['emailId'];
    this.RecordId = rowData['id'];
    this.ManuscriptType = rowData['manuScript']
  }
  assignReviewer() {
    if (!this.selectedReviewerId) {
      alert('Please select a reviewer.');
      return;
    }
    // AssignNewReviewerForJournal


    const formData = new FormData();
    // alert(this.AssignedById +" reviewer Emaild " + this.selectedReviewerId)
    // Append form data to the FormData object
    formData.append('JournalId', this.selectedJournalId);
    formData.append('AssignedTo', this.selectedReviewerId);
    formData.append('SubmittedBy', this.AssignedById);
    formData.append('RecordId', this.RecordId);
    formData.append('JournalTitle', this.currentJournalTitle);
    formData.append('Manuscript', this.ManuscriptType);
    formData.append('SubmissionType', this.submissionType);


    this.journalWebApiService.AssignNewReviewerForJournal(formData).subscribe({
      next: (data) => {
        let result = data.item1[0]['returnData'];
        let errorCode = data.item1[0]['returnId'];

        if (result === 'success') {
          Swal.fire({
            title: 'Reviewer Assiged ',
            text: data.item1[0]['msg'],
            icon: 'success',
          }).then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire({
            title: 'Some Technical Issue',
            text: result,
            icon: 'error',
          }).then(() => {
            window.location.reload();
          });
        }
      },
      error: (err) => {
        Swal.fire({
          title: 'Error Occurred',
          text: 'Unable to complete the request. Please try again later.',
          icon: 'error',
        });
      }
    });

    alert(`Journal ID: ${this.selectedJournalId} assigned to Reviewer ID: ${this.selectedReviewerId}`);

    // Close modal after success
    let modal = bootstrap.Modal.getInstance(document.getElementById('assignReviewerModal'));
    modal.hide();
  }


  reviewerList: any[] = [];
  loadReviewers(id: any) {
    // API call to fetch reviewer list
    // this.journalWebApiService.GetReviewerDetailsForEditors(this.userId).subscribe({
    this.journalWebApiService.GetReviewerDetailsForEditors(id).subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.reviewerList = dataX.item1;

      },
      error: (error: any) => {
        this.dataShowing = false;
        console.error('Error fetching data', error);
        // this.LoginFalied();
      },
      complete: () => {
        this.dataShowing = true;

      }
    });

  }

  journalListsData: any[] = [];
  loadJournals() {
    this.journalWebApiService.GetAllBooksDetails().subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.journalListsData = dataX.item1;
        // console.info(JSON.stringify(this.journalListsData))
      },
      error: (error: any) => {
        this.dataShowing = false;
        console.error('Error fetching data', error);
        // this.LoginFalied();
      },
      complete: () => {
        this.dataShowing = true;

      }
    });

  }

}
