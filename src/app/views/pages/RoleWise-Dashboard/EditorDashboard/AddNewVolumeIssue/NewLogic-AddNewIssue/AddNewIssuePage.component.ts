import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs'
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-AddNewIssuePage',
  templateUrl: './AddNewIssuePage.component.html',
  styleUrls: ['./AddNewIssuePage.component.css']
})
export class AddNewIssuePageComponent implements OnInit {
  journalForm!: FormGroup;
  JournalIdString: any
  selectedFile: File | null = null;
  dataSource: any[] = []; dataX: any; booksData: any; dataShowing: any = false;
  userRole: any; BookId: any; JournalId: any; JournalTitle: any = ''; name: any;
  userId: any; serverUrl: any; supervisorName: any; departmentName: any;
  candidateName: any;

  Journals: any;
  LoginStatus: boolean | undefined;
  constructor(
    private fb: FormBuilder, private route: ActivatedRoute,
    private journalWebApiService: LpujournalbookService
  ) { }

  ngOnInit(): void {
    this.serverUrl = 'https://files.lpu.in/umsweb/Journal/';
    this.BookId = this.currentJournalId = this.route.snapshot.params['Id'];
    this.name = this.currentJournalTitle = this.route.snapshot.params['name'];
    this.LoadForm();
    this.loadJournals();
  }

  LoadForm() {
    this.journalForm = this.fb.group({
      IssueDescription: ['', Validators.required],
      PublishDate: ['', Validators.required],
      IssueTitle: ['', Validators.required],
      PageNumber: ['', Validators.required],
    });
  }
  journalListsData: any[] = [];
  isForm1Submitted: boolean = false; isSubmitted = false;

  get form1() {
    return this.journalForm.controls;
  }



  validateAuthor: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || value.trim() === '') {
      return { authorRequired: true }; // invalid
    }
    // For example, validate that the authors are comma separated non-empty names
    const authors = value.split(',').map((a: string) => a.trim());
    const allValid = authors.every((a: string) => a.length > 0);
    return allValid ? null : { invalidAuthorFormat: true };
  };

  // loadJournals() {
  //   this.isLoading = true;
  //   const minLoadingTime = 2500; // 2.5 seconds
  //   const startTime = Date.now();
  //   this.journalWebApiService.GetAllBooksDetails().pipe(
  //     finalize(() => {
  //       const elapsed = Date.now() - startTime;
  //       const remaining = Math.max(minLoadingTime - elapsed, 0);
  //       setTimeout(() => {
  //         this.isLoading = false;
  //       }, remaining);
  //     })
  //   ).subscribe({
  //     next: (dataX: any) => {
  //       this.dataSource = dataX.item1;
  //       this.journalListsData = dataX.item1;
  //       // console.info(JSON.stringify(this.journalListsData))

  //     },
  //     error: (error: any) => {
  //       this.dataShowing = false;
  //       console.error('Error fetching data', error);
  //       // this.LoginFalied();
  //     },
  //     complete: () => {
  //       this.dataShowing = true;
  //     }
  //   });
  // }

  loadJournals() {
    this.isLoading = true;
    const minLoadingTime = 2500; // 2.5 seconds
    const startTime = Date.now();
    this.journalWebApiService.GetAllBooksDetails().pipe(
      finalize(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(minLoadingTime - elapsed, 0);
        setTimeout(() => {
          this.isLoading = false;
        }, remaining);
      })
    ).subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.journalListsData = dataX.item1;
        this.setCurrentJournalValues();
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
  setCurrentJournalValues() {
    this.currentJournalVolume = null; // Default value if not found
    const filteredJournals = this.journalListsData.filter(j => j.id == this.BookId);
    this.currentJournalVolume = filteredJournals[0].volume; // Get the volume of the first matched journal

  }

  currentJournalId: any;
  currentJournalTitle: any;
  currentJournalVolume: any;
  setJournalId() {
    let idx = this.journalListsData.find(
      journal => journal.id == this.JournalTitle
    );
    this.currentJournalId = idx.id;
    this.JournalIdString = idx.journalId;
    this.currentJournalTitle = idx.journalTitle;
    this.currentJournalVolume = idx.volume;
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }


  IssueFileData: any = ''; IssueFileStatus: boolean = false;
  IssueFileName: any = '';
  onFileSelectedIssueFile(event: any): void {
    const reader = new FileReader();
    const target = event.target as HTMLInputElement;
    const file: File | null = (target.files as FileList)[0] || null;
    if (file && file.size > 3148576) {
      Swal.fire({
        title: 'File size exceeds 3MB. Please upload a smaller file.',
        text: 'Invalid File size',
        icon: 'warning'
      });
      target.value = '';
      return;
    }
    const fileNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (file && !fileNameRegex.test(file.name)) {
      const validFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

      const modifiedFile = new File([file], validFileName, { type: file.type });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(modifiedFile);
      target.files = dataTransfer.files;

      this.IssueFileData = modifiedFile;
      this.IssueFileStatus = true;

      reader.readAsDataURL(modifiedFile);
      reader.onload = () => {
        const ssss = reader.result as string;
        const ssssArray = ssss.split(',');
        this.IssueFileData = ssssArray[1];
        this.IssueFileName = validFileName;
      };

      return;
    }

    this.IssueFileData = file;
    this.IssueFileStatus = true;
    // alert(10);  
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const ssss = reader.result as string;
        const ssssArray = ssss.split(',');
        this.IssueFileData = ssssArray[1];
        this.IssueFileName = file.name;
      };
    }
    else {
      this.IssueFileName = ''; // Reset if no file is selected
      this.IssueFileData = null;
    }
  }

  isLoading: boolean = false;
  AuthorName: any;
  PageNumber: any;



  onSubmit(): void {
    if (this.journalForm.invalid) return;
    this.isLoading = true;
    const minLoadingTime = 2500; // 2.5 seconds
    const startTime = Date.now();
    const formData = new FormData();
    const formValue = this.journalForm.value;

    // this.AuthorName: 
    // for (const key in formValue) {
    //   if (formValue.hasOwnProperty(key)) {
    //     formData.append(key, formValue[key]);
    //   }
    // }

    formData.append('JournalId', this.currentJournalId);
    formData.append('AuthorName', this.authors.join(', '));
    formData.append('PageNumber', formValue.PageNumber);
    formData.append('JournalTitle', this.currentJournalTitle);
    formData.append('Volume', this.currentJournalVolume);
    formData.append('PublishDate', formValue.PublishDate);
    formData.append('IssueTitle', formValue.IssueTitle);
    formData.append('IssueFileName', this.IssueFileName);
    formData.append('IssueFileData', this.IssueFileData);
    formData.append('IssueDescription', formValue.IssueDescription);

    console.log('Submitting Form Data:');
    formData.forEach((value, key) => {
      console.log(key + ':', value);
    });

    this.journalWebApiService.AddNewIssuesDetails(formData)
      .pipe(
        finalize(() => {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(minLoadingTime - elapsed, 0);
          setTimeout(() => {
            this.isLoading = false;
          }, remaining);
        })
      )
      .subscribe({
        next: (data) => {
          // let result = data.item1[0]['returnData'];
          let errorCode = data.item1[0]['returnData'];

          if (errorCode > 0) {
            Swal.fire({
              title: 'Issues are uploaded successfully ',
              text: "",
              icon: 'success',
            }).then(() => {
              window.location.reload();
            });
          } else if (errorCode == -1) {
            Swal.fire({ title: 'Max issues are already uploaded', icon: 'error' }).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire({ title: 'Some Technical Issue', text: "", icon: 'error' }).then(() => {
              window.location.reload();
            });
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

  }



  authorInput: string = '';
  authors: string[] = [];
  showBadge: boolean = false;

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
}




