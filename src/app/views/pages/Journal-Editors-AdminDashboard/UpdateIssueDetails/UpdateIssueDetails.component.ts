import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
 import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { StorageService } from 'src/app/_services/storage.service';
// import * as bootstrap from 'bootstrap'; // Import bootstrap for modal manipulation
declare var bootstrap: any;
// Interface for the Issue Data for better type safety
interface JournalIssue {
    id: number;
    issueId: number;
    volume: string;
    issueTitle: string;
    authorName: string; // The comma-separated string from the backend
    pageNumber: string;
    publishDate: string; // Assuming the date is a string
    issueDescription: string;
    issueFileName: string;
    [key: string]: any;
    // Add other fields from your data structure if necessary
}

@Component({
    selector: 'app-UpdateIssueDetails',
    templateUrl: './UpdateIssueDetails.html',
    styleUrls: ['./UpdateIssueDetails.scss']
})
export class UpdateIssueDetailsComponent implements OnInit {
    dataSource: any[] = [];
    journalListsData: any[] = [];
    JournalIssuesData: JournalIssue[] = []; // Using the interface for better data structure
    paginatedJournalIssuesData: JournalIssue[] = [];
    currentPageEditor: number = 1;
    pageSizeEditor: number = 10;
    totalPagesEditor: number = 1;
    JournalTitle: any = '';
    isLoadingPage: boolean = true;
    isLoadingJournal: boolean = false;
    serverUrl: any;
    // ... other properties ...

    // --- New Properties for Editing ---
    selectedIssueData: JournalIssue | null = null;
    IssueIdToUpdate: number | null = null;
    authorInput: string = '';
    authors: string[] = []; // Array of authors for the badge system
    showBadge: boolean = false;
    isUpdateFormSubmitted: boolean = false;

    // Renamed to be more specific for update/edit
    editIssueForm!: FormGroup;

    // Your existing columns
    displayedEditorColumns: string[] = [
        'volume',
        'issueTitle',
        'authorName',
        'pageNumber',
        'issueFileName', // Added file name for clarity/reusability
        'Action' // Replaced 'id' with 'Action' as it holds the button
    ];

    displayedEditorColumnHeaders: { [key: string]: string } = {
        volume: 'Journal Volume',
        issueTitle: 'Issue Title',
        authorName: 'Author Name',
        pageNumber: 'Page Number',
        issueFileName: 'Issue File',
        Action: 'Action'
    };
    // ... existing constructor ...
    constructor(
        private router: Router, private fb: FormBuilder,
        private cookieService: CookieService,
        private journalWebApiService: LpujournalbookService,  
        private AuthSession: LoginSessionService, 
        private StoragesServices: StorageService,
    ) { }

    ngOnInit(): void {
       this.serverUrl = 'https://files.lpu.in/umsweb/Journal/';
        if (this.getUserDetails()) {
            this.loadJournals();
            this.LoadEditForm(); // Renamed and adjusted form init
        } else {
            Swal.fire('Invalid Login Details !', '', 'error').then(() => this.Logout());
        }
    }

    // Renamed and adjusted LoadForm for editing
    LoadEditForm() {
        // IssueId is not included in the form group as it's set on selection
        this.editIssueForm = this.fb.group({
            IssueDescription: ['', Validators.required],
            PublishDate: ['', Validators.required],
            IssueTitle: ['', Validators.required],
            PageNumber: ['', Validators.required],
           
        });
    }

    // Getter for the edit form controls
    get editFormControls() {
        return this.editIssueForm.controls;
    }

    // --- Core Fixes: Issue #1 - Edit Button & Pre-fetch ---

    onEditIssue(rowData: JournalIssue): void {
        this.isLoading = false;
        this.selectedIssueData = rowData;
        this.IssueIdToUpdate = rowData.issueId;
        console.log(JSON.stringify(rowData))

        // 1. Pre-fill Authors (comma-separated string to array)
        this.authors = rowData.authorName ? rowData.authorName.split(',').map(a => a.trim()).filter(a => a.length > 0) : [];

        // 2. Pre-fill other form fields
        this.editIssueForm.patchValue({
            IssueDescription: rowData.issueDescription,
            // Format date for date input field (assuming date is in a compatible format like 'YYYY-MM-DD')
            PublishDate: this.formatDate(rowData.publishDate),
            IssueTitle: rowData.issueTitle,
            PageNumber: rowData.pageNumber,
        });

        // 3. Reset file selection state
        this.IssueFileData = null;
        this.IssueFileName = '';
        this.isUpdateFormSubmitted = false;

        // Manually open the modal if not using data-bs-target in the button
        // const modalElement = document.getElementById('UpdateIssueDetailsModal');
        // if (modalElement) {
        //     const modal = new bootstrap.Modal(modalElement);
        //     modal.show();
        // }
    }

    // Helper function to format date for input[type="date"]
    private formatDate(date: string): string {
        if (!date) return '';
        try {
            // Attempt to parse and format the date as 'YYYY-MM-DD'
            const d = new Date(date);
            const month = '' + (d.getMonth() + 1);
            const day = '' + d.getDate();
            const year = d.getFullYear();

            return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
        } catch (e) {
            console.error('Error formatting date:', e);
            return date; // Return original if parsing fails
        }
    }

    // --- Core Fixes: Issue #2 - Update Details Logic ---
 isLoading: boolean = true;   
    onUpdateDetails(): void {
        this.isUpdateFormSubmitted = true;
        if (this.editIssueForm.invalid || !this.authors.length) {
            Swal.fire('Validation Error', 'Please check the form fields and ensure at least one author is added.', 'error');
            return;
        }

        if (!this.IssueIdToUpdate) {
             Swal.fire('Error', 'Issue ID not found for update.', 'error');
            return;
        }

        this.isLoading = true;
        const minLoadingTime = 2500;
        const startTime = Date.now();
        const formData = new FormData();
        const formValue = this.editIssueForm.value;

        // Append all necessary fields
        formData.append('IssueId', this.IssueIdToUpdate.toString()); // ID is crucial for update
        formData.append('AuthorName', this.authors.join(', '));
        formData.append('PageNumber', formValue.PageNumber);
        formData.append('PublishDate', formValue.PublishDate);
        formData.append('IssueTitle', formValue.IssueTitle);
        formData.append('IssueDescription', formValue.IssueDescription);
        formData.append('UpdatedBy', this.user_Email); // Assuming you want to track who updated it

        // Only append file data if a new file has been selected (IssueFileData will be non-null/non-empty)
        if (this.IssueFileData && this.IssueFileName) {
            formData.append('IssueFileName', this.IssueFileName);
            formData.append('IssueFileData', this.IssueFileData);
        } 
        else {
            // If no new file, send the existing file name for the backend to know it's not changing
            formData.append('IssueFileName', '');
            formData.append('IssueFileData', '');
        }

        console.log('Submitting Update Form Data:');
        formData.forEach((value, key) => console.log(key + ':', value));

        // Assuming you have an Update API service method
        this.journalWebApiService.UpdateIssueDetails(formData) // Replace with your actual service method
            .pipe(
                finalize(() => {
                    const elapsed = Date.now() - startTime;
                    const remaining = Math.max(minLoadingTime - elapsed, 0);
                    setTimeout(() => {
                        this.isLoading = false;
                        // Close modal after operation
                        const modalElement = document.getElementById('UpdateIssueDetailsModal');
                        if (modalElement) {
                             (bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement)).hide();
                        }
                    }, remaining);
                })
            )
            .subscribe({
                next: (data) => {
                    let errorCode = data.item1[0]['id'];
                    console.log(JSON.stringify(errorCode))
                    if (errorCode > 0) {
                        Swal.fire({ title: 'Issue updated successfully!', icon: 'success' }).then(() => this.setJournalId()); // Reload issues for current journal
                    } else if (errorCode == -1) {
                        Swal.fire({ title: 'Issue not found or validation error', icon: 'error' });
                    } else {
                        Swal.fire({ title: 'Some Technical Issue', text: 'Update failed.', icon: 'error' });
                    }
                },
                error: () => {
                    Swal.fire({ title: 'Error Occurred', text: 'Unable to complete the request. Please try again later.', icon: 'error' });
                }
            });
    }

    // Author/Badge Logic (Kept mostly as is, just ensuring it's used in the new context)

    handleAuthorKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();

            const value = this.authorInput.trim();

            if (value) {
                const splitAuthors = value.split(',').map(a => a.trim()).filter(a => a);
                this.authors.push(...splitAuthors);
                this.authors = [...new Set(this.authors)]; // Remove duplicates
            }

            this.authorInput = '';
        }
    }

    removeAuthor(index: number): void {
        this.authors.splice(index, 1);
    }

    // onFileSelectedIssueFile - Keep this as is for file selection
    IssueFileData: any = null;
    IssueFileName: any = '';

    onFileSelectedIssueFile(event: any): void {
        // ... (Your existing file selection logic) ...
        const reader = new FileReader();
        const target = event.target as HTMLInputElement;
        const file: File | null = (target.files as FileList)[0] || null;

        if (!file) {
            this.IssueFileName = '';
            this.IssueFileData = null;
            return;
        }

        if (file.size > 3148576) {
            Swal.fire({ title: 'File size exceeds 3MB. Please upload a smaller file.', text: 'Invalid File size', icon: 'warning' });
            target.value = '';
            this.IssueFileName = '';
            this.IssueFileData = null;
            return;
        }

        // Simplified file name sanitization for brevity
        const validFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

        this.IssueFileName = validFileName;
        // The issue file data is only sent if a file is selected, otherwise null.

        reader.readAsDataURL(file);
        reader.onload = () => {
            const ssss = reader.result as string;
            // Assuming base64 data is needed
            this.IssueFileData = ssss.split(',')[1];
        };
    }

    // Removed the original 'onSubmit()' method since it was for 'AddNewIssuesDetails'
    // and replaced it with 'onUpdateDetails()' for editing.

    // ... (rest of your existing methods like loadJournals, setJournalId, GetAllIssues, pagination, getUserDetails, Logout, etc., remain unchanged) ...

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
            this.isLoadingJournal = true;
            this.currentPageEditor = 1; 
            this.GetAllIssues(selectedJournal.id);
        }
    }

 
    GetAllIssues(JournalId: any) {
        this.journalWebApiService.GetJournalIssues(JournalId).subscribe({
            next: (dataX: any) => {
                this.JournalIssuesData = dataX.item1 || [];
                 console.log("IssueData"+JSON.stringify(this.JournalIssuesData))
                this.calculateTotalPagesEditor();
                this.updatePaginatedDataEditor();
                this.delayHideLoader('journal');
            },
            error: (error: any) => {
                console.error('Error fetching journal issues', error);
                this.delayHideLoader('journal');
            }
        });
    }

    delayHideLoader(loaderType: 'page' | 'journal') {
        const delay = 500;
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

    UserRole: any; user_Email: any; candidateName: any;

    getUserDetails(): boolean {
        // ... (Your existing logic) ...
        const GetCookieData = this.cookieService.get('authData');
        const status = this.StoragesServices.isLoggedIn();

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

    // Assuming onTakeAction was intended for an assignment action, but for editing,
    // we now use onEditIssue, which also has a more descriptive name.
    // If you need to keep onTakeAction for other functionalities, you can retain it.
    // I'll keep the required properties and remove the old onTakeAction as it seems incomplete/redundant for edit logic.
    // selectedEventId: any; AssignedById: any; RecordId: any; currentJournalTitle: any; Reason: any;

    Logout(): void {
        // ... (Your existing logic) ...
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
            setTimeout(() => { location.reload(); }, 500);
        });
    }

    // Removed the unused 'validateAuthor'
    // Removed the unused 'onFileSelected'
    // Removed the unused 'DisapproveStatus' and related methods if they are not part of the issue update workflow.
}

// import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
// import { Validators } from '@angular/forms';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import Swal from 'sweetalert2';
// import swal from 'sweetalert2';
// import { finalize } from 'rxjs'
// import { Router } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';
// import { LoginSessionService } from 'src/app/_services/login-session.service';
// import { StorageService } from 'src/app/_services/storage.service';


// @Component({
//     selector: 'app-UpdateIssueDetails',
//     templateUrl: './UpdateIssueDetails.html',
//     styleUrls: ['./UpdateIssueDetails.scss']
// })
// export class UpdateIssueDetailsComponent implements OnInit {
//     dataSource: any[] = [];
//     journalListsData: any[] = [];
//     JournalIssuesData: any[] = [];
//     paginatedJournalIssuesData: any[] = [];
//     currentPageEditor: number = 1;
//     pageSizeEditor: number = 10;
//     totalPagesEditor: number = 1;
//     JournalTitle: any = '';
//     isLoadingPage: boolean = true;            // For initial page load
//     isLoadingJournal: boolean = false;       // For journal selection load
//     serverUrl: any;
//     displayedEditorColumns: string[] = [
//         'volume',
//         'issueTitle',
//         'authorName',
//         'pageNumber',
//         'Action',
//         'id'
//     ];

//     displayedEditorColumnHeaders: { [key: string]: string } = {
//         volume: 'Journal Volume',
//         issueTitle: 'Issue Title',
//         authorName: 'Author Name',
//         pageNumber: 'Page Number',
//         Action: 'Action',
//         id: 'Issue Id'
//     };

//     constructor(
//         private router: Router, private fb: FormBuilder,
//         private cookieService: CookieService,
//         private journalWebApiService: LpujournalbookService,
//         private AuthSession: LoginSessionService,
//         private StoragesServices: StorageService,
//     ) { }

//     ngOnInit(): void {
//         this.serverUrl = 'https://files.lpu.in/umsweb/Journal/';
//         // this.serverUrl = 'http://172.19.2.52/umsweb/webftp/Journal/';
//         if (this.getUserDetails())
//             {this.loadJournals();
//         this.LoadForm();}
//         else {
//             Swal.fire(
//                 'Invalid Login Details !',
//                 '',
//                 'error'
//             )
//             this.Logout();
//         }
//     }

//     loadJournals() {
//         this.isLoadingPage = true;
//         this.journalWebApiService.GetAllBooksDetails().subscribe({
//             next: (dataX: any) => {
//                 this.journalListsData = dataX.item1;
//                 this.delayHideLoader('page');
//             },
//             error: (error: any) => {
//                 console.error('Error fetching journals', error);
//                 this.delayHideLoader('page');
//             }
//         });
//     }

//     setJournalId() {
//         const selectedJournal = this.journalListsData.find(journal => journal.id == this.JournalTitle);
//         if (selectedJournal) {
//             this.isLoadingJournal = true;  // Show loader when journal is selected
//             this.GetAllIssues(selectedJournal.id);
//         }
//     }

//     GetAllIssues(JournalId: any) {
//         this.journalWebApiService.GetJournalIssues(JournalId).subscribe({
//             next: (dataX: any) => {
//                 this.JournalIssuesData = dataX.item1 || [];
//                 // console.log(JSON.stringify(this.JournalIssuesData))
//                 this.calculateTotalPagesEditor();
//                 this.updatePaginatedDataEditor();
//                 this.delayHideLoader('journal');  // Delay hiding the journal loader
//             },
//             error: (error: any) => {
//                 console.error('Error fetching journal issues', error);
//                 this.delayHideLoader('journal');  // Delay hiding the journal loader if error occurs
//             }
//         });
//     }

//     delayHideLoader(loaderType: 'page' | 'journal') {
//         const delay = 500; // Delay in milliseconds
//         setTimeout(() => {
//             if (loaderType === 'page') {
//                 this.isLoadingPage = false;
//             } else if (loaderType === 'journal') {
//                 this.isLoadingJournal = false;
//             }
//         }, delay);
//     }

//     calculateTotalPagesEditor() {
//         this.totalPagesEditor = Math.ceil(this.JournalIssuesData.length / this.pageSizeEditor) || 1;
//     }

//     updatePaginatedDataEditor() {
//         const startIndex = (this.currentPageEditor - 1) * this.pageSizeEditor;
//         const endIndex = Math.min(startIndex + this.pageSizeEditor, this.JournalIssuesData.length);
//         this.paginatedJournalIssuesData = this.JournalIssuesData.slice(startIndex, endIndex);
//     }

//     nextPageEditor() {
//         if (this.currentPageEditor < this.totalPagesEditor) {
//             this.currentPageEditor++;
//             this.updatePaginatedDataEditor();
//         }
//     }

//     previousPageEditor() {
//         if (this.currentPageEditor > 1) {
//             this.currentPageEditor--;
//             this.updatePaginatedDataEditor();
//         }
//     }

//     onSelectFileEditorX(fileUrl: string) {
//         window.open(this.serverUrl + fileUrl, '_blank');
//     }
//     // aded on 5-sep-25



//     UserRole: any; user_Email: any; candidateName: any;

//     getUserDetails(): boolean {
//         const GetCookieData = this.cookieService.get('authData');
//         const status = this.StoragesServices.isLoggedIn();

//         // console.log('Cookie:', GetCookieData, 'Session status:', status);

//         if (GetCookieData && status) {
//             try {
//                 const retrievedCookies = JSON.parse(GetCookieData);

//                 this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
//                 this.user_Email = retrievedCookies.EmailId || '';
//                 this.candidateName = retrievedCookies.CandidateName || '';

//                 return true;
//             } catch (err) {
//                 console.error('Invalid cookie data:', err);
//                 return false;
//             }
//         }

//         return false;
//     }


//     selectedEventId: any; AssignedById: any; RecordId: any; currentJournalTitle: any;
//     Reason: any;

//     DisapproveStatus(rowData: any) {
//         Swal.fire({
//             title: "Reason for Rejection",
//             // text: "Disapproval reason",
//             input: 'text',
//             showCancelButton: true
//         }).then((result) => {
//             if (result.value) {
//                 this.Reason = result.value;
//                 const formData = new FormData();
//                 formData.append('RecordId', rowData.id);
//                 formData.append('DisapprovalReason', this.Reason);
//                 formData.append('UpdatedBy', this.user_Email);
//                 this.handleStatusChange(formData);
//             } else {
//                 this.showCancelledSwal();
//             }
//         });
//     }
//     private handleStatusChange(formData: FormData) {
//         this.journalWebApiService.DisableIssue(formData).subscribe((data: any) => {
//             if (data.responseData === 'Cancel') {
//                 Swal.fire(
//                     'No Change!',
//                     ' ',
//                     'error'
//                 );
//             } else {
//                 Swal.fire(
//                     'Rejected successfully !',
//                     '',
//                     'success'
//                 ).then(() => {
//                     window.location.reload();
//                 });
//             }
//         });
//     }

//     private showCancelledSwal() {
//         Swal.fire(
//             'Cancelled',
//             ' ',
//             'error'
//         );
//     }


//     Logout(): void {
//         this.cookieService.delete('authData');
//         this.cookieService.delete('BookData');
//         this.cookieService.deleteAll();

//         sessionStorage.clear();
//         localStorage.clear();

//         this.AuthSession.clearSession();
//         this.StoragesServices.clean?.();

//         this.UserRole = '';
//         this.user_Email = '';
//         this.candidateName = '';

//         this.router.navigateByUrl('Home').then(() => {
//             setTimeout(() => {
//                 location.reload();
//             }, 500);
//         });
//     }

//     journalForm!: FormGroup;
//     JournalIdString: any
//     selectedFile: File | null = null;
//     dataX: any; booksData: any; dataShowing: any = false;
//     userRole: any; BookId: any; JournalId: any; name: any;
//     userId: any; supervisorName: any; departmentName: any;

//     Journals: any;
//     LoginStatus: boolean | undefined;
//     LoadForm() {
//         this.journalForm = this.fb.group({
//             IssueDescription: ['', Validators.required],
//             PublishDate: ['', Validators.required],
//             IssueTitle: ['', Validators.required],
//             PageNumber: ['', Validators.required],
//         });
//     }


//     isForm1Submitted: boolean = false; isSubmitted = false;

//     get form1() {
//         return this.journalForm.controls;
//     }




//     validateAuthor: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
//         const value = control.value;
//         if (!value || value.trim() === '') {
//             return { authorRequired: true }; // invalid
//         }
//         // For example, validate that the authors are comma separated non-empty names
//         const authors = value.split(',').map((a: string) => a.trim());
//         const allValid = authors.every((a: string) => a.length > 0);
//         return allValid ? null : { invalidAuthorFormat: true };
//     };


//     onFileSelected(event: any): void {
//         this.selectedFile = event.target.files[0] || null;
//     }


//     IssueFileData: any = ''; IssueFileStatus: boolean = false;
//     IssueFileName: any = '';
//     onFileSelectedIssueFile(event: any): void {
//         const reader = new FileReader();
//         const target = event.target as HTMLInputElement;
//         const file: File | null = (target.files as FileList)[0] || null;
//         if (file && file.size > 3148576) {
//             Swal.fire({
//                 title: 'File size exceeds 3MB. Please upload a smaller file.',
//                 text: 'Invalid File size',
//                 icon: 'warning'
//             });
//             target.value = '';
//             return;
//         }
//         const fileNameRegex = /^[a-zA-Z0-9._-]+$/;
//         if (file && !fileNameRegex.test(file.name)) {
//             const validFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

//             const modifiedFile = new File([file], validFileName, { type: file.type });
//             const dataTransfer = new DataTransfer();
//             dataTransfer.items.add(modifiedFile);
//             target.files = dataTransfer.files;

//             this.IssueFileData = modifiedFile;
//             this.IssueFileStatus = true;

//             reader.readAsDataURL(modifiedFile);
//             reader.onload = () => {
//                 const ssss = reader.result as string;
//                 const ssssArray = ssss.split(',');
//                 this.IssueFileData = ssssArray[1];
//                 this.IssueFileName = validFileName;
//             };

//             return;
//         }

//         this.IssueFileData = file;
//         this.IssueFileStatus = true;
//         // alert(10);  
//         if (file) {
//             reader.readAsDataURL(file);
//             reader.onload = () => {
//                 const ssss = reader.result as string;
//                 const ssssArray = ssss.split(',');
//                 this.IssueFileData = ssssArray[1];
//                 this.IssueFileName = file.name;
//             };
//         }
//         else {
//             this.IssueFileName = ''; // Reset if no file is selected
//             this.IssueFileData = null;
//         }
//     }

//     isLoading: boolean = false;
//     AuthorName: any;
//     PageNumber: any;



//     onSubmit(): void {
//         if (this.journalForm.invalid) return;
//         this.isLoading = true;
//         const minLoadingTime = 2500; // 2.5 seconds
//         const startTime = Date.now();
//         const formData = new FormData();
//         const formValue = this.journalForm.value;

//         // this.AuthorName: 
//         // for (const key in formValue) {
//         //   if (formValue.hasOwnProperty(key)) {
//         //     formData.append(key, formValue[key]);
//         //   }
//         // }

//         formData.append('AuthorName', this.authors.join(', '));
//         formData.append('PageNumber', formValue.PageNumber);
//         formData.append('PublishDate', formValue.PublishDate);
//         formData.append('IssueTitle', formValue.IssueTitle);
//         formData.append('IssueFileName', this.IssueFileName);
//         formData.append('IssueFileData', this.IssueFileData);
//         formData.append('IssueDescription', formValue.IssueDescription);

//         console.log('Submitting Form Data:');
//         formData.forEach((value, key) => {
//             console.log(key + ':', value);
//         });

//         this.journalWebApiService.AddNewIssuesDetails(formData)
//             .pipe(
//                 finalize(() => {
//                     const elapsed = Date.now() - startTime;
//                     const remaining = Math.max(minLoadingTime - elapsed, 0);
//                     setTimeout(() => {
//                         this.isLoading = false;
//                     }, remaining);
//                 })
//             )
//             .subscribe({
//                 next: (data) => {
//                     // let result = data.item1[0]['returnData'];
//                     let errorCode = data.item1[0]['returnData'];

//                     if (errorCode > 0) {
//                         Swal.fire({
//                             title: 'Issues are uploaded successfully ',
//                             text: "",
//                             icon: 'success',
//                         }).then(() => {
//                             window.location.reload();
//                         });
//                     } else if (errorCode == -1) {
//                         Swal.fire({ title: 'Max issues are already uploaded', icon: 'error' }).then(() => {
//                             window.location.reload();
//                         });
//                     } else {
//                         Swal.fire({ title: 'Some Technical Issue', text: "", icon: 'error' }).then(() => {
//                             window.location.reload();
//                         });
//                     }
//                 },
//                 error: () => {
//                     Swal.fire({
//                         title: 'Error Occurred',
//                         text: 'Unable to complete the request. Please try again later.',
//                         icon: 'error',
//                     });
//                 }
//             });

//     }



//     authorInput: string = '';
//     authors: string[] = [];
//     showBadge: boolean = false;

//     handleAuthorKeyDown(event: KeyboardEvent): void {
//         if (event.key === 'Enter' || event.key === ',') {
//             event.preventDefault();

//             const value = this.authorInput.trim();

//             if (value) {
//                 const splitAuthors = value.split(',').map(a => a.trim()).filter(a => a);
//                 this.authors.push(...splitAuthors);
//                 this.authors = [...new Set(this.authors)]; // Remove duplicates
//             }

//             this.authorInput = '';
//         }
//     }

//     removeAuthor(index: number): void {
//         this.authors.splice(index, 1);
//     }



// IssueId: any;
//   onTakeAction(rowData: any) {
//     console.log(JSON.stringify(rowData))
//     this.IssueId = rowData['journalId'];
//     this.AssignedById = rowData['emailId'];
//     this.RecordId = rowData['id'];
    
//   }


// }




