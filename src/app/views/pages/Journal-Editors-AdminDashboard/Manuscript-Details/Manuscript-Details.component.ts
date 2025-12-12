declare var bootstrap: any;
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { Router } from '@angular/router';
import { StorageService } from 'src/app/_services/storage.service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import Swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

// --- INTERFACES FOR TYPE SAFETY ---
interface Reviewer {
    emailId: string;
    candidateName: string;
    userType: string;
    mobileNumber?: string;
}

interface ExternalReviewer {
    name: string;
    email: string;
    contact: string;
}

interface Manuscript {
    id: number;
    journalId: number;
    journalTitle: string;
    manuScript: string;
    submissionType: string;
    emailId: string; // SubmittedBy ID (Author/Editor)
    reviewerAssigned?: string | null; // Added for explicit type safety
    [key: string]: any;
}




// NEW DYNAMIC COLUMN INTERFACE
interface TableColumn {
    key: keyof Manuscript | 'reviewerStatus' | 'action';
    header: string;
    type: 'data' | 'file' | 'status' | 'action';
    isSortable?: boolean;
}
// ------------------------------------

@Component({
    selector: 'app-Manuscript-Details',
    templateUrl: './Manuscript-Details.component.html',
    styleUrls: ['./Manuscript-Details.component.scss']
})
export class ManuscriptDetailsComponent implements OnInit, OnDestroy { 
    // --- CONSTANTS ---
    readonly MAX_INTERNAL_REVIEWERS = 3;
    readonly MAX_EXTERNAL_REVIEWERS = 2; 
    readonly SERVER_URL = 'https://files.lpu.in/umsweb/Journal/';

    // --- Component State Variables ---
    dataShowing: boolean = false;
    dataLoaded: boolean = false;
    isLoading: boolean = false;
    
    // Journal Selection
    journalListsData: any[] = [];
    JournalTitle: any= ''; 
    currentJournalId: any ;
    currentJournalTitle: string = '';

    // Manuscript Data Grid
    EditorData: Manuscript[] = [];
    currentPageEditor: number = 1;
    pageSizeEditor: number = 10;
    paginatedEditorData: Manuscript[] = [];
    totalPagesEditor: number = 1;

    // Reviewer Assignment Modal State
    reviewerType: 'internal' | 'external' = 'internal'; 
    
    // All available reviewers (Fetched from API)
    reviewerList: Reviewer[] = [];
    internalReviewerList: Reviewer[] = [];
    externalReviewerList: Reviewer[] = []; 
    
    // Selected Reviewers for Assignment
    selectedReviewerId: string = ''; 
    internalReviewersList: Reviewer[] = [];
    externalReviewersList: ExternalReviewer[] = []; // Only holds existing external users selected

    // New External Reviewer Form State
    showNewExternalReviewerForm: boolean = false;
    tempExternalUser: ExternalReviewer = {
        name: '',
        email: '',
        contact: ''
    };

    selectedManuscript: Manuscript | null = null;

    userRole: any;
    userId: string = '';  
    supervisorName: any; 
    departmentName: any;
    candidateName: any;

    // Pagination/Table Config (omitted for brevity, assume correct)


    //  displayedEditorColumns: string[] = [
    //     'journalTitle', 'manuScript', 'editorInChief', 'emailId',
    //     'userName', 'submissionType', 'fileUrl', 
    //     'reviewerStatus',
    //     'journalId' 
    // ];

    // displayedEditorColumnHeaders: { [key: string]: string } = {
    //     journalTitle: 'Journal Title', 
    //     manuScript: 'Manuscript', 
    //     editorInChief: 'Author Name',
    //     emailId: 'Submitted User Email', 
    //     userName: 'Submitted By', 
    //     submissionType: 'Submission Type',
    //     fileUrl: 'File Download', 
    //     // NEW HEADER ADDED HERE
    //     reviewerStatus: 'Reviewer Status',
    //     journalId: 'Action' // Changed from 'Assign Reviewer' to 'Action' or similar
    // };

editorTableColumns: TableColumn[] = [
        { key: 'journalTitle', header: 'Journal Title', type: 'data' },
        { key: 'manuScript', header: 'Manuscript', type: 'data' },
        { key: 'editorInChief', header: 'Author Name', type: 'data' },
        { key: 'emailId', header: 'Submitted User Email', type: 'data' },
        { key: 'userName', header: 'Submitted By', type: 'data' },
        { key: 'submissionType', header: 'Submission Type', type: 'data' },
        { key: 'fileUrl', header: 'Manuscript ', type: 'file' },
        // Dynamic Status Column
        { key: 'reviewerStatus', header: 'Reviewer Status', type: 'status' },
        // Dynamic Action Column (Uses journalId implicitly for row context)
        { key: 'action', header: 'Action', type: 'action' } 
    ];
 
    getReviewerStatus(row: Manuscript): { display: string, assigned: boolean } {
        const assignedData = row.reviewerAssigned;
        
        // The data is null, empty string, or a string of comma-separated emails.
        const isAssigned = !!assignedData && assignedData.trim().length > 0;

        return {
            // Returns the comma-separated emails if assigned, otherwise 'Pending'
            display: isAssigned ? assignedData! : 'Pending',
            assigned: isAssigned
        };
    }

    private subscriptions: Subscription = new Subscription(); 

    constructor(
        private storageService: StorageService,
        private router: Router,
        private AuthSession: LoginSessionService,
        private StoragesServices: StorageService,
        private cookieService: CookieService,
        private journalWebApiService: LpujournalbookService
    ) { }

  
    
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    
  ngOnInit(): void {
    let loginStatus = this.checkUserLogin();

    if (loginStatus == true) {
      this.loadJournals();
    } else {
      this.Logout();
    }
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
  
 
    Logout(): void {
        this.cookieService.deleteAll('/');
        sessionStorage.clear();
        localStorage.clear();
        this.AuthSession.clearSession();
        this.StoragesServices.clean();
        this.router.navigateByUrl('Home').then(() => location.reload());
    }

    // --- JOURNAL/MANUSCRIPT LOADING (Omitting body for brevity, assume correct) ---
    loadJournals(): void {
        this.subscriptions.add(
            this.journalWebApiService.GetAllBooksDetails().subscribe({
                next: (dataX: any) => {
                    this.journalListsData = dataX.item1 || [];
                },
                error: (error: any) => {
                    console.error('Error fetching journals', error);
                }
            })
        );
    }

    setJournalId(): void {
        const selectedJournal = this.journalListsData.find(
            journal => journal.id.toString() === this.JournalTitle.toString()
        );
        
        if (selectedJournal) {
            this.currentJournalId = selectedJournal.id;
            this.currentJournalTitle = selectedJournal.journalTitle;
            this.showEditorData(this.currentJournalId);
            this.loadReviewers(this.currentJournalId);
        } else {
            this.currentJournalId = null;
            this.currentJournalTitle = '';
            this.EditorData = [];
            this.updatePaginatedDataEditor();
        }
    }

    showEditorData(journalId: number): void {
        this.isLoading = true;
        this.subscriptions.add(
            this.journalWebApiService.GetAllMenuScriptForJournalId(journalId).subscribe({
                next: (dataX: any) => {
                    this.EditorData = dataX.item1;
                    this.dataLoaded = true;
                    this.dataShowing = true;
                    this.calculateTotalPagesEditor();
                    this.updatePaginatedDataEditor();
                },
                error: (error: any) => {
                    this.dataShowing = false;
                    console.error('Error fetching manuscript data', error);
                },
                complete: () => {
                    this.isLoading = false;
                }
            })
        );
    }

    loadReviewers(journalId: number): void {
        this.subscriptions.add(
            this.journalWebApiService.GetReviewerDetailsForEditors(journalId).subscribe({
                next: (dataX: any) => {
                    const allReviewers: Reviewer[] = dataX.item1 || [];
                    this.reviewerList = allReviewers;

                    this.internalReviewerList = allReviewers.filter(
                        (reviewer: Reviewer) => !reviewer.userType || reviewer.userType.toLowerCase() === "null" || reviewer.userType.toLowerCase() === "internal"
                    );

                    this.externalReviewerList = allReviewers.filter(
                        (reviewer: Reviewer) => reviewer.userType && reviewer.userType.toLowerCase() === 'external'
                    );

                },
                error: (error: any) => {
                    console.error('Error fetching reviewers', error);
                    this.reviewerList = [];
                    this.internalReviewerList = [];
                    this.externalReviewerList = [];
                },
            })
        );
    }
    onTakeAction(rowData: Manuscript): void {
        this.selectedManuscript = rowData;
        
        // Reset Modal State
        this.reviewerType = 'internal';
        this.selectedReviewerId = '';
        this.internalReviewersList = [];
        this.externalReviewersList = [];
        this.tempExternalUser = { name: '', email: '', contact: '' };
        this.showNewExternalReviewerForm = false;
    }

    calculateTotalPagesEditor() {
        this.totalPagesEditor = Math.ceil(this.EditorData.length / this.pageSizeEditor) || 1;
        this.currentPageEditor = 1; 
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
    
    onSelectFileEditorX(fileUrl: string): void {
        if (fileUrl) {
            window.open(this.SERVER_URL + fileUrl, '_blank');
        }
    }

addReviewerFromDropdown(): void {
    if (!this.selectedReviewerId) return;

    const reviewerToAdd = this.reviewerList.find(r => r.emailId === this.selectedReviewerId);
    if (!reviewerToAdd) return;

    const targetList: (Reviewer | ExternalReviewer)[] = 
        this.reviewerType === 'internal' 
        ? this.internalReviewersList 
        : this.externalReviewersList; 
        
    const maxLimit = this.reviewerType === 'internal' ? this.MAX_INTERNAL_REVIEWERS : this.MAX_EXTERNAL_REVIEWERS;
    
    if (targetList.length >= maxLimit) {
        Swal.fire('Limit Reached', `You can assign at most ${maxLimit} ${this.reviewerType} reviewers.`, 'warning');
        return;
    }
    const isDuplicate = targetList.some(r => {
        if (this.reviewerType === 'internal') {
            return (r as Reviewer).emailId === reviewerToAdd.emailId;
        } else {
            return (r as ExternalReviewer).email === reviewerToAdd.emailId;
        }
    });

    if (isDuplicate) {
        Swal.fire('Duplicate', 'This reviewer is already selected.', 'warning');
        return;
    }
    if (this.reviewerType === 'internal') {
        this.internalReviewersList.push(reviewerToAdd); 
    } else {
        const extReviewer: ExternalReviewer = {
            name: reviewerToAdd.candidateName,
            email: reviewerToAdd.emailId, 
            contact: reviewerToAdd.mobileNumber || '' 
        };
        this.externalReviewersList.push(extReviewer);
    }
    
    this.selectedReviewerId = ''; // Reset selection
}


    removeInternalReviewer(index: number): void {
        this.internalReviewersList.splice(index, 1);
    }

    removeExternalReviewer(index: number): void {
        this.externalReviewersList.splice(index, 1);
    }
    
    toggleNewExternalReviewerForm(): void {
        this.showNewExternalReviewerForm = true;
        this.tempExternalUser = { name: '', email: '', contact: '' };
    }

    
    
    addNewExternalReviewerFromForm(): void {
        const { name, email, contact } = this.tempExternalUser;
        const manuscript = this.selectedManuscript;

        if (!name || !email || !contact || !manuscript) {
            Swal.fire('Missing Data', 'Please fill all fields and ensure a manuscript is selected.', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('JournalTitle', manuscript.journalTitle);
        formData.append('JournalId', this.currentJournalId?.toString() || '');
        formData.append('CandidateName', name);
        formData.append('UserEmail', email);
        formData.append('MobileNumber', contact);
        formData.append('UserType', '2'); 
        formData.append('PasswordText', contact); 
        formData.append('SubmittedBy', manuscript.emailId);
        formData.append('AuthorEmailId', manuscript.emailId);
        formData.append('RecordId', manuscript.id.toString());
        
        this.closeModal(false); 
        
        Swal.fire({
            title: 'Adding New Reviewer...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // 1. API Call: Create new account
        this.subscriptions.add(
            this.journalWebApiService.AssignExternalReviewerForJournal(formData).subscribe({
                next: (res: any) => {
                    // 🎯 FIX: Check the 'msg' property for the literal value 'Success'
                    const apiResponse = res.item1?.[0];
                    const msg = apiResponse?.['msg'] || '';
                    
                    // Check if 'msg' is exactly "Success" (case-sensitive check based on your output)
                    const isSuccess = msg === 'Success'; 
                    
                    if (isSuccess) {
                        Swal.fire({
                            title: 'Reviewer Account Created',
                            text: `Account created for ${name}. Reloading updated reviewer list...`,
                            icon: 'success',
                        }).then(() => {
                            // 2. Action: Reload the page 
                            window.location.reload(); 
                        });
                    } else {
                        // Use the message returned by the API if it's not 'Success'
                        Swal.fire('Account Creation Failed', msg || 'Unknown error occurred.', 'error');
                        this.closeModal(true); // Re-open modal
                    }
                },
                error: (err) => {
                    console.error('API Error (External Registration):', err);
                    Swal.fire('Error', 'Failed to create external reviewer account due to network or server error.', 'error');
                    this.closeModal(true); 
                }
            })
        );
    }
    

    assignReviewer(): void {
        if (!this.selectedManuscript) return;

        if (this.reviewerType === 'internal' && this.internalReviewersList.length === 0) {
            Swal.fire('No Reviewer', 'Please add at least one internal reviewer.', 'warning');
            return;
        }
        if (this.reviewerType === 'external' && this.externalReviewersList.length === 0) {
            Swal.fire('No Reviewer', 'Please add at least one external reviewer.', 'warning');
            return;
        }
        let finalEmails: string[] = [];
        if (this.reviewerType === 'internal') {
            finalEmails = this.internalReviewersList.map(r => r.emailId);
        } else {
            finalEmails = this.externalReviewersList.map(r => r.email);
        }

        this.handleFinalAssignment(finalEmails);
    }
    private handleFinalAssignment(emails: string[]): void {
        const finalAssignedTo = emails.join(',');
        const { id, journalTitle, manuScript, submissionType, emailId } = this.selectedManuscript!;
        
        const formData = new FormData();
        // Use JournalId from component state
        formData.append('JournalId', this.currentJournalId); 
        formData.append('MultipleAssignedTo', finalAssignedTo);
        formData.append('SubmittedBy', emailId); 
        formData.append('RecordId', id.toString());
        formData.append('JournalTitle', journalTitle);
        formData.append('Manuscript', manuScript);
        formData.append('SubmissionType', submissionType);

        Swal.fire({
            title: 'Assigning Reviewers...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        this.subscriptions.add(
            this.journalWebApiService.AssignNewReviewerForJournal(formData).subscribe({
                next: (data) => {
                    const result = data.item1?.[0]?.['returnData'];
                    
                    Swal.close(); 

                    if (result && result === 'success') {
                        Swal.fire('Reviewers Assigned', 'The assignment was successfully completed.', 'success').then(() => {
                            window.location.reload();
                        });
                    } else {
                        const apiMsg = data.item1?.[0]?.['msg'] || 'Reviewer assignment failed on the server.';
                        Swal.fire('Assignment Failed', apiMsg, 'error');
                        // No reload on failure, but need to ensure modal can be manually closed/reopened
                    }
                },
                error: (err) => {
                    console.error('API Error (Final Assignment):', err);
                    
                    Swal.close(); 
                    
                    Swal.fire('Error', 'Unable to complete the assignment request due to a network or server error.', 'error');
                }
            })
        );
    }
    // Helper to control modal visibility manually
    private closeModal(reopen: boolean = false): void {
        const modalElement = document.getElementById('assignReviewerModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
                if (reopen) {
                    setTimeout(() => {
                         new bootstrap.Modal(modalElement).show();
                    }, 500);
                }
            }
        }
    }
}

// declare var bootstrap: any;
// import { DatePipe } from '@angular/common';
// import { Component, OnInit, OnDestroy } from '@angular/core'; // Added OnDestroy
// import { FormBuilder } from '@angular/forms'; // Retained for future use, though not used here
// import { Router, ActivatedRoute } from '@angular/router';
// import { StorageService } from 'src/app/_services/storage.service';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import Swal from 'sweetalert2';
// import { LoginSessionService } from 'src/app/_services/login-session.service';
// import { CookieService } from 'ngx-cookie-service';
// import { forkJoin, Subscription } from 'rxjs'; // Added Subscription for cleanup

// // --- INTERFACES FOR TYPE SAFETY ---
// interface Reviewer {
//     emailId: string;
//     candidateName: string;
//     userType: string;
//     mobileNumber?: string; // Optional for external
// }

// interface ExternalReviewer {
//     name: string;
//     email: string;
//     contact: string;
// }

// interface Manuscript {
//     id: number;
//     journalId: number;
//     journalTitle: string;
//     manuScript: string;
//     submissionType: string;
//     emailId: string; // SubmittedBy ID (Author/Editor)
//     [key: string]: any;
// }
// // ------------------------------------

// @Component({
//     selector: 'app-Manuscript-Details',
//     templateUrl: './Manuscript-Details.component.html',
//     styleUrls: ['./Manuscript-Details.component.scss']
// })
// export class ManuscriptDetailsComponent implements OnInit, OnDestroy { // Implemented OnDestroy
//     // --- CONSTANTS ---
//     readonly MAX_INTERNAL_REVIEWERS = 3;
//     readonly MAX_EXTERNAL_REVIEWERS = 2; // Required change to 2
//     readonly SERVER_URL = 'https://files.lpu.in/umsweb/Journal/';
//     serverUrl: any;
//     // --- Component State Variables ---
//     dataShowing: boolean = false;
//     dataLoaded: boolean = false;
//     isLoading: boolean = false;
    
//     // Journal Selection
//     journalListsData: any[] = [];
//     JournalTitle: string = ''; // Bound to select dropdown value (journal ID)
//     // currentJournalId: number | null = null;
//     currentJournalTitle: any = '';

//     // Manuscript Data Grid
//     EditorData: Manuscript[] = [];
//     currentPageEditor: number = 1;
//     pageSizeEditor: number = 10;
//     paginatedEditorData: Manuscript[] = [];
//     totalPagesEditor: number = 1;

//     // Reviewer Assignment Modal State
//     reviewerType: 'internal' | 'external' = 'internal'; // 'internal' or 'external'
    
//     // All available reviewers (Fetched from API)
//     reviewerList: Reviewer[] = [];
//     internalReviewerList: Reviewer[] = [];
//     externalReviewerList: Reviewer[] = []; 
    
//     // Selected Reviewers for Assignment
//     selectedReviewerId: string = ''; // Selected emailId from dropdown
//     internalReviewersList: Reviewer[] = [];
//     externalReviewersList: ExternalReviewer[] = []; // Using the dedicated interface

//     // New External Reviewer Form State
//     showNewExternalReviewerForm: boolean = false;
//     tempExternalUser: ExternalReviewer = {
//         name: '',
//         email: '',
//         contact: ''
//     };

//     // Current Manuscript Data (Selected from Grid)
//     selectedManuscript: Manuscript | null = null;

//     // User Data (Fetched from Cookie/Storage)
//     userRole: any;
//     userId: string = ''; // SubmittedBy (Current User/Editor)
//     supervisorName: any; 
//     departmentName: any;
//     candidateName: any;

//     // Pagination/Table Config
//     displayedEditorColumns: string[] = [
//         'journalTitle', 'manuScript', 'editorInChief', 'emailId',
//         'userName', 'submissionType', 'fileUrl', 'journalId'
//     ];
//     displayedEditorColumnHeaders: { [key: string]: string } = {
//         journalTitle: 'Journal Title', manuScript: 'Manuscript', editorInChief: 'Author Name',
//         emailId: 'Submitted User Email', userName: 'Submitted By', submissionType: 'Submission Type',
//         fileUrl: 'File Download', journalId: 'Assign Reviewer'
//     };

//     private subscriptions: Subscription = new Subscription(); // To manage subscriptions

//     constructor(
//         private storageService: StorageService,
//         private router: Router,
//         private AuthSession: LoginSessionService,
//         private StoragesServices: StorageService,
//         private cookieService: CookieService,
//         private journalWebApiService: LpujournalbookService
//     ) { }

    
//   ngOnInit(): void {
//     this.serverUrl = 'https://files.lpu.in/umsweb/Journal/';
//     let loginStatus = this.checkUserLogin();

//     if (loginStatus == true) {
//       this.loadJournals();
//     } else {
//       this.Logout();
//     }
//   }

//   currentJournalId: any;
//   // currentJournalTitle: any;

//   checkUserLogin(): Boolean | any {
//     const GetCookieData = this.cookieService.get('authData');
//     if (GetCookieData) {
//       try {
//         const retrievedCookies = JSON.parse(GetCookieData);
//         this.userRole = retrievedCookies.UserRole?.length > 0 ? retrievedCookies.UserRole : -1;
//         this.userId = retrievedCookies.EmailId;
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
//     // ngOnInit(): void {
//     //     this.checkUserLogin(); // Check login and retrieve user info
//     //     this.loadJournals();
//     // }
    
//     ngOnDestroy(): void {
//         this.subscriptions.unsubscribe();
//     }

//     // --- USER/LOGIN MANAGEMENT ---
//     // checkUserLogin(): void {
//     //     const GetCookieData = this.cookieService.get('authData');
//     //     if (GetCookieData) {
//     //         try {
//     //             const retrievedCookies = JSON.parse(GetCookieData);
//     //             // Assign user data
//     //             this.userRole = retrievedCookies.UserRole?.length > 0 ? retrievedCookies.UserRole : -1;
//     //             this.userId = retrievedCookies.EmailId || ''; // Current Editor's ID
//     //             this.supervisorName = retrievedCookies.SupervisorName;
//     //             this.departmentName = retrievedCookies.DepartmentName;
//     //             this.candidateName = retrievedCookies.CandidateName;
                
//     //             if (!this.userId) {
//     //                 this.Logout();
//     //             }
//     //         } catch (error) {
//     //             console.error("Error parsing authData cookie:", error);
//     //             this.Logout();
//     //         }
//     //     } else {
//     //         this.Logout();
//     //     }
//     // }

//     Logout(): void {
//         this.cookieService.deleteAll('/');
//         sessionStorage.clear();
//         localStorage.clear();
//         this.AuthSession.clearSession();
//         this.StoragesServices.clean();
//         this.router.navigateByUrl('Home').then(() => location.reload());
//     }

//     // --- JOURNAL/MANUSCRIPT LOADING ---

//     loadJournals(): void {
//         this.subscriptions.add(
//             this.journalWebApiService.GetAllBooksDetails().subscribe({
//                 next: (dataX: any) => {
//                     this.journalListsData = dataX.item1 || [];
//                 },
//                 error: (error: any) => {
//                     console.error('Error fetching journals', error);
//                 }
//             })
//         );
//     }

//   //     setJournalId() {
//   //   let idx = this.journalListsData.find(
//   //     journal => journal.id == this.JournalTitle
//   //   );
//   //   this.currentJournalId = idx.id;
//   //   this.currentJournalTitle = idx.journalTitle;
//   //   this.showEditorData(this.currentJournalId);
//   //   this.loadReviewers(this.currentJournalId);
//   // }

//     setJournalId(): void {
//         const selectedJournal = this.journalListsData.find(
//             journal => journal.id.toString() === this.JournalTitle.toString()
//         );
        
//         if (selectedJournal) {
//             this.currentJournalId = selectedJournal.id;
//             this.currentJournalTitle = selectedJournal.journalTitle;
//             this.showEditorData(this.currentJournalId);
//             this.loadReviewers(this.currentJournalId);
//         } else {
//             this.currentJournalId = null;
//             this.currentJournalTitle = '';
//             this.EditorData = [];
//             this.updatePaginatedDataEditor();
//         }
//     }

//     showEditorData(journalId: number): void {
//         this.isLoading = true;
//         this.subscriptions.add(
//             this.journalWebApiService.GetAllMenuScriptForJournalId(journalId).subscribe({
//                 next: (dataX: any) => {
//                     this.EditorData = dataX.item1 || [];
//                     this.dataLoaded = true;
//                     this.dataShowing = true;
//                     this.calculateTotalPagesEditor();
//                     this.updatePaginatedDataEditor();
//                 },
//                 error: (error: any) => {
//                     this.dataShowing = false;
//                     console.error('Error fetching manuscript data', error);
//                 },
//                 complete: () => {
//                     this.isLoading = false;
//                 }
//             })
//         );
//     }

//     loadReviewers(journalId: number): void {
//         this.subscriptions.add(
//             this.journalWebApiService.GetReviewerDetailsForEditors(journalId).subscribe({
//                 next: (dataX: any) => {
//                     const allReviewers: Reviewer[] = dataX.item1 || [];
//                     this.reviewerList = allReviewers;

//                     // Filter Logic: Assuming reviewers without explicit type or type 'null' are Internal
//                     this.internalReviewerList = allReviewers.filter(
//                         (reviewer: Reviewer) => !reviewer.userType || reviewer.userType.toLowerCase() === "null" || reviewer.userType.toLowerCase() === "internal"
//                     );

//                     // Filter Logic: Explicitly external
//                     this.externalReviewerList = allReviewers.filter(
//                         (reviewer: Reviewer) => reviewer.userType && reviewer.userType.toLowerCase() === 'external'
//                     );

//                 },
//                 error: (error: any) => {
//                     console.error('Error fetching reviewers', error);
//                     this.reviewerList = [];
//                     this.internalReviewerList = [];
//                     this.externalReviewerList = [];
//                 },
//             })
//         );
//     }

//     onSelectFileEditorX(fileUrl: string): void {
//         if (fileUrl) {
//             window.open(this.SERVER_URL + fileUrl, '_blank');
//         }
//     }

//     // --- PAGINATION ---
//     calculateTotalPagesEditor(): void {
//         this.totalPagesEditor = Math.ceil(this.EditorData.length / this.pageSizeEditor) || 1;
//         this.currentPageEditor = 1; // Reset to first page
//     }

//     updatePaginatedDataEditor(): void {
//         const startIndex = (this.currentPageEditor - 1) * this.pageSizeEditor;
//         const endIndex = Math.min(startIndex + this.pageSizeEditor, this.EditorData.length);
//         this.paginatedEditorData = this.EditorData.slice(startIndex, endIndex);
//     }

//     nextPageEditor(): void {
//         if (this.currentPageEditor < this.totalPagesEditor) {
//             this.currentPageEditor++;
//             this.updatePaginatedDataEditor();
//         }
//     }

//     previousPageEditor(): void {
//         if (this.currentPageEditor > 1) {
//             this.currentPageEditor--;
//             this.updatePaginatedDataEditor();
//         }
//     }

//     // --- MODAL & DATA RESET ---

//     onTakeAction(rowData: Manuscript): void {
//         this.selectedManuscript = rowData;
        
//         // Reset Modal State
//         this.reviewerType = 'internal';
//         this.selectedReviewerId = '';
//         this.internalReviewersList = [];
//         this.externalReviewersList = [];
//         this.tempExternalUser = { name: '', email: '', contact: '' };
//         this.showNewExternalReviewerForm = false;
//     }

//     // --- INTERNAL REVIEWER LOGIC ---

//     // Used for both Internal and External dropdown lists
//     addReviewerFromDropdown(): void {
//         if (!this.selectedReviewerId || !this.selectedManuscript) return;

//         const reviewerToAdd = this.reviewerList.find(r => r.emailId === this.selectedReviewerId);

//         if (!reviewerToAdd) return;

//         if (this.reviewerType === 'internal') {
//             if (this.internalReviewersList.length >= this.MAX_INTERNAL_REVIEWERS) {
//                 Swal.fire('Limit Reached', `You can assign at most ${this.MAX_INTERNAL_REVIEWERS} internal reviewers.`, 'warning');
//                 return;
//             }
//             if (this.internalReviewersList.some(r => r.emailId === reviewerToAdd.emailId)) {
//                 Swal.fire('Duplicate', 'This reviewer is already selected.', 'warning');
//                 return;
//             }
//             this.internalReviewersList.push(reviewerToAdd);
//         } else if (this.reviewerType === 'external') {
//             // Unify logic for External: Existing external reviewers are added to the list as well
//             const extReviewer: ExternalReviewer = {
//                 name: reviewerToAdd.candidateName,
//                 email: reviewerToAdd.emailId,
//                 contact: reviewerToAdd.mobileNumber || '' 
//             };
//             this.addExternalReviewerToList(extReviewer);
//         }
        
//         this.selectedReviewerId = ''; // Reset selection
//     }

//     removeInternalReviewer(index: number): void {
//         this.internalReviewersList.splice(index, 1);
//     }

//     // --- EXTERNAL REVIEWER LOGIC ---

//     toggleNewExternalReviewerForm(): void {
//         this.showNewExternalReviewerForm = true;
//         this.tempExternalUser = { name: '', email: '', contact: '' };
//     }

//     addExternalReviewerFromForm(): void {
//         const { name, email, contact } = this.tempExternalUser;

//         if (!name || !email || !contact) {
//             Swal.fire('Missing Data', 'Please fill all external user fields.', 'warning');
//             return;
//         }

//         const newReviewer: ExternalReviewer = { name, email, contact };
//         this.addExternalReviewerToList(newReviewer);
        
//         // Reset form state after successful addition
//         this.tempExternalUser = { name: '', email: '', contact: '' };
//         this.showNewExternalReviewerForm = false;
//     }

//     private addExternalReviewerToList(reviewer: ExternalReviewer): void {
//         if (this.externalReviewersList.length >= this.MAX_EXTERNAL_REVIEWERS) {
//             Swal.fire('Limit Reached', `You can assign at most ${this.MAX_EXTERNAL_REVIEWERS} external reviewers.`, 'warning');
//             return;
//         }

//         if (this.externalReviewersList.some(r => r.email.toLowerCase() === reviewer.email.toLowerCase())) {
//             Swal.fire('Duplicate', 'This email is already added.', 'warning');
//             return;
//         }

//         this.externalReviewersList.push(reviewer);
//     }

//     removeExternalReviewer(index: number): void {
//         this.externalReviewersList.splice(index, 1);
//     }


//     // --- ASSIGNMENT SUBMISSION ---

//     assignReviewer(): void {
//         if (!this.selectedManuscript) return;

//         if (this.reviewerType === 'internal') {
//             this.handleInternalAssignment();
//         } else if (this.reviewerType === 'external') {
//             this.handleExternalAssignment();
//         }
//     }

//     // Helper to close modal cleanly
//     private closeModal(): void {
//         const modalElement = document.getElementById('assignReviewerModal');
//         if (modalElement) {
//             const modal = bootstrap.Modal.getInstance(modalElement);
//             if (modal) modal.hide();
//         }
//     }

//     private handleInternalAssignment(): void {
//         if (this.internalReviewersList.length === 0) {
//             Swal.fire('No Reviewer', 'Please add at least one internal reviewer.', 'warning');
//             return;
//         }

//         const finalAssignedTo = this.internalReviewersList.map(r => r.emailId).join(',');
        
//         // Use destructuring for cleaner payload building
//         const { id, journalTitle, manuScript, submissionType, emailId } = this.selectedManuscript!;

//         const formData = new FormData();
//         formData.append('JournalId', journalTitle); // Assuming journalTitle is JournalId as per the next/error logic
//         formData.append('MultipleAssignedTo', finalAssignedTo);
//         formData.append('SubmittedBy', emailId); // Manuscript submitted user's email
//         formData.append('RecordId', id.toString());
//         formData.append('JournalTitle', journalTitle);
//         formData.append('Manuscript', manuScript);
//         formData.append('SubmissionType', submissionType);

//         this.subscriptions.add(
//             this.journalWebApiService.AssignNewReviewerForJournal(formData).subscribe({
//                 next: (data) => {
//                     const result = data.item1?.[0]?.['returnData'];
//                     if (result === 'success') {
//                         Swal.fire('Reviewer Assigned', data.item1[0]['msg'], 'success').then(() => {
//                             window.location.reload();
//                         });
//                     } else {
//                         Swal.fire('Assignment Failed', result || 'Unknown error', 'error');
//                     }
//                 },
//                 error: (err) => {
//                     console.error('API Error (Internal):', err);
//                     Swal.fire('Error', 'Unable to complete the internal assignment request.', 'error');
//                 },
//                 complete: () => this.closeModal()
//             })
//         );
//     }

//     private handleExternalAssignment(): void {
//         if (this.externalReviewersList.length === 0) {
//             Swal.fire('No Reviewer', 'Please add at least one external reviewer.', 'warning');
//             return;
//         }

//         // Use destructuring for cleaner payload building
//         const { id, journalTitle, manuScript, submissionType, emailId } = this.selectedManuscript!;
//         const journalId = this.currentJournalId?.toString() || '';
        
//         // Create an array of Observables for each external reviewer
//         const requests = this.externalReviewersList.map((ext) => {
//             const formData = new FormData();
            
//             // This API registers and assigns in one go (based on the TS structure)
//             formData.append('JournalTitle', journalTitle);
//             formData.append('JournalId', journalId); // Use current Journal ID
//             formData.append('MultipleAssignedTo', ext.email); // Used by the SP for assignment
//             formData.append('RecordId', id.toString());
//             formData.append('CandidateName', ext.name);
//             formData.append('UserEmail', ext.email);
//             formData.append('MobileNumber', ext.contact);
//             formData.append('UserType', '2'); // '2' likely means External
//             formData.append('PasswordText', ext.contact); // Using contact as default password
//             formData.append('SubmittedBy', emailId); // Manuscript submitted user's email
//             formData.append('AuthorEmailId', emailId);

//             // API call: AssignExternalReviewerForJournal
//             return this.journalWebApiService.AssignExternalReviewerForJournal(formData);
//         });

//         this.subscriptions.add(
//             forkJoin(requests).subscribe({
//                 next: (responses: any[]) => {
//                     const failedCount = responses.filter(res => res.item1?.[0]?.['returnData'] !== 'success').length;

//                     if (failedCount === 0) {
//                         Swal.fire('External Reviewers Assigned', 'All external reviewers have been assigned successfully.', 'success').then(() => {
//                             window.location.reload();
//                         });
//                     } else if (failedCount < responses.length) {
//                         Swal.fire('Partial Success', `${responses.length - failedCount} of ${responses.length} reviewers assigned.`, 'warning').then(() => {
//                             window.location.reload();
//                         });
//                     } else {
//                         Swal.fire('Assignment Failed', 'No external reviewers could be assigned.', 'error');
//                     }
//                 },
//                 error: (err) => {
//                     console.error('API Error (External):', err);
//                     Swal.fire('Error', 'Failed to assign external reviewers.', 'error');
//                 },
//                 complete: () => this.closeModal()
//             })
//         );
//     }
// }