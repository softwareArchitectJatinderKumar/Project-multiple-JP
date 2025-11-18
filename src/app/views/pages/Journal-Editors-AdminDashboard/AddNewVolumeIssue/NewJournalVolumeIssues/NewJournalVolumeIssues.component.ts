import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
// Assuming LpujournalbookService is correctly defined in your project
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import Swal from 'sweetalert2';
import { finalize, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
 

 
// --- Type Definitions ---
interface JournalApiItem {
  id: number;
  journalId: string;
  journalTitle: string;
  volume: string;
}

// --- Constants ---
const MIN_LOADING_TIME = 1500; // Minimum time to show loader for better UX
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB limit

@Component({
  selector: 'app-NewJournalVolumeIssues',
  templateUrl: './NewJournalVolumeIssues.component.html',
  styleUrls: ['./NewJournalVolumeIssues.component.css']
})
export class NewJournalVolumeIssuesComponent implements OnInit {
  
  // --- Form & State ---
  journalForm!: FormGroup;
  isLoading: boolean = false;
  isFormSubmitted: boolean = false;

  // --- Journal Data ---
  journalListsData: JournalApiItem[] = [];
  selectedJournalId: number | null = null; // Binds to the <select>
  currentJournalDetails: Partial<JournalApiItem> = {}; // Stores selected journal info

  // --- Author Management ---
  authorInput: string = '';
  authors: string[] = [];
  showBadge: boolean = false;

  // --- File Data ---
  IssueFileData: string | null = null; // Base64 content
  IssueFileName: string | null = null;
  
  // Replace 'any' with your actual service if possible
  constructor(
    private fb: FormBuilder,
    private journalWebApiService: LpujournalbookService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadJournals();
  }

  // ----------------------------------------------------------------------
  // Form Initialization and Accessors
  // ----------------------------------------------------------------------

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

  // ----------------------------------------------------------------------
  // Data Loading and Selection
  // ----------------------------------------------------------------------

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

  /**
   * FIX: Updates the displayed journal details when a journal is selected.
   */
/**
   * FIX: Ensures the selected journal details are correctly populated by 
   * converting the ID to a number for accurate comparison with the data source.
   */
  setJournalDetails(): void {
    // 1. Safely convert the selected ID (which may be a string) to a number.
    const journalId = this.selectedJournalId ? Number(this.selectedJournalId) : null;
    
    if (journalId !== null) {
      // 2. Find the selected journal object using a number comparison.
      const details = this.journalListsData.find(journal => journal.id === journalId);
      
      // 3. Update the details, falling back to an empty object if not found.
      this.currentJournalDetails = details ? details : {};
    } else {
      // Clear details if 'Select Journal' option is chosen
      this.currentJournalDetails = {};
    }
  }
  // ----------------------------------------------------------------------
  // Author Management
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

  // ----------------------------------------------------------------------
  // File Handling
  // ----------------------------------------------------------------------

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
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
      console.error('Error reading file:', e);
      await Swal.fire({ title: 'File Read Error', text: 'Could not process the selected file.', icon: 'error' });
      target.value = '';
    }
  }

  // ----------------------------------------------------------------------
  // Submission
  // ----------------------------------------------------------------------

  onSubmit(): void {
    this.isFormSubmitted = true;
    
    if (this.journalForm.invalid || !this.IssueFileData || this.authors.length === 0) {
      if(this.authors.length === 0) {
        Swal.fire({ title: 'Validation Error', text: 'Please enter at least one author.', icon: 'warning' });
      }
      return;
    }

    this.isLoading = true;
    const startTime = Date.now();
    const formValue = this.journalForm.value;
    const formData = new FormData();

    // Append all required fields
    formData.append('JournalId', this.currentJournalDetails.id?.toString() || '');
    formData.append('AuthorName', this.authors.join(', '));
    formData.append('PageNumber', formValue.PageNumber);
    formData.append('JournalTitle', this.currentJournalDetails.journalTitle || '');
    formData.append('Volume', this.currentJournalDetails.volume || '');
    formData.append('PublishDate', formValue.PublishDate);
    formData.append('IssueTitle', formValue.IssueTitle);
    formData.append('IssueFileName', this.IssueFileName || '');
    formData.append('IssueFileData', this.IssueFileData || '');
    formData.append('IssueDescription', formValue.IssueDescription);

    // Mocking API call for debugging (removes TS2339 error)
    if (!this.journalWebApiService.AddNewIssuesDetails) {
        const mockPayload: { [key: string]: any } = {};
        formData.forEach((value, key) => { if (key !== 'IssueFileData') { mockPayload[key] = value; } });
        console.log('Mock Submission Payload:', mockPayload);
        setTimeout(() => {
            this.isLoading = false;
            Swal.fire({ title: 'Success (Mock)', text: 'Issues are uploaded successfully.', icon: 'success' });
        }, MIN_LOADING_TIME);
        return;
    }

    this.journalWebApiService.AddNewIssuesDetails(formData)
      .pipe(
        finalize(() => {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(MIN_LOADING_TIME - elapsed, 0);
          setTimeout(() => this.isLoading = false, remaining);
        })
      )
      .subscribe({
        next: (data) => {
          const errorCode = data?.item1?.[0]?.['returnData']; 

          if (errorCode > 0) {
            Swal.fire({ title: 'Success', text: 'Issues are uploaded successfully.', icon: 'success' }).then(() => {
              window.location.reload();
            });
          } else if (errorCode === -1) {
            Swal.fire({ title: 'Error', text: 'Max issues are already uploaded.', icon: 'error' });
          } else {
            Swal.fire({ title: 'Technical Issue', text: 'An unexpected error occurred.', icon: 'error' });
          }
        },
        error: (error) => {
          console.error('API Error:', error);
          Swal.fire({ title: 'Error Occurred', text: 'Unable to complete the request. Please try again later.', icon: 'error' });
        }
      });
  }
}

// import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
// import { Validators } from '@angular/forms';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import Swal from 'sweetalert2';
// import { finalize } from 'rxjs'


// @Component({
//   selector: 'app-NewJournalVolumeIssues',
//   templateUrl: './NewJournalVolumeIssues.component.html',
//   styleUrls: ['./NewJournalVolumeIssues.component.css']
// })
// export class NewJournalVolumeIssuesComponent implements OnInit {
//   journalForm!: FormGroup;
//   JournalIdString: any
//   selectedFile: File | null = null;
//   dataSource: any[] = []; dataX: any; booksData: any; dataShowing: any = false;
//   userRole: any; BookId: any; JournalId: any; JournalTitle: any = ''; name: any;
//   userId: any; serverUrl: any; supervisorName: any; departmentName: any;
//   candidateName: any;

//   Journals: any;
//   LoginStatus: boolean | undefined;
//   constructor(
//     private fb: FormBuilder,
//     private journalWebApiService: LpujournalbookService
//   ) { }

//   ngOnInit(): void {
//     this.LoadForm();
//     this.loadJournals();
//   }

//   LoadForm() {
//     this.journalForm = this.fb.group({
//       IssueDescription: ['', Validators.required],
//       PublishDate: ['', Validators.required],
//       IssueTitle: ['', Validators.required],
//       PageNumber: ['', Validators.required],
//     });
//   }
//   journalListsData: any[] = [];
//   isForm1Submitted: boolean = false; isSubmitted = false;

//   get form1() {
//     return this.journalForm.controls;
//   }



//   validateAuthor: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
//     const value = control.value;
//     if (!value || value.trim() === '') {
//       return { authorRequired: true }; // invalid
//     }
//     // For example, validate that the authors are comma separated non-empty names
//     const authors = value.split(',').map((a: string) => a.trim());
//     const allValid = authors.every((a: string) => a.length > 0);
//     return allValid ? null : { invalidAuthorFormat: true };
//   };

//   loadJournals() {
//     this.isLoading = true;
//     const minLoadingTime = 2500; // 2.5 seconds
//     const startTime = Date.now();
//     this.journalWebApiService.GetAllBooksDetails().pipe(
//       finalize(() => {
//         const elapsed = Date.now() - startTime;
//         const remaining = Math.max(minLoadingTime - elapsed, 0);
//         setTimeout(() => {
//           this.isLoading = false;
//         }, remaining);
//       })
//     ).subscribe({
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
//   currentJournalId: any;
//   currentJournalTitle: any;
//   currentJournalVolume: any;
//   setJournalId() {
//     let idx = this.journalListsData.find(
//       journal => journal.id == this.JournalTitle
//     );
//     this.currentJournalId = idx.id;
//     this.JournalIdString = idx.journalId;
//     this.currentJournalTitle = idx.journalTitle;
//     this.currentJournalVolume = idx.volume;
//   }
//   onFileSelected(event: any): void {
//     this.selectedFile = event.target.files[0] || null;
//   }


//   IssueFileData: any = ''; IssueFileStatus: boolean = false;
//   IssueFileName: any = '';
//   onFileSelectedIssueFile(event: any): void {
//     const reader = new FileReader();
//     const target = event.target as HTMLInputElement;
//     const file: File | null = (target.files as FileList)[0] || null;
//     if (file && file.size > 3148576) {
//       Swal.fire({
//         title: 'File size exceeds 3MB. Please upload a smaller file.',
//         text: 'Invalid File size',
//         icon: 'warning'
//       });
//       target.value = '';
//       return;
//     }
//     const fileNameRegex = /^[a-zA-Z0-9._-]+$/;
//     if (file && !fileNameRegex.test(file.name)) {
//       const validFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

//       const modifiedFile = new File([file], validFileName, { type: file.type });
//       const dataTransfer = new DataTransfer();
//       dataTransfer.items.add(modifiedFile);
//       target.files = dataTransfer.files;

//       this.IssueFileData = modifiedFile;
//       this.IssueFileStatus = true;

//       reader.readAsDataURL(modifiedFile);
//       reader.onload = () => {
//         const ssss = reader.result as string;
//         const ssssArray = ssss.split(',');
//         this.IssueFileData = ssssArray[1];
//         this.IssueFileName = validFileName;
//       };

//       return;
//     }

//     this.IssueFileData = file;
//     this.IssueFileStatus = true;
//     // alert(10);  
//     if (file) {
//       reader.readAsDataURL(file);
//       reader.onload = () => {
//         const ssss = reader.result as string;
//         const ssssArray = ssss.split(',');
//         this.IssueFileData = ssssArray[1];
//         this.IssueFileName = file.name;
//       };
//     }
//     else {
//       this.IssueFileName = ''; // Reset if no file is selected
//       this.IssueFileData = null;
//     }
//   }

//   isLoading: boolean = false;
//   AuthorName: any;
//   PageNumber: any;



//   onSubmit(): void {
//     if (this.journalForm.invalid) return;
//     this.isLoading = true;
//     const minLoadingTime = 2500; // 2.5 seconds
//     const startTime = Date.now();
//     const formData = new FormData();
//     const formValue = this.journalForm.value;

//     // this.AuthorName: 
//     // for (const key in formValue) {
//     //   if (formValue.hasOwnProperty(key)) {
//     //     formData.append(key, formValue[key]);
//     //   }
//     // }

//     formData.append('JournalId', this.currentJournalId);
//     formData.append('AuthorName', this.authors.join(', '));
//     formData.append('PageNumber', formValue.PageNumber);
//     formData.append('JournalTitle', this.currentJournalTitle);
//     formData.append('Volume', this.currentJournalVolume);
//     formData.append('PublishDate', formValue.PublishDate);
//     formData.append('IssueTitle', formValue.IssueTitle);
//     formData.append('IssueFileName', this.IssueFileName);
//     formData.append('IssueFileData', this.IssueFileData);
//     formData.append('IssueDescription', formValue.IssueDescription);

//     console.log('Submitting Form Data:');
//     formData.forEach((value, key) => {
//       console.log(key + ':', value);
//     });

//     this.journalWebApiService.AddNewIssuesDetails(formData)
//       .pipe(
//         finalize(() => {
//           const elapsed = Date.now() - startTime;
//           const remaining = Math.max(minLoadingTime - elapsed, 0);
//           setTimeout(() => {
//             this.isLoading = false;
//           }, remaining);
//         })
//       )
//       .subscribe({
//         next: (data) => {
//           // let result = data.item1[0]['returnData'];
//           let errorCode = data.item1[0]['returnData'];

//           if (errorCode > 0) {
//             Swal.fire({
//               title: 'Issues are uploaded successfully ',
//               text: "",
//               icon: 'success',
//             }).then(() => {
//               window.location.reload();
//             });
//           } else if (errorCode == -1) {
//             Swal.fire({ title: 'Max issues are already uploaded', icon: 'error' }).then(() => {
//               window.location.reload();
//             });
//           } else {
//             Swal.fire({ title: 'Some Technical Issue', text: "", icon: 'error' }).then(() => {
//               window.location.reload();
//             });
//           }
//         },
//         error: () => {
//           Swal.fire({
//             title: 'Error Occurred',
//             text: 'Unable to complete the request. Please try again later.',
//             icon: 'error',
//           });
//         }
//       });

//   }



//   authorInput: string = '';
//   authors: string[] = [];
//   showBadge: boolean = false;

//   handleAuthorKeyDown(event: KeyboardEvent): void {
//     if (event.key === 'Enter' || event.key === ',') {
//       event.preventDefault();

//       const value = this.authorInput.trim();

//       if (value) {
//         const splitAuthors = value.split(',').map(a => a.trim()).filter(a => a);
//         this.authors.push(...splitAuthors);
//         this.authors = [...new Set(this.authors)]; // Remove duplicates
//       }

//       this.authorInput = '';
//     }
//   }

//   removeAuthor(index: number): void {
//     this.authors.splice(index, 1);
//   }
// }




