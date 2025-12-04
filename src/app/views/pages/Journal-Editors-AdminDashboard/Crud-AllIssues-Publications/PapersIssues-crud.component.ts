import Swal from 'sweetalert2';
import { catchError, finalize, of, tap } from 'rxjs';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { StorageService } from 'src/app/_services/storage.service';


// --- Type Definitions ---
interface JournalApiItem {
  id: number;
  journalId: string;
  journalTitle: string;
  volume: string;
}

interface IssueApiItem {
  Id: number;
  IssueId: number;
  JournalId: number; // Used for identifying the parent journal
  IssueTitle: string;
  PageNumber: string;
  PublishDate: string;
  AuthorName: string;
  IssueDescription: string;
  IssueFileName: string; // File path from the database, used for updates
}

// --- Constants ---
const MIN_LOADING_TIME = 1500;
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB limit



@Component({
  selector: 'app-PapersIssues-crud',
  templateUrl: './PapersIssues-crud.component.html',
  styleUrls: ['./PapersIssues-crud.scss']
})
export class PapersIssuesCrudComponent implements OnInit {

ServerUrl: any;
  // --- Form & State ---
  journalForm!: FormGroup;
  isLoading: boolean = false;
  isFormSubmitted: boolean = false;

  // --- Data Storage ---
  journalListsData: JournalApiItem[] = [];
  issuesData: IssueApiItem[] = [];

  // --- Journal Selection ---
  selectedJournalId: number | null = null;
  currentJournalDetails: Partial<JournalApiItem> = {};

  // --- Update Mode Management ---
  isUpdateMode: boolean = false;
  currentIssueId: number | null = null;
  currentFilePath: string | null = null;

  // --- Author Management ---
  authorInput: string = '';
  authors: string[] = [];

  // --- File Data ---
  IssueFileData: string | null = null; // Stores Base64 content of the file
  IssueFileName: string | null = null; // Stores the name of the file

  constructor(
    private fb: FormBuilder,
    private journalWebApiService: LpujournalbookService
  ) { }

  ngOnInit(): void {
    this.ServerUrl='https://files.lpu.in/umsweb/Journal/';
    this.initForm();
    this.loadJournals();
  }



  private initForm(): void {
    this.journalForm = this.fb.group({
      IssueDescription: ['', [Validators.required, Validators.maxLength(500)]],
      PublishDate: ['', Validators.required],
      IssueTitle: ['', [Validators.required, Validators.maxLength(250)]],
      PageNumber: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s-]+$/)]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.journalForm.controls;
  }


  loadJournals(): void {
    this.isLoading = true;
    const startTime = Date.now();

    // NOTE: Mocking the API call structure if service function is unavailable
    if (!this.journalWebApiService.GetAllBooksDetails) {
      this.journalListsData = [
        { id: 1, journalId: 'JRNL-001', journalTitle: 'Science Today', volume: '10' },
        { id: 2, journalId: 'JRNL-002', journalTitle: 'Tech Review', volume: '5' },
      ];
      setTimeout(() => this.isLoading = false, MIN_LOADING_TIME);
      return;
    }

    this.journalWebApiService.GetAllBooksDetails().pipe(
      tap((dataX: any) => {
        if (dataX && dataX.item1) {
          this.journalListsData = dataX.item1 as JournalApiItem[];
        }
      }),
      catchError(error => {
        console.error('Error fetching journals:', error);
        Swal.fire({ title: 'Data Error', text: 'Failed to load journal list.', icon: 'error' });
        return of(null);
      }),
      finalize(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(MIN_LOADING_TIME - elapsed, 0);
        setTimeout(() => this.isLoading = false, remaining);
      })
    ).subscribe();
  }

  setJournalDetails(): void {
    // 1. Safely convert the selected ID (which may be a string) to a number.
    const journalId = this.selectedJournalId ? Number(this.selectedJournalId) : null;

    if (journalId !== null) {
      // 2. Find the selected journal object using a number comparison.
      const details = this.journalListsData.find(journal => journal.id === journalId);

      // 3. Update the details, falling back to an empty object if not found.
      this.currentJournalDetails = details ? details : {};
      this.loadIssues(journalId);
      this.resetForm();
    } else {
      // Clear details if 'Select Journal' option is chosen
      this.currentJournalDetails = {};
      this.issuesData = [];
      this.resetForm();
    }
  }
  /**
   * READ Operation: Calls JournalPublicationsCrudOperation with ACTION_GET_ISSUES.
   */
  loadIssues(journalId: number): void {
    this.isLoading = true;
    const startTime = Date.now();
    this.issuesData = [];

    const formData = new FormData();
    // Pass the JournalId required by the service to filter issues
    formData.append('JournalId', journalId.toString());

    this.journalWebApiService.GetJournalIssueDetails(formData).pipe(
      tap((dataX: any) => {
        if (dataX && dataX.item1) {
          this.issuesData = dataX.item1 as IssueApiItem[];
        } else {
          this.issuesData = [];
        }
        this.filterAndPaginate();
      }),
      catchError((error: any) => {
        console.error('Error fetching issues:', error);
        this.issuesData = [];
        Swal.fire({ title: 'Data Error', text: 'Failed to load issues for this journal.', icon: 'error' });
        return of(null);
      }),
      finalize(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(MIN_LOADING_TIME - elapsed, 0);
        setTimeout(() => this.isLoading = false, remaining);
      })
    ).subscribe();
  }

  // ----------------------------------------------------------------------
  // CRUD Operations - Edit & Delete
  // ----------------------------------------------------------------------

  resetForm(): void {
    this.journalForm.reset();
    this.journalForm.get('PublishDate')?.setValue('');

    this.isUpdateMode = false;
    this.currentIssueId = null;
    this.currentFilePath = null;
    this.authors = [];
    this.IssueFileData = null;
    this.IssueFileName = null;
    this.isFormSubmitted = false;
    this.journalForm.get('PublishDate')?.enable();
  }

  /**
   * Binds selected issue data to the form for editing.
   */
  onEdit(issue: IssueApiItem): void {
    this.isUpdateMode = true;
    this.currentIssueId = issue.Id;
    this.currentFilePath = issue.IssueFileName;

    // --- Date Formatting Fix ---
    let formattedPublishDate = issue.PublishDate;
    if (issue.PublishDate) {
      if (issue.PublishDate.includes('T')) {
        formattedPublishDate = issue.PublishDate.split('T')[0];
      } else {
        try {
          const dateObj = new Date(issue.PublishDate);
          if (!isNaN(dateObj.getTime())) {
            formattedPublishDate = dateObj.toISOString().split('T')[0];
          }
        } catch (e) {
          console.warn('Date parsing failed, using original date string.');
          formattedPublishDate = issue.PublishDate;
        }
      }
    }
    // ---------------------------

    this.journalForm.patchValue({
      IssueDescription: issue.IssueDescription,
      PublishDate: formattedPublishDate, // <-- PATCHED WITH CORRECT FORMAT
      IssueTitle: issue.IssueTitle,
      PageNumber: issue.PageNumber,
    });

    // Disable the PublishDate control when in update mode (as requested)
    this.journalForm.get('PublishDate')?.disable();
    this.authors = issue.AuthorName   ? issue.AuthorName.split(',').map(a => a.trim()).filter(a => a.length > 0)  : [];

    // this.authors = (issue.AuthorName?.length>0 ?issue.AuthorName.split(',').map(a => a.trim()).filter(a => a):'');
    this.IssueFileData = null;
    this.IssueFileName = null;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * DELETE Operation: Calls JournalPublicationsCrudOperation with ACTION_DELETE_ISSUE.
   */
  onDelete(issue: IssueApiItem): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete issue: ${issue.IssueTitle}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;

         const journalId = this.selectedJournalId?.toString() || '';
    // 1. Fields required for API routing and file handling
   
        const deleteFormData = new FormData();
        deleteFormData.append('IssueId', issue.IssueId.toString());
        deleteFormData.append('Action', 'Delete');
         deleteFormData.append('JournalId', journalId);

        this.journalWebApiService.JournalPublicationsCrudOperation(deleteFormData, "Delete").pipe(
          tap(() => {
            Swal.fire('Deleted!', 'The issue has been removed.', 'success');
          }),
          catchError((err) => {
            Swal.fire('Failed!', 'Deletion failed due to an error.', 'error');
            return of(null);
          }),
          finalize(() => {
            this.loadIssues(Number(this.selectedJournalId)); // Reload the grid
          })
        ).subscribe();
      }
    });
  }

  // ----------------------------------------------------------------------
  // Submission Handlers (Create & Update)
  // ----------------------------------------------------------------------

  onSubmit(): void {
    this.isFormSubmitted = true;

    if (this.journalForm.invalid || this.authors.length === 0) {
      if (this.authors.length === 0) {
        Swal.fire({ title: 'Validation Error', text: 'Please enter at least one author.', icon: 'warning' });
      }
      return;
    }

    if (!this.IssueFileData && !this.isUpdateMode) {
      Swal.fire({ title: 'Validation Error', text: 'Please upload the issue file.', icon: 'warning' });
      return;
    }

    this.isLoading = true;

    if (this.isUpdateMode) {
      this.updateIssue();
    } else {
      this.addNewIssue();
    }
  }

  /**
   * UPDATE Operation: Calls JournalPublicationsCrudOperation with ACTION_UPDATE_ISSUE.
   */
  updateIssue(): void {
    const formValue = this.journalForm.value;
    const formData = new FormData();
    const journalId = this.selectedJournalId?.toString() || '';
    // 1. Fields required for API routing and file handling
    formData.append('Action', 'Update');
    formData.append('IssueId', this.currentIssueId?.toString() || '');
    formData.append('PublishedDate', formValue.PublishDate);
    formData.append('IssueFileName', this.currentFilePath || '');
    formData.append('IssueFileData', this.IssueFileData || '');  
    formData.append('IssueTitle', formValue.IssueTitle);
    formData.append('IssueDescription', formValue.IssueDescription);
    formData.append('AuthorName', this.authors.join(', '));
    formData.append('PageNo', formValue.PageNumber);
    // 2. Other form fields for content update

    // console.log("Uploading Publication with data:");
    // formData.forEach((value, key) => console.log(`${key}: ${value}`));
    this.journalWebApiService.JournalPublicationsCrudOperation(formData, "Update").pipe(
      tap(() => {
        Swal.fire({ title: 'Success', text: `Issue ID ${this.currentIssueId} updated successfully.`, icon: 'success' });
      }),
      catchError(error => {
        console.error('Update Error:', error);
        Swal.fire({ title: 'Error', text: 'Failed to update issue.', icon: 'error' });
        return of(null);
      }),
      finalize(() => {
        this.loadIssues(Number(this.selectedJournalId));
        this.resetForm();
      })
    ).subscribe();
  }

  /**
   * CREATE Operation: Calls JournalPublicationsCrudOperation with ACTION_ADD_ISSUE.
   */
  addNewIssue(): void {
    const formValue = this.journalForm.value;
    const formData = new FormData();
    const journalId = this.currentJournalDetails.id?.toString() || '';

    // Append all fields required for creation
    formData.append('Action', 'Insert');
    formData.append('JournalId', journalId);
    formData.append('AuthorName', this.authors.join(', '));
    formData.append('JournalTitle', this.currentJournalDetails.journalTitle || '');
    formData.append('VolumeId', this.currentJournalDetails.volume || '');
    formData.append('PublishDate', formValue.PublishDate);
    formData.append('PageNo', formValue.PageNumber);
    formData.append('IssueTitle', formValue.IssueTitle);
    formData.append('IssueFileName', this.IssueFileName || '');
    formData.append('IssueFileData', this.IssueFileData || ''); // Base64 Data
    formData.append('IssueDescription', formValue.IssueDescription);
  
    this.journalWebApiService.JournalPublicationsCrudOperation(formData, 'Insert').pipe(
      tap((data) => {
        // Assuming API returns a structure like { item1: [{ returnData: N }] }
        const errorCode = data?.item1?.[0]?.['returnData'];
        if (errorCode > 0) {
          Swal.fire({ title: 'Success', text: 'Issues are uploaded successfully.', icon: 'success' });
        } else if (errorCode === -1) {
          Swal.fire({ title: 'Error', text: 'Max issues are already uploaded.', icon: 'error' });
        } else {
          Swal.fire({ title: 'Technical Issue', text: 'An unexpected error occurred.', icon: 'error' });
        }
      }),
      catchError(error => {
        console.error('API Error:', error);
        Swal.fire({ title: 'Error Occurred', text: 'Unable to complete the request. Please try again later.', icon: 'error' });
        return of(null);
      }),
      finalize(() => {
        this.loadIssues(Number(this.selectedJournalId));
        this.resetForm();
      })
    ).subscribe();
  }

  // ----------------------------------------------------------------------
  // Utility Functions (Author/File Handling)
  // ----------------------------------------------------------------------

  handleAuthorKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const value = this.authorInput.trim();
      if (value) {
        const splitAuthors = value.split(',').map(a => a.trim()).filter(a => a);
        this.authors.push(...splitAuthors);
        this.authors = [...new Set(this.authors)];
      }
      this.authorInput = '';
    }
  }

  removeAuthor(index: number): void {
    this.authors.splice(index, 1);
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Resolve only the Base64 content (after the comma in the data URL)
        resolve((reader.result as string).split(',')[1]);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async onFileSelectedIssueFile(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const file: File | null = (target.files as FileList)[0] || null;
    this.IssueFileData = null;
    this.IssueFileName = null;
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      await Swal.fire({ title: 'Invalid File Size', text: `File size exceeds ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`, icon: 'warning' });
      target.value = '';
      return;
    }

    try {
      this.IssueFileData = await this.readFileAsBase64(file);
      this.IssueFileName = file.name;
    } catch (e) {
      await Swal.fire({ title: 'File Read Error', text: 'Could not process the selected file.', icon: 'error' });
      target.value = '';
    }
  }










  // --- Search & Pagination ---
  searchTerm: string = '';
  pageSize: number = 10; // Items per page
  currentPage: number = 1;
  totalItems: number = 0;
  totalPages: number = 0;
  paginatedIssuesData: IssueApiItem[] = [];

  /**
   * Filters the main data array by searchTerm and then slices it for the current page.
   */
  private filterAndPaginate(): void {
    let filteredData = this.issuesData;
    const term = this.searchTerm.toLowerCase().trim();

    // 1. Filtering Logic
    if (term) {
      filteredData = filteredData.filter(issue =>
        issue.IssueTitle.toLowerCase().includes(term) ||
        issue.AuthorName.toLowerCase().includes(term) ||
        issue.PageNumber.toLowerCase().includes(term) ||
        issue.IssueDescription.toLowerCase().includes(term)
      );
    }

    this.totalItems = filteredData.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);

    // Reset current page if it becomes invalid after filtering/size change
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    } else if (this.currentPage === 0 && this.totalPages > 0) {
      this.currentPage = 1;
    } else if (this.totalPages === 0) {
      this.currentPage = 1;
    }

    // 2. Pagination Logic
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedIssuesData = filteredData.slice(startIndex, startIndex + this.pageSize);
  }

  /**
   * Handles page navigation buttons.
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterAndPaginate();
    }
  }

  /**
   * Triggered when the search box content or page size changes.
   */
  onSearchChange(): void {
    this.currentPage = 1; // Always reset to the first page on a new search/size change
    this.filterAndPaginate();
  }

    onSelectFileEditorX(fileUrl: string) {
    window.open('https://files.lpu.in/umsweb/Journal/' + fileUrl, '_blank');
  }


  onViewFile(filePath: string | null): void {
    if (filePath) {
      
      const fileUrl = `${this.ServerUrl}/${filePath}`;
      window.open(fileUrl, '_blank');
    } else {
      Swal.fire({ title: 'No File', text: 'No file path available for this issue.', icon: 'info' });
    }
  }

}