declare var bootstrap: any;
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import Swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin } from 'rxjs';

interface ManuscriptRecord {
  Id: number;
  JournalId: number;
  MenuScriptType: string;
  SubmissionType: string;
  FileUrl: string;
  EditorInchief: string;
  UserId: string;
  SubmitedBy: string;
  SubmissionDate: string;
  ManuscriptSubtitle: string;
  AssignedToReviewer: string;
  ManuscriptTitle: string;
  IsActive: number;
}

@Component({
  selector: 'app-EdsManageManuscript',
  templateUrl: './EdsManageManuscripts.component.html',
  standalone: false, styleUrls: ['./Eds-ManageManuscripts.component.scss']
})
export class EdsManageManuscriptsComponent implements OnInit {
  // --- Data & Utility Variables ---
  fromDate: any; booksDataColumns: any; toDate: any; pipe = new DatePipe('en-CA');
  dataSource: any[] = []; dataX: any; booksData: any; dataShowing: any = false;
  userRole: any; BookId: any; JournalId: any; JournalTitle: any = ''; name: any;
  userId: any; serverUrl: any; supervisorName: any; departmentName: any;
  candidateName: any;
  journalListsData: any[] = [];

  // --- Reviewer Selection Variables ---
  reviewerType: string = 'internal';
  internalReviewersList: any[] = [];
  externalReviewersList: any[] = [];
  tempExternalUser = { name: '', email: '', contact: '' };
  reviewerList: any[] = [];
  AssignedById: any; selectedReviewerId: any = ''; selectedJournalId: any;
  RecordId: any; SubmittedbyUserId: any; ManuscriptType: any; submissionType: any;

  // --- Grid State & Filtering ---
  manuscriptsList: ManuscriptRecord[] = [];
  isLoading: boolean = false;
  searchText: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  currentJournalId: any;
  currentJournalTitle: any;

  // --- Editor Data (Keeping these variables as they are used elsewhere in the component) ---
  EditorDataColumns: any;
  loadingTimeout: any[] = [];
  EditorData: any[] = [];
  currentPageEditor: number = 1;
  pageSizeEditor: number = 10;
  paginatedEditorData: any[] = [];
  totalPagesEditor: number = 1;

  displayedEditorColumns: string[] = [
    'manuscriptTitle',
    'journalTitle',
    'menuScriptType',
    'submissionType',
    'fileUrl',
    'editorInchief',
    'submitedBy',
    'submissionDate',
    'manuscriptSubtitle',
    'assignedToReviewer',

    //  'manuScript', 'editorInChief', 'emailId', 'submitedBy', 'submissionType', 'fileUrl', 'journalId'
  ];

  displayedEditorColumnHeaders: { [key: string]: string } = {
    manuscriptTitle: 'Manuscript Title',
    journalTitle: 'Journal ',
    menuScriptType: 'Manu Script',
    submissionType: 'Submission Type',
    fileUrl: ' File Download',
    editorInchief: 'Editor In Chief',
    submitedBy: 'Submitted By',
    submissionDate: 'Submission Date',
    manuscriptSubtitle: 'Manuscript Subtitle',
    assignedToReviewer: 'Assigned To Reviewer',

  };

  editForm: FormGroup;
  deleteForm: FormGroup;
  selectedRecord: ManuscriptRecord | null = null;
  updatedBy: string = '';
  dataLoaded: boolean = false;
  LoginStatus: boolean = false;


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
    this.editForm = this.fb.group({
      // REQUIRED FIELDS AS PER USER REQUEST
      MenuScriptType: ['', Validators.required],
      EditorInChief: ['', Validators.required],
      ManuscriptTitle: ['', Validators.required],
      AssignedToReviewer: ['']
    });

    this.deleteForm = this.fb.group({
      Remarks: ['', Validators.required]
    });
  }

  setUpdatedBy(): void {
    const authData = this.cookieService.get('authData');
    if (authData) {
      try {
        const user = JSON.parse(authData);
        this.updatedBy = user.EmailId || 'N/A';
      } catch (e) {
        this.updatedBy = 'UnknownUser';
      }
    }
  }

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
    this.searchText="";
    this.setUpdatedBy(); // Set the user context

    if (loginStatus == true) {
      this.loadJournals();
    } else {
      this.Logout();
    }
  }

  setJournalId() {
    let idx = this.journalListsData.find(
      journal => journal.id == this.JournalTitle
    );
    this.currentJournalId = idx.id;
    this.currentJournalTitle = idx.journalTitle;
    this.loadManuscripts(this.currentJournalId);
    this.loadReviewers(this.currentJournalId);
  }

  checkUserLogin(): Boolean | any {
    const GetCookieData = this.cookieService.get('authData');
    if (GetCookieData) {
      try {
        const retrievedCookies = JSON.parse(GetCookieData);
        this.userRole = retrievedCookies.UserRole?.length > 0 ? retrievedCookies.UserRole : -1;
        this.userId = retrievedCookies.EmailId;
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

  // --- READ Operation (Action: 'View') ---
  loadManuscripts(journalId: number): void {
    this.searchText="";
    this.isLoading = true;
    const formData = new FormData();
    formData.append('Action', 'View');
    formData.append('JournalId', journalId.toString());

    this.journalWebApiService.ManuscriptCrudOperations(formData).subscribe({
      next: (response: any) => {
        this.manuscriptsList = response.item1 || [];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching manuscripts:', error);
        this.manuscriptsList = [];
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load manuscript data.', 'error');
      }
    });
  }


  // --- Helper to construct FormData for CRUD operations ---
  private createCrudFormData(action: string, record: ManuscriptRecord, extraParams?: { [key: string]: string }): FormData {
    const formData = new FormData();
    formData.append('Action', action);
    formData.append('Id', record.Id.toString());
    formData.append('JournalId', record.JournalId.toString());

    // Base properties from the original record (will be overridden if present in extraParams)
    formData.append('JournalTitle', this.currentJournalTitle || '');
    // Note: Using 'MenuscriptType' for backend compatibility
    formData.append('MenuscriptType', record.MenuScriptType || '');
    formData.append('SubmissionType', record.SubmissionType || '');
    formData.append('EditorInChief', record.EditorInchief || '');
    formData.append('UserId', record.UserId || '');
    formData.append('ManuscriptTitle', record.ManuscriptTitle || '');

    formData.append('UpdatedBy', this.updatedBy || 'N/A');
    formData.append('LoginName', this.updatedBy || 'N/A');

    if (extraParams) {
      Object.keys(extraParams).forEach(key => {
        if (extraParams[key] !== null) {
          formData.append(key, extraParams[key]);
        }
      });
    }
    return formData;
  }

  // --- UPDATE Operation (Action: 'Update') ---
  onUpdate(): void {
    if (this.editForm.invalid || !this.selectedRecord) { return; }

    const formValues = this.editForm.value;

    // Pass ALL editable fields to override the values from selectedRecord
    const formData = this.createCrudFormData('Update', this.selectedRecord, {
      ManuscriptTitle: formValues.ManuscriptTitle,
      AssignedToReviewer: formValues.AssignedToReviewer,
      // Map form key (MenuScriptType) to backend key (MenuscriptType)
      MenuscriptType: formValues.MenuScriptType,
      EditorInChief: formValues.EditorInChief,
    });

    this.journalWebApiService.ManuscriptCrudOperations(formData).subscribe({
      next: (response: any) => {
        if (response.item1 && response.item1[0].Msg === 'success') {
          Swal.fire('Updated!', 'Manuscript details updated successfully.', 'success');
          this.loadManuscripts(this.currentJournalId);
        } else {
          Swal.fire('Failed', response.item1[0].Msg || 'Update failed.', 'error');
        }
      },
      error: (error) => {
        Swal.fire('Error', 'An error occurred during update.', 'error');
      }
    }).add(() => {
      bootstrap.Modal.getInstance(document.getElementById('editManuscriptModal'))?.hide();
    });
  }

  // --- DELETE Operation (Action: 'Delete' / Disapprove) ---
  onDelete(): void {
    if (this.deleteForm.invalid || !this.selectedRecord) { return; }

    const remarks = this.deleteForm.value.Remarks;
    const formData = this.createCrudFormData('Delete', this.selectedRecord, { Remarks: remarks });

    this.journalWebApiService.ManuscriptCrudOperations(formData).subscribe({
      next: (response: any) => {
        if (response.item1 && response.item1[0].Msg === 'Success') {
          Swal.fire('Disapproved!', 'Manuscript soft-deleted/disapproved successfully.', 'success');
          this.loadManuscripts(this.currentJournalId);
        } else {
          Swal.fire('Failed', response.item1[0].Msg || 'Delete failed.', 'error');
        }
      },
      error: (error) => {
        Swal.fire('Error', 'An error occurred during deletion.', 'error');
      }
    }).add(() => {
      bootstrap.Modal.getInstance(document.getElementById('deleteManuscriptModal'))?.hide();
    });
  }

  // --- Modal Handlers ---
  openEditModal(record: ManuscriptRecord): void {
    this.selectedRecord = record;
    // CRITICAL: Patch all four editable fields
    this.editForm.patchValue({
      ManuscriptTitle: record.ManuscriptTitle,
      AssignedToReviewer: record.AssignedToReviewer || '',
      MenuScriptType: record.MenuScriptType, // NEW
      EditorInChief: record.EditorInchief // NEW
    });

    const modalElement = document.getElementById('editManuscriptModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  }
  openDeleteModal(record: ManuscriptRecord): void {
    this.selectedRecord = record;
    this.deleteForm.reset();

    const modalElement = document.getElementById('deleteManuscriptModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  }
 

  get filteredManuscripts(): ManuscriptRecord[] {
 
    const filterText = this.searchText.toLowerCase().trim(); 
    if (filterText.length <= 4) {
      return this.manuscriptsList; 
    } 
    return this.manuscriptsList.filter(manuscript => {      
      return Object.values(manuscript).some(value => {        
        if (value !== null && value !== undefined) {
          return String(value).toLowerCase().includes(filterText);
        }
        return false; 
      });
    });
  }

  paginatedManuscripts(): ManuscriptRecord[] {
    const start = (this.pageNumber - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredManuscripts.slice(start, end);
  }

  totalPages(): number {
    return Math.ceil(this.filteredManuscripts.length / this.pageSize);
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages()) {
      this.pageNumber++;
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
    }
  }

  onDownloadFile(fileUrl: string): void {
    if (fileUrl) {
      window.open('https://files.lpu.in/umsweb/Journal/' + fileUrl, '_blank');
    }
  }

  // --- Reviewer-Related Methods (Kept for component functionality) ---
  onTakeAction(rowData: any) {
    this.selectedJournalId = rowData['journalId'];
    this.AssignedById = rowData['emailId'];
    this.RecordId = rowData['id'];
    this.ManuscriptType = rowData['manuScript'];
    this.submissionType = rowData['submissionType'];

    // Reset Modal Data
    this.reviewerType = 'internal';
    this.selectedReviewerId = '';
    this.internalReviewersList = [];
    this.externalReviewersList = [];
    this.tempExternalUser = { name: '', email: '', contact: '' };
  }

  addInternalReviewer() {
    if (!this.selectedReviewerId) return;

    if (this.internalReviewersList.length >= 3) {
      Swal.fire('Limit Reached', 'You can assign at most 3 reviewers.', 'warning');
      return;
    }

    const reviewer = this.reviewerList.find(r => r.emailId === this.selectedReviewerId);
    if (reviewer) {
      if (this.internalReviewersList.some(r => r.emailId === reviewer.emailId)) {
        Swal.fire('Duplicate', 'This reviewer is already selected.', 'warning');
        return;
      }
      this.internalReviewersList.push(reviewer);
      this.selectedReviewerId = '';
    }
  }


  removeInternalReviewer(index: number) {
    this.internalReviewersList.splice(index, 1);
  }


  // --- Logic for External Reviewers ---
  addExternalReviewer() {
    if (!this.tempExternalUser.name || !this.tempExternalUser.email || !this.tempExternalUser.contact) {
      Swal.fire('Missing Data', 'Please fill all external user fields.', 'warning');
      return;
    }

    if (this.externalReviewersList.length >= 3) {
      Swal.fire('Limit Reached', 'You can assign at most 3 reviewers.', 'warning');
      return;
    }

    if (this.externalReviewersList.some(r => r.email === this.tempExternalUser.email)) {
      Swal.fire('Duplicate', 'This email is already added.', 'warning');
      return;
    }

    this.externalReviewersList.push({ ...this.tempExternalUser });
    this.tempExternalUser = { name: '', email: '', contact: '' };
  }


  removeExternalReviewer(index: number) {
    this.externalReviewersList.splice(index, 1);
  }


  assignReviewer() {
    // 1. INTERNAL USER FLOW
    if (this.reviewerType === 'internal') {
      if (this.internalReviewersList.length === 0) {
        Swal.fire('No Reviewer', 'Please add at least one internal reviewer.', 'warning');
        return;
      }

      const finalAssignedTo = this.internalReviewersList.map(r => r.emailId).join(',');

      const formData = new FormData();
      formData.append('JournalId', this.selectedJournalId);
      formData.append('MultipleAssignedTo', finalAssignedTo);
      formData.append('SubmittedBy', this.AssignedById);
      formData.append('RecordId', this.RecordId);
      formData.append('JournalTitle', this.currentJournalTitle);
      formData.append('Manuscript', this.ManuscriptType);
      formData.append('SubmissionType', this.submissionType);

      this.journalWebApiService.AssignNewReviewerForJournal(formData).subscribe({
        next: (data) => {
          let result = data.item1[0]['returnData'];
          if (result === 'success') {
            Swal.fire({
              title: 'Reviewer Assigned',
              text: data.item1[0]['msg'],
              icon: 'success',
            }).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire('Technical Issue', result, 'error');
          }
        },
        error: (err) => {
          Swal.fire('Error', 'Unable to complete the request.', 'error');
        }
      });
    }

    else if (this.reviewerType === 'external') {
      if (this.externalReviewersList.length === 0) {
        Swal.fire('No Reviewer', 'Please add at least one external reviewer.', 'warning');
        return;
      }

      // Create an array of Observables
      const requests = this.externalReviewersList.map((ext, index) => {
        const formData = new FormData();
        formData.append('JournalId', this.selectedJournalId);
        formData.append('CandidateName', ext.name);
        formData.append('UserEmail', ext.email);
        formData.append('MobileNumber', ext.contact);
        formData.append('RecordId', this.RecordId);
        formData.append('JournalTitle', this.currentJournalTitle);
        formData.append('Manuscript', this.ManuscriptType);
        formData.append('SubmissionType', this.submissionType);
        formData.append('AuthorEmailId', this.AssignedById);

        return this.journalWebApiService.AssignExternalReviewerForJournal(formData);
      });

      forkJoin(requests).subscribe({
        next: (responses: any[]) => {
          const allSuccess = responses.every(res => res.item1 && res.item1[0]['returnData'] === 'success');

          if (allSuccess) {
            Swal.fire({
              title: 'External Reviewers Assigned',
              text: 'All external reviewers have been assigned successfully.',
              icon: 'success',
            }).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire('Partial Success', 'Some reviewers may not have been assigned. Please check console logs.', 'warning')
              .then(() => window.location.reload());
          }
        },
        error: (err) => {
          Swal.fire('Error', 'Failed to assign external reviewers.', 'error');
        }
      });
    }

    // Close modal
    let modal = bootstrap.Modal.getInstance(document.getElementById('assignReviewerModal'));
    modal.hide();
  }



  loadReviewers(id: any) {
    this.journalWebApiService.GetReviewerDetailsForEditors(id).subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.reviewerList = dataX.item1;
      },
      error: (error: any) => {
        this.dataShowing = false;
        console.error('Error fetching data', error);
      },
      complete: () => {
        this.dataShowing = true;
      }
    });
  }

  loadJournals() {
    this.journalWebApiService.GetAllBooksDetails().subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.journalListsData = dataX.item1;
      },
      error: (error: any) => {
        this.dataShowing = false;
        console.error('Error fetching data', error);
      },
      complete: () => {
        this.dataShowing = true;
      }
    });
  }


}
