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
declare var bootstrap: any;
interface JournalIssue {
    id: number;
    issueId: number;
    volume: string;
    issueTitle: string;
    authorName: string; 
    pageNumber: string;
    publishDate: string;
    issueDescription: string;
    issueFileName: string;
    [key: string]: any;
    
}

@Component({
    selector: 'app-UpdateIssueDetails',
    templateUrl: './UpdateIssueDetails.html',
    styleUrls: ['./UpdateIssueDetails.scss']
})
export class UpdateIssueDetailsComponent implements OnInit {
    dataSource: any[] = [];
    journalListsData: any[] = [];
    JournalIssuesData: JournalIssue[] = []; 
    paginatedJournalIssuesData: JournalIssue[] = [];
    currentPageEditor: number = 1;
    pageSizeEditor: number = 10;
    totalPagesEditor: number = 1;
    JournalTitle: any = '';
    isLoadingPage: boolean = true;
    isLoadingJournal: boolean = false;
    serverUrl: any;
    VolumeNumber:any;
    selectedIssueData: JournalIssue | null = null;
    IssueIdToUpdate: number | null = null;
    authorInput: string = '';
    authors: string[] = []; 
    showBadge: boolean = false;
    isUpdateFormSubmitted: boolean = false;

    editIssueForm!: FormGroup;

    displayedEditorColumns: string[] = [
        'volume',
        'issueTitle',
        'authorName',
        'pageNumber',
        'issueFileName',
        'Action' 
    ];

    displayedEditorColumnHeaders: { [key: string]: string } = {
        volume: 'Journal Volume',
        issueTitle: 'Issue Title',
        authorName: 'Author Name',
        pageNumber: 'Page Number',
        issueFileName: 'Issue File',
        Action: 'Action'
    };
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
            this.LoadEditForm(); 
        } else {
            Swal.fire('Invalid Login Details !', '', 'error').then(() => this.Logout());
        }
    }

    
    LoadEditForm() {
        
        this.editIssueForm = this.fb.group({
            VolumeId: ['', Validators.required],
            IssueDescription: ['', Validators.required],
            PublishDate: ['', Validators.required],
            IssueTitle: ['', Validators.required],
            PageNumber: ['', Validators.required],
           
        });
    }

    
    get editFormControls() {
        return this.editIssueForm.controls;
    }

    

    onEditIssue(rowData: JournalIssue): void {
        this.isLoading = false;
        this.selectedIssueData = rowData;
        this.IssueIdToUpdate = rowData.issueId;
        console.log(JSON.stringify(rowData))

        // 1. Pre-fill Authors (comma-separated string to array)
        this.authors = rowData.authorName ? rowData.authorName.split(',').map(a => a.trim()).filter(a => a.length > 0) : [];
        this.VolumeNumber= rowData.volume;
        // 2. Pre-fill other form fields
        this.editIssueForm.patchValue({
            VolumeId: rowData.volume,
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
        const minLoadingTime = 1500;
        const startTime = Date.now();
        const formData = new FormData();
        const formValue = this.editIssueForm.value;

        // Append all necessary fields
        formData.append('IssueId', this.IssueIdToUpdate.toString());
        formData.append('Volume',  formValue.VolumeId);
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

        this.journalWebApiService.UpdateIssueDetails(formData)  
            .pipe(
                finalize(() => {
                    const elapsed = Date.now() - startTime;
                    const remaining = Math.max(minLoadingTime - elapsed, 0);
                    setTimeout(() => {
                        this.isLoading = false;
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

    IssueFileData: any = null;
    IssueFileName: any = '';

    onFileSelectedIssueFile(event: any): void {
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

        const validFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

        this.IssueFileName = validFileName;

        reader.readAsDataURL(file);
        reader.onload = () => {
            const ssss = reader.result as string;
            this.IssueFileData = ssss.split(',')[1];
        };
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
            this.isLoadingJournal = true;
            this.currentPageEditor = 1; 
            this.GetAllIssues(selectedJournal.id);
        }
    }

 
    GetAllIssues(JournalId: any) {
        this.journalWebApiService.GetJournalIssues(JournalId).subscribe({
            next: (dataX: any) => {
                this.JournalIssuesData = dataX.item1 || [];
                //  console.log("IssueData"+JSON.stringify(this.JournalIssuesData))
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



    UpdateVolume(): void {
        const currentVal = Number(this.editIssueForm.get('VolumeId')?.value);
        const baseVolume = Number(this.VolumeNumber);
        const maxAllowed = baseVolume + 1;

        if (currentVal >= maxAllowed) {
            alert(`Cannot increase more than ${maxAllowed}`);
        } else {
            this.editIssueForm.patchValue({
                VolumeId: currentVal + 1
            });
        }
    }

    UpdateVolume2(): void {
        const currentVal = Number(this.editIssueForm.get('VolumeId')?.value);
        const baseVolume = Number(this.VolumeNumber);

        if (currentVal <= baseVolume) {
            alert(`Cannot reduce below the original volume (${baseVolume})`);
        } else {
            this.editIssueForm.patchValue({
                VolumeId: currentVal - 1
            });
        }
    }
}
