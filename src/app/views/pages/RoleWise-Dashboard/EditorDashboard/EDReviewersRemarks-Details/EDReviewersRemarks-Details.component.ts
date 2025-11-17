declare var bootstrap: any;
import { DatePipe } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { Validators } from '@angular/forms';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import Swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin } from 'rxjs'
@Component({
  selector: 'app-EDReviewersRemarks-Details',
  templateUrl: './EDReviewersRemarks-Details.component.html',
  styleUrls: ['./EDReviewersRemarks-Details.component.scss'],standalone: false
})
export class EDReviewersRemarksDetailsComponent implements OnInit {
  fromDate: any;    booksDataColumns: any;  toDate: any;  pipe = new DatePipe('en-CA');
  dataSource: any[] = [];   dataX: any;   booksData: any;  dataShowing: any = false;
  userRole: any;    BookId: any;    JournalId: any;  JournalTitle: any; name: any;
  userId: any;    serverUrl: any;   supervisorName: any;    departmentName: any;
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
tableColumns: any;
pageSize: any;
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private AuthSession: LoginSessionService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService,
    private journalWebApiService: LpujournalbookService  
  ) {
    
  }

  dataLoaded: boolean = false;
  LoginFalied(){
    this.router.navigateByUrl('Home').then(() => {
      setTimeout(() => {
        location.reload();
      }, 500);
    });
  }
   
  ngOnInit(): void {
    this.serverUrl='https://files.lpu.in/umsweb/Journal/';
    this.BookId  =   this.route.snapshot.params['Id'];
    const name: any = this.name = this.route.snapshot.params['name'];
    this.JournalTitle = name.replace(/-/g, ' ');
    
    let loginStatus = this.checkUserLogin();
     

    // alert(bookId+name+'ExternalLogin');
    if (this.BookId> 0  && loginStatus==true) {
      this.JournalId = this.BookId;
      this.JournalTitle = name.replace(/-/g, ' ');
      this.GetallReviewsData(this.BookId);
      this.loadReviewers(this.BookId);
    } else {

      this.LoginFalied();
    }

  }
 
  checkUserLogin(): Boolean | any{
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

  currentPageReviewerRemarks: number = 1;
  pageSizeReviewerRemarks: number = 10;
  paginatedReviewerRemarks: any[] = [];
  totalPagesReviewerRemarks: number = 1;
  ReviewerRemarksData: any[] = [];
  ReviewerRemarksDataColumns: string[] = [];
  
    // Display headers mapping
    displayedReviewerRemarksColumnHeaders: { [key: string]: string } = {
      // 'reviewerName':'Reviewer Name',
      // 'publicationDate':'Published Date',
      reviewerTerm: 'Term Reviewed',
      overallRating: 'Overall Rating',
      commentsForAuthor: 'Comments for Author',
      commentsforEditor: 'Comments for Editor',
      transferResponse: 'Transfer Response',
      newSubjectRating: 'Subject Rating',
      manuscriptRating: 'Manuscript Rating',
      manuscriptOrganisedRating: 'Manuscript Organised Rating',
      journalId: 'Action',
      approvalStatus: 'Status',  
      fileUrl: 'Manuscript File'
    };
    
    ReviewerRemarksdisplayedColumns: string[] = [
      // 'reviewerName',
      // 'publicationDate',
      'reviewerTerm',
      'overallRating',
      'commentsForAuthor',
      'commentsforEditor',
      'transferResponse',
      'newSubjectRating',
      'manuscriptRating',
      'manuscriptOrganisedRating',
      'journalId',
      'approvalStatus',  
      'fileUrl'
    ];
  calculateTotalPagesReviewerRemarks() {
    this.totalPagesReviewerRemarks = Math.ceil(this.ReviewerRemarksData.length / this.pageSizeReviewerRemarks);
  }
  
  updatePaginatedDataReviewerRemarks() {
    const startIndex = (this.currentPageReviewerRemarks - 1) * this.pageSizeReviewerRemarks;
    this.paginatedReviewerRemarks = this.ReviewerRemarksData.slice(startIndex, startIndex + this.pageSizeReviewerRemarks);
  }
  
  nextPageReviewerRemarks() {
    if (this.currentPageReviewerRemarks < this.totalPagesReviewerRemarks) {
      this.currentPageReviewerRemarks++;
      this.updatePaginatedDataReviewerRemarks();
    }
  }
  
  previousPageReviewerRemarks() {
    if (this.currentPageReviewerRemarks > 1) {
      this.currentPageReviewerRemarks--;
      this.updatePaginatedDataReviewerRemarks();
    }
  }
  
  GetallReviewsData(journalId: any) {
    this.journalWebApiService.GetAllReviewersRemarkss(journalId).subscribe({
      next: (dataXY: any) => {
        this.ReviewerRemarksData = dataXY.item1 || [];
        // console.log("Fetched ReviewerRemarksData:", this.ReviewerRemarksData);
        
        if (this.ReviewerRemarksData.length > 0) {
          this.ReviewerRemarksDataColumns = Object.keys(this.ReviewerRemarksData[0]);
          this.calculateTotalPagesReviewerRemarks();
          this.updatePaginatedDataReviewerRemarks();
        }
  
        this.dataShowing = true;
      },
      error: (error: any) => {
        console.error('Error fetching data', error);
        this.dataShowing = false;
        this.LoginFalied();
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

 
  AssignedById: any; selectedReviewerId: any=''; selectedJournalId: any;
  RecordId: any;
  onTakeAction(rowData: any) {
    // console.log(JSON.stringify(rowData))
    this.selectedJournalId = rowData['journalId'];
    this.AssignedById = rowData['emailId'];
    this.RecordId = rowData['id'];
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
    formData.append('SubmittedBy',this.AssignedById);
    formData.append('RecordId',this.RecordId);
  
  
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
  loadReviewers(id:any) {
    // API call to fetch reviewer list
    this.journalWebApiService.GetReviewerDetailsForEditors(this.userId).subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.reviewerList = dataX.item1;
        // console.log("ALL Reviewerlist" + JSON.stringify(this.reviewerList))

      },
      error: (error: any) => {
        this.dataShowing = false;
        console.error('Error fetching data', error);
        // this.LoginFalied();
      },
      complete: () => {
        this.dataShowing = true;
        // console.log('Data fetching complete');
      }
    });
    // this.journalWebApiService.GetAllReviewersForJournalId(id).subscribe((reviewers) => {
    //   this.reviewerList = reviewers;
    // });
    // this.selectedReviewerId.value='select';
  }
Reason: any;

  DisapproveStatus(rowData: any) {
    alert(rowData.manuscriptId)
    Swal.fire({
      title: "Reason for Disapproval",
      // text: "Disapproval reason",
      input: 'text',
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        this.Reason = result.value;
        const formData = new FormData();
        formData.append('Id', rowData.manuscriptId);
        formData.append('DisapprovalReason', this.Reason);
        formData.append('Action', 'Disapprove');
        this.handleStatusChange(formData, 'Disapprove');
      } else {
        this.showCancelledSwal();
      }
    });
  }


  
 
  ChangeApproveStatus(rowData: any) {
    alert(rowData.manuscriptId)
    const formData = new FormData();
    formData.append('Id', rowData.manuscriptId);
    formData.append('Action', 'Approve');

    Swal.fire({
      title: 'Are you sure you want to change the status?',
      text: 'Kindly confirm if the document is valid!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, accept current changes!',
      cancelButtonText: 'No, do not change it'
    }).then((result: any) => {
      if (result.value) {
        this.handleStatusChange(formData, 'Approve');
      } else {
        this.showCancelledSwal();
      }
    });
  }

  private handleStatusChange(formData: FormData, action: string) {
    this.journalWebApiService.ApproveDocument(formData).subscribe((data: any) => {
      if (action === 'Approve' && data.responseData === 'Cancel') {
        Swal.fire(
          'No Change!',
          ' ',
          'error'
        );
      } else {
        Swal.fire(
          ' Approved/Disapproved successfully !',
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

}
