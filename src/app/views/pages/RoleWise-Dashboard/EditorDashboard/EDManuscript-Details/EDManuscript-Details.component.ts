declare var bootstrap: any;
import { DatePipe } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, NgForm, UntypedFormGroup, ValidatorFn } from '@angular/forms';
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
  selector: 'app-EDManuscript-Details',
  templateUrl: './EDManuscript-Details.component.html',
  styleUrls: ['./EDManuscript-Details.component.scss'],standalone: false
})
export class EDManuscriptDetailsComponent implements OnInit {
  @ViewChild('reviewerForm') reviewerForm: NgForm | undefined;
  
  fromDate: any; booksDataColumns: any; toDate: any; pipe = new DatePipe('en-CA');
  dataSource: any[] = []; dataX: any; booksData: any; dataShowing: any = false;
  userRole: any; BookId: any; JournalId: any; JournalTitle: any; name: any;
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

    this.serverUrl='https://files.lpu.in/umsweb/Journal/';
    this.BookId  =   this.route.snapshot.params['Id'];
    this.name  = this.route.snapshot.params['name'];
    let loginStatus = this.checkUserLogin();

    const bookId: any = this.BookId = this.route.snapshot.params['Id'];
    const name: any = this.name = this.route.snapshot.params['name'];
    this.JournalTitle = name.replace(/-/g, ' ');

     
    if (bookId>0 && loginStatus==true) {
      this.BookId = bookId; this.JournalId = bookId;
      this.JournalTitle = name.replace(/-/g, ' ');
      this.showEditorData(this.BookId);
      this.loadReviewers(this.BookId);
    } else {

       this.Logout();
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

  // Simplified and corrected column definitions
  
  
  // EditordisplayedColumns: string[] = [
  //   // 'journalTitle',
  //   // 'manuScript',
  //   'manuScriptTitle',
  //   // 'editorInChief',
  //   'emailId',
  //   'userName',
  //   'uploadedOn',
  //   'fileUrl',
  //   'reviewerAssigned',
  //   'journalId',
  // ];

  // EditordisplayedColumnsHeader: string[] = [
  //   // 'Journal Title',
  //   'manuScriptTitle',
  //   // 'Manuscript',
  //   // 'Editor In Chief',
  //   'User Email',
  //   'User Name',
  //   'Uploaded Date',
  //   'Download File',
  //   'Action'
  // ];
  displayedEditorColumns: string[] = [
    'manuScriptTitle',
    'editorInChief',
    'userName',
    'submissionType',
    'fileUrl',
    'reviewerAssigned',
    'journalId',
  ];

  displayedEditorColumnHeaders: { [key: string]: string } = {
    // journalTitle: 'Journal Title',
    manuScriptTitle: 'Manuscript Title',
    editorInChief: 'Author Name',
    userName: 'Submitted By',
    submissionType: 'Submission Type',
    fileUrl: 'File Download',
    reviewerAssigned: 'Assign Reviewer',
    journalId: 'Delete Action'
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

  selectedJournalId: any;
  selectedReviewerId: string = '';
  // reviewerList: any[] = [];
 
  AssignedById: any;
  RecordId: any;
  onTakeAction(rowData: any) {
    // console.log(JSON.stringify(rowData))
    this.selectedJournalId = rowData['journalId'];
    this.AssignedById = rowData['emailId'];
    this.RecordId = rowData['id'];
  }

  markAllFieldsTouched(form: NgForm) {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  
  reviewerType: 'internal' | 'external' = 'internal';
// selectedReviewerId: string = '';
externalReviewer = {
  name: '',
  email: '',
  contact: ''
};

selectedReviewerIds: string[] = [];

toggleReviewerSelection(email: string, event: Event): void {
  const checkbox = event.target as HTMLInputElement;
  const isChecked = checkbox.checked;

  const index = this.selectedReviewerIds.indexOf(email);

  if (isChecked && index === -1) {
    if (this.selectedReviewerIds.length >= 3) {
      checkbox.checked = false;
      alert('Maximum 3 reviewers can be selected.');
      return;
    }
    this.selectedReviewerIds.push(email);
  } else if (!isChecked && index !== -1) {
    this.selectedReviewerIds.splice(index, 1);
  }
}


// toggleReviewerSelection(email: string): void {
//   const index = this.selectedReviewerIds.indexOf(email);
//   if (index > -1) {
//     this.selectedReviewerIds.splice(index, 1);
//   } else {
//     if (this.selectedReviewerIds.length < 3) {
//       this.selectedReviewerIds.push(email);
//     } else {
//       alert('Maximum 3 reviewers can be selected.');
//     }
//   }
// }
isReviewerFormValid(): boolean {
  if (this.reviewerType === 'internal') {
    return this.selectedReviewerIds && this.selectedReviewerIds.length > 0;
  }

  if (this.reviewerType === 'external') {
    return (
      this.externalReviewers.length >= 3 &&
      this.externalReviewers.every(r =>
        r.name?.trim() &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email) &&
        /^\d{10}$/.test(r.contact)
      )
      // this.externalReviewer.name?.trim()?.length > 0 &&
      // this.externalReviewer.email?.trim()?.length > 0 &&
      // /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.externalReviewer.email) &&
      // this.externalReviewer.contact?.trim()?.length === 10 &&
      // /^[0-9]{10}$/.test(this.externalReviewer.contact)
    );
  }

  return false;
}
getReviewerNameByEmail(email: string): string {
  const reviewer = this.reviewerList.find(r => r.emailId === email);
  return reviewer ? reviewer.candidateName : email;
}

// assignReviewer() {
//   const formData = new FormData();
//   if (!this.isReviewerFormValid()) return;
//   if (this.reviewerType === 'internal') {
//     if (!this.selectedReviewerIds) {
//       alert('Please select an internal reviewer.');
//       return;
//     }

//     // alert(this.AssignedById +" reviewer Emaild " + this.selectedReviewerId)
//     // Append form data to the FormData object
//     formData.append('JournalId', this.selectedJournalId);
//     // formData.append('AssignedTo', this.selectedReviewerIds.join(','));
//     formData.append('MultipleAssignedTo', this.selectedReviewerIds.join(','));
//     formData.append('SubmittedBy', this.AssignedById);
//     formData.append('RecordId', this.RecordId);
//     // console.log('Submitting Form Data:');
//     // formData.forEach((value, key) => {
//     //   console.log(key + ':', value);
//     // });
//     this.assignInternalReviewer(formData);

//   } else if (this.reviewerType === 'external') {
//     const { name, email, contact } = this.externalReviewer;

//     if (!name || !email || !contact) {
//       alert('Please fill all external reviewer details.');
//       return;
//     }

//     formData.append('JournalTitle', this.JournalTitle);
//     formData.append('JournalId', this.selectedJournalId);
//     formData.append('AssignedTo', email); // Use email as unique ID    
//     formData.append('RecordId', this.RecordId);
//     formData.append('CandidateName', name);
//     formData.append('UserEmail', email);
//     formData.append('MobileNumber', contact);
//     formData.append('UserType', '2');
//     formData.append('PasswordText', contact);
//     formData.append('SubmittedBy', this.AssignedById);
//     formData.append('AuthorEmailId', this.AuthorEmailId);
//     // console.log('Submitting Form Data:');
//     //   formData.forEach((value, key) => {
//     //     console.log(key + ':', value);
//     //   }); 
//     this.assignExternalReviewer(formData);
//   }

// }
AuthorEmailId: any;
assignReviewer() {
  const formData = new FormData();
  if (!this.isReviewerFormValid()) return;

  if (this.reviewerType === 'internal') {
    if (!this.selectedReviewerIds || this.selectedReviewerIds.length === 0) {
      alert('Please select at least one internal reviewer.');
      return;
    }

    formData.append('JournalId', this.selectedJournalId);
    formData.append('MultipleAssignedTo', this.selectedReviewerIds.join(','));
    formData.append('SubmittedBy', this.AssignedById);
    formData.append('RecordId', this.RecordId);

    this.assignInternalReviewer(formData);
  } else if (this.reviewerType === 'external') {
    if (!this.externalReviewers || this.externalReviewers.length < 3) {
      alert('Please add at least 3 external reviewers.');
      return;
    }

    this.externalReviewers.forEach(reviewer => {
      if (!reviewer.name || !reviewer.email || !reviewer.contact) {
        alert('All external reviewer fields are required.');
        return;
      }

      const reviewerFormData = new FormData();
      reviewerFormData.append('JournalTitle', this.JournalTitle);
      reviewerFormData.append('JournalId', this.selectedJournalId);
      reviewerFormData.append('AssignedTo', reviewer.email);
      reviewerFormData.append('RecordId', this.RecordId);
      reviewerFormData.append('CandidateName', reviewer.name);
      reviewerFormData.append('UserEmail', reviewer.email);
      reviewerFormData.append('MobileNumber', reviewer.contact);
      reviewerFormData.append('UserType', '2');
      reviewerFormData.append('PasswordText', reviewer.contact);
      reviewerFormData.append('SubmittedBy', this.AssignedById);
      reviewerFormData.append('AuthorEmailId', this.AuthorEmailId);

      this.assignExternalReviewer(reviewerFormData); // send one by one
    });
  }

 
  this.resetReviewerForm();

  const modalEl = document.getElementById('assignReviewerModal');
  if (modalEl) {
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance?.hide();
  }
}

assignInternalReviewer(data:any){
  if (this.reviewerForm) {
    this.reviewerForm.resetForm();
  }
  this.journalWebApiService.AssignNewReviewerForJournal(data).subscribe({
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

  alert(`Journal ID: ${this.selectedJournalId} assigned to Reviewer ID: ${this.selectedReviewerIds.join(',')}`);

  // Close modal after success
  let modal = bootstrap.Modal.getInstance(document.getElementById('assignReviewerModal'));
  modal.hide();
}

assignExternalReviewer(data:any){
  if (!this.isReviewerFormValid()) return;
  this.journalWebApiService.AssignExternalReviewerForJournal(data).subscribe({
    next: (data) => {
      let result = data.item1[0]['returnData'];
      let errorCode = data.item1[0]['returnId'];

      if (result === 'success') {
        Swal.fire({
          title: 'Reviewer Assigned',
          text: data.item1[0]['msg'],
          icon: 'success',
        }).then(() => window.location.reload());
      } else {
        Swal.fire({
          title: 'Some Technical Issue',
          text: result,
          icon: 'error',
        }).then(() => window.location.reload());
      }
    },
    error: () => {
      Swal.fire({
        title: 'Error Occurred',
        text: 'Unable to complete the request. Please try again later.',
        icon: 'error',
      });
    }
  });

  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('assignReviewerModal'));
  modal?.hide();
}

ngAfterViewInit(): void {
  const modalEl = document.getElementById('assignReviewerModal');
  if (modalEl) {
    modalEl.addEventListener('hidden.bs.modal', () => {
      this.resetReviewerForm();
    });
  }
}

resetReviewerForm() {
  // Reset form state
  if (this.reviewerForm) {
    this.reviewerForm.resetForm();
  }

  // Clear reviewer type & selections
  this.reviewerType = 'internal';
  this.selectedReviewerIds = [];

  // Reset external reviewers list
  this.externalReviewers = [
    { name: '', email: '', contact: '' }
  ];
}



externalReviewers: any[] = [
  { name: '', email: '', contact: '' }
];

addExternalReviewer() {
  this.externalReviewers.push({ name: '', email: '', contact: '' });
}

removeExternalReviewer(index: number) {
  if (this.externalReviewers.length > 1) {
    this.externalReviewers.splice(index, 1);
  }
}



  // AssignedById: any; selectedReviewerId: any = ''; selectedJournalId: any;
  // RecordId: any;
  // onTakeAction(rowData: any) {
  //   // console.log(JSON.stringify(rowData))
  //   this.selectedJournalId = rowData['journalId'];
  //   this.AssignedById = rowData['emailId'];
  //   this.RecordId = rowData['id'];
  // }
  // assignReviewer() {
  //   if (!this.selectedReviewerId) {
  //     alert('Please select a reviewer.');
  //     return;
  //   }
  //   // AssignNewReviewerForJournal


  //   const formData = new FormData();
  //   // alert(this.AssignedById +" reviewer Emaild " + this.selectedReviewerId)
  //   // Append form data to the FormData object
  //   formData.append('JournalId', this.selectedJournalId);
  //   formData.append('AssignedTo', this.selectedReviewerId);
  //   formData.append('SubmittedBy', this.AssignedById);
  //   formData.append('RecordId', this.RecordId);


  //   this.journalWebApiService.AssignNewReviewerForJournal(formData).subscribe({
  //     next: (data) => {
  //       let result = data.item1[0]['returnData'];
  //       let errorCode = data.item1[0]['returnId'];

  //       if (result === 'success') {
  //         Swal.fire({
  //           title: 'Reviewer Assiged ',
  //           text: data.item1[0]['msg'],
  //           icon: 'success',
  //         }).then(() => {
  //           window.location.reload();
  //         });
  //       } else {
  //         Swal.fire({
  //           title: 'Some Technical Issue',
  //           text: result,
  //           icon: 'error',
  //         }).then(() => {
  //           window.location.reload();
  //         });
  //       }
  //     },
  //     error: (err) => {
  //       Swal.fire({
  //         title: 'Error Occurred',
  //         text: 'Unable to complete the request. Please try again later.',
  //         icon: 'error',
  //       });
  //     }
  //   });

  //   alert(`Journal ID: ${this.selectedJournalId} assigned to Reviewer ID: ${this.selectedReviewerId}`);

  //   // Close modal after success
  //   let modal = bootstrap.Modal.getInstance(document.getElementById('assignReviewerModal'));
  //   modal.hide();
  // }


  reviewerList: any[] = [];
  loadReviewers(id: any) {
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

  // added on 31-July-25
 
  
  EditordisplayedColumns: string[] = [
    // 'journalTitle',
    // 'manuScript',
    'manuScriptTitle',
    // 'editorInChief',
    'emailId',
    'userName',
    'uploadedOn',
    'fileUrl',
    'reviewerAssigned',
    'journalId',
  ];

  EditordisplayedColumnsHeader: string[] = [
    // 'Journal Title',
    'manuScriptTitle',
    // 'Manuscript',
    // 'Editor In Chief',
    'User Email',
    'User Name',
    'Uploaded Date',
    'Download File',
    'Action'
  ];

  
  onDeleteAction(rowData: any) {
    this.selectedJournalId = rowData['journalId'];
    this.AssignedById = rowData['emailId'];
    this.RecordId = rowData['id'];
    Swal.fire({
      title: "Disapproval reason",
      // text: "Disapproval reason",
      input: 'text',
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        const Reasons= result.value;
        const formData = new FormData();
        formData.append('RecordId', this.RecordId);
        formData.append('DisapprovalReason', Reasons);
        formData.append('UpdatedBy', this.AssignedById);
        this.DisableDuplicateManuscript(formData);
      } else {
        this.showCancelledSwal();
      }
    });
  }




  private DisableDuplicateManuscript(formData: FormData) {
    this.journalWebApiService.UpdateManuscript(formData).subscribe((data: any) => {
      // alert(JSON.stringify(data))
      if (data.item1[0].msg === 'success') {
        Swal.fire(
          ' Action Applied !',
          '',
          'success'
        ).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire(
          'Action Failed !',
          '',
          'error'
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
