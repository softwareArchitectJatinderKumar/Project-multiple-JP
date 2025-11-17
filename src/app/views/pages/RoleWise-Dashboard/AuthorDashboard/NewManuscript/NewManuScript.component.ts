import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';  
import * as mammoth from 'mammoth';  
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { AbstractControl, FormControl, FormGroup, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { Validators } from '@angular/forms';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-NewManuScript',
  templateUrl: './NewManuScript.component.html',
  styleUrls: ['./NewManuScript.component.scss']  ,standalone: false
})
export class NewManuScript implements OnInit {
  emailId: any = ''; candidateName: any; supervisorName: any; mobileNumber: any; instituteName: any;
  departmentName: any; idProofType: any = 'select'; idProofNumber: any; address: any; password: any; confirmPassword: any; userRole: any = 'select';
  cifUserForm!: FormGroup; isForm1Submitted: boolean = false; IdProofFileName: string | null = null; IdProofFile: string | null = null;
  sessionData: any[] = []; BookId: any; data: any[] = []; bookData: any; JournalDetails: any; detailsArray: any;
  fileStatus: boolean = false; fileName: any; errorMessage: any; isLoginFailed: boolean = false; FileData: any; array: any[] = [];
  fileData: File | null = null; JournalId: any = ''; JournalTitle: any = ''; formBuilder: any; form1: any; Description: any;
  JournalSubTitle: any; selectedFiles: File[] = [];
  ManuScriptTypes = [
    { ManuScriptId: 1, ManuScriptType: 'Research Paper' },
    { ManuScriptId: 2, ManuScriptType: 'Review Paper' },
    { ManuScriptId: 3, ManuScriptType: 'Short Communication' },
    { ManuScriptId: 4, ManuScriptType: 'Specialised Paper' }
  ];
  SubmissionTypes = [
    { SubmissionTypeId: 1, SubmissionType: 'Manuscript' },
    { SubmissionTypeId: 2, SubmissionType: 'Revised' },
  ];
  SubItemType = [
    { SubmissionTypeId: 1, SubItemType: 'Cover Letter' },
    { SubmissionTypeId: 2, SubItemType: 'Title Page' },
    { SubmissionTypeId: 3, SubItemType: 'Highlights' },
    { SubmissionTypeId: 4, SubItemType: 'Manuscript File' },
    { SubmissionTypeId: 5, SubItemType: 'Table' },
    { SubmissionTypeId: 6, SubItemType: 'Figures' },
    { SubmissionTypeId: 7, SubItemType: 'Supplementary Material' },
    { SubmissionTypeId: 8, SubItemType: 'Conflicts of Intense' },
    { SubmissionTypeId: 9, SubItemType: 'Response to Reviewer' },
  ];
  cartItems: any[] = [];
  showAddToCartButton: boolean = true;

  userId: any;
  EditorInChief: any;
  dataLoaded: boolean = false;
  UserRolesData: any;
  Reason: any;


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
  ManuScriptUploadForm!: FormGroup; selectedFile: File | null = null; fileError: string | null = null; fromDate: any; booksDataColumns: any;
  toDate: any; pipe = new DatePipe('en-CA'); dataSource: any[] = []; dataX: any; booksData: any; dataShowing: any = false;

  VisitUrl(Id: any, name: any, Sufix: any) {
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix);
  }
  isEditor: boolean = false; isReviewer: boolean = false; isAuthor: boolean = false; isOther: boolean = false;
  isGuest: boolean = false; newJournalTitle: any; LoginStatus: any;
  UserRoles: any; name: any;
  ngOnInit(): void {
    const bookId: any = this.BookId = this.route.snapshot.params['Id'];
    const name: any = this.name = this.route.snapshot.params['name'];
    this.newJournalTitle = name.replace(/-/g, ' ');

    this.LoginStatus = this.checkUserLogin();

    // alert(bookId+name+'ExternalLogin');
    if (bookId && !this.isLoginFailed) {
      this.BookId = bookId; this.JournalId = bookId;
      this.JournalTitle = name.replace(/-/g, ' ');
      this.GetJournalDetailsAbout(this.BookId)
      // this.showReviewerData(this.userId);


    } else {

      this.VisitUrl(this.BookId, this.name, 'RolewiseLogin');
    }

    this.LoadForm();
  }

  LoadForm() {
    this.ManuScriptUploadForm = this.fb.group({
      journalTitle: [this.JournalTitle],
      journalId: [this.JournalId],
      ManuScriptType: ['Select', Validators.required],
      SubmissionType: ['Select', Validators.required],
      SubItemType: ['Select'],
      // description: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  checkUserLogin() { 
    const GetCookieData = this.cookieService.get('authData');
    if (GetCookieData) {
      try {
        const retrievedCookies = JSON.parse(GetCookieData);
        this.userRole = retrievedCookies.UserRole?.length > 0 ? retrievedCookies.UserRole : -1;
        this.userId = retrievedCookies.EmailId;
        let Token = retrievedCookies.AccessToken;
        this.supervisorName = retrievedCookies.SupervisorName;
        this.departmentName = retrievedCookies.DepartmentName;
        this.candidateName = retrievedCookies.CandidateName;
        this.isLoginFailed = false;
      } catch (error) {
        console.log("error");
      }
    } else {
      this.LoginFalied();

    }

  }

  LoginFalied() {
    this.VisitUrl(this.BookId, this.name, 'ExternalLogin');
  }

  AuthorEmailId: any;
  GetJournalDetailsAbout(JournalId: any): void {
    this.journalWebApiService.GetJournalDetailsforAboutPage(JournalId).subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.bookData = response.item1[0];
        this.JournalDetails = this.bookData['journalDetails']
        this.EditorInChief = this.bookData?.editorName
        this.AuthorEmailId = this.bookData?.authorEmailId
        this.JournalSubTitle = this.bookData?.subTitle;
        this.extractDetails();
      }
      else {
        this.bookData = [];
        this.LoginFalied();
      }
    });
  }

  
  NewIdForJournal: any;
  extractDetails() {
    const items = this.JournalDetails.split('#').map((item: string) => item.trim());

    this.detailsArray = items.map((item: { split: (arg0: string) => { (): any; new(): any; map: { (arg0: (part: any) => any): [any, any]; new(): any; }; }; }) => {
      const [key, value] = item.split(':').map(part => part.trim());

      // Handle specific cases for abbreviations to avoid unwanted spacing
      let formattedKey;
      if (key === 'Journal Id') {
        // alert(value+"== Journal New Id")
        this.NewIdForJournal = value;
      } else {
        // Add space before uppercase letters and numbers, except the first character
        formattedKey = key.replace(/([A-Z0-9])/g, ' $1').trim();
      }

      return { key: formattedKey, value };
    });

    // console.log("Details: " + JSON.stringify(this.detailsArray));
  }


  

  onSubmit() {
    if (this.ManuScriptUploadForm.valid) {
      this.cartItems.push(this.ManuScriptUploadForm.value);  // Add to cart
      this.ManuScriptUploadForm.reset();  // Reset the form after adding
      this.LoadForm();
      this.showAddToCartButton = false;  // Show the "Save All" button after adding
      // console.log(JSON.stringify(this.cartItems))
    }
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);  // Remove item from cart
  }
  resetForm() {
    this.ManuScriptUploadForm.reset(); // Reset the form values
    this.selectedFile = null; // Reset the selected file
    this.fileError = null; // Clear any error message
    this.FileData = null;
  }


  // coded on 28-jan-25
  submissionType: string = ''; // Default value
  onSubmissionTypeChange(event: any): void {
    // Get the selected submission type
    this.submissionType = event.target.value;
  }

  getFileName(filePath: string): string {
    // Extract the file name from the full file path
    return filePath.split('\\').pop()?.split('/').pop() || '';
  }

  // 30-Jan-25 changes
  AllManuScriptType: any;
  AllSubItemTypes: any;
  AllSubmissionTypes: any;
  selectedOption: string = 'zip';

  
  onFileSelected(event: any): void {
    const reader = new FileReader();
    const target = event.target as HTMLInputElement;
    const file: File | null = (target.files as FileList)[0] || null;
    if (file) {
      if (file.size > 54991576) {
        Swal.fire({
          title: 'File size exceeds 25MB. Please upload a smaller file.',
          text: 'Invalid File size',
          icon: 'warning'
        });
        target.value = '';
        this.fileData = null;
        this.fileStatus = false;
        return;
      }

      const fileNameRegex = /^[a-zA-Z0-9._-]+$/;
      if (!fileNameRegex.test(file.name)) {
        const validFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const modifiedFile = new File([file], validFileName, { type: file.type });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(modifiedFile);
        target.files = dataTransfer.files;
        this.fileData = modifiedFile;
        this.fileName = validFileName;
      } else {
        this.fileData = file;
        this.fileName = file.name;
      }

      reader.readAsDataURL(this.fileData);
      reader.onload = () => {
        const result = reader.result as string;
        const resultArray = result.split(',');
        this.FileData = resultArray[1];
        this.fileStatus = true;
      };

      this.selectedFiles.push(file);
    } else {
      this.fileData = null;
      this.fileStatus = false;
    }

  }


  
  generatedFile: Blob | null = null; // Store generated file data
  generateZip() {
    // if (this.selectedOption == 'zip') {
    const zip = new JSZip();

    this.selectedFiles.forEach(file => {
      zip.file(file.name, file);
    });
    zip.generateAsync({ type: 'blob' }).then(content => {
      this.generatedFile = content; // Store zip file in variable
      saveAs(content, 'merged-files.zip');
    });
  }
isLoading: any=false;
  uploadFile() {
    this.isLoading = true; // Show loader
  
    const reader = new FileReader();
    const fileName = 'merged-files.zip';
  
    if (this.generatedFile) {
      if (this.generatedFile.size > 54991576) {
        this.isLoading = false;
        Swal.fire({
          title: 'File size exceeds 50MB. Please upload a smaller file.',
          text: 'Invalid File size',
          icon: 'warning'
        });
        this.fileData = null;
        this.fileStatus = false;
        return;
      }
  
      reader.readAsDataURL(this.generatedFile);
      reader.onload = () => {
        const result = reader.result as string;
        const resultArray = result.split(',');
        this.FileData = resultArray[1];
        this.fileStatus = true;
      };
    } else {
      this.fileData = null;
      this.fileStatus = false;
    }
  
    if (!Array.isArray(this.cartItems) || this.cartItems.length === 0) {
      this.isLoading = false;
      Swal.fire({
        title: 'Cart is Empty',
        text: 'Please add at least one manuscript before uploading.',
        icon: 'warning'
      });
      return;
    }
  
    // Prepare submission data
    if (this.cartItems.length === 1) {
      const item = this.cartItems[0];
      this.AllManuScriptType = item.ManuScriptType || 'NA';
      this.AllSubItemTypes = item.SubItemType === 'Select' ? 'NA' : item.SubItemType;
      this.AllSubmissionTypes = item.SubmissionType || 'NA';
    } else {
      this.AllManuScriptType = this.cartItems.map(item => item.ManuScriptType || 'NA').join(',');
      this.AllSubItemTypes = this.cartItems.map(item => item.SubItemType === 'Select' ? 'NA' : item.SubItemType).join(',');
      this.AllSubmissionTypes = this.cartItems.map(item => item.SubmissionType || 'NA').join(',');
    }
  
    const formData = new FormData();
    formData.append('JournalId', this.JournalId);
    formData.append('JournalTitle', this.JournalTitle);
    formData.append('ManuScriptType', this.AllManuScriptType);
    formData.append('SubmissionType', this.AllSubmissionTypes);
    formData.append('SubItemType', this.AllSubItemTypes);
    formData.append('UserId', this.userId);
    formData.append('EditorInchief', this.EditorInChief);
    formData.append('FileUrl', fileName);
    formData.append('AuthorEmailId', this.AuthorEmailId);
    formData.append('Filex', this.generatedFile!, fileName);
    formData.append('File', this.FileData);
  
    this.journalWebApiService.AddNewJournalMenuScriptData(formData).subscribe({
      next: (data) => {
        this.isLoading = false;
  
        let result = data.item1[0]['msg'];
        let errorCode = data.item1[0]['returnId'];
  
        if (result === 'OK') {
          Swal.fire({
            title: 'Manuscripts Uploaded Successfully',
            text: 'Your manuscripts have been saved successfully.',
            icon: 'success',
          }).then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire({
            title: 'Some Technical Issue',
            icon: 'error',
          }).then(() => {
            window.location.reload();
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
  
        Swal.fire({
          title: 'Error Occurred',
          text: 'Unable to complete the request. Please try again later.',
          icon: 'error',
        });
      }
    });
  
    this.ManuScriptUploadForm.reset(); // Reset the form after upload
  }
  

  
  // uploadFile() {
  //   const reader = new FileReader();
  //   const fileName = 'merged-files.zip';

  //   if (this.generatedFile) {
  //     if (this.generatedFile.size > 54991576) {
  //       Swal.fire({
  //         title: 'File size exceeds 50MB. Please upload a smaller file.',
  //         text: 'Invalid File size',
  //         icon: 'warning'
  //       });
  //       this.fileData = null;
  //       this.fileStatus = false;
  //       return;
  //     }

  //     reader.readAsDataURL(this.generatedFile);
  //     reader.onload = () => {
  //       const result = reader.result as string;
  //       const resultArray = result.split(',');
  //       this.FileData = resultArray[1];
  //       this.fileStatus = true;
  //     };
  //   } else {
  //     this.fileData = null;
  //     this.fileStatus = false;
  //   }

  //   if (!Array.isArray(this.cartItems) || this.cartItems.length === 0) {
  //     Swal.fire({
  //       title: 'Cart is Empty',
  //       text: 'Please add at least one manuscript before uploading.',
  //       icon: 'warning'
  //     });
  //     return;
  //   }

  //   if (this.cartItems.length === 1) {
  //     const item = this.cartItems[0];

  //     this.AllManuScriptType = item.ManuScriptType || 'NA';
  //     this.AllSubItemTypes = item.SubItemType === 'Select' ? 'NA' : item.SubItemType;
  //     this.AllSubmissionTypes = item.SubmissionType || 'NA';
  //   } else {
  //     this.AllManuScriptType = this.cartItems.map(item => item.ManuScriptType || 'NA').join(',');
  //     this.AllSubItemTypes = this.cartItems.map(item => item.SubItemType === 'Select' ? 'NA' : item.SubItemType).join(',');
  //     this.AllSubmissionTypes = this.cartItems.map(item => item.SubmissionType || 'NA').join(',');
  //   }

  //   const formData = new FormData();
  //   formData.append('JournalId', this.JournalId);
  //   formData.append('JournalTitle', this.JournalTitle);
  //   formData.append('ManuScriptType', this.AllManuScriptType);
  //   formData.append('SubmissionType', this.AllSubmissionTypes);
  //   formData.append('SubItemType', this.AllSubItemTypes);
  //   formData.append('UserId', this.userId);
  //   formData.append('EditorInchief', this.EditorInChief);
  //   formData.append('FileUrl', fileName);
  //   formData.append('AuthorEmailId', this.AuthorEmailId);
  //   formData.append('Filex', this.generatedFile!, fileName);
  //   formData.append('File', this.FileData);

  //   //   Call the API for Email Sending
  //   this.journalWebApiService.AddNewJournalMenuScriptData(formData).subscribe({
  //     next: (data) => {
  //       let result = data.item1[0]['msg'];
  //       let errorCode = data.item1[0]['returnId'];

  //       if (result === 'OK') {
  //         //   Send email after successful upload
  //         // this.sendEmailNotification(this.userId);

  //         Swal.fire({
  //           title: 'Manuscripts Uploaded Successfully',
  //           text: 'Your manuscripts have been saved successfully.',
  //           icon: 'success',
  //         }).then(() => {
  //           window.location.reload();
  //         });
  //       } else {
  //         Swal.fire({
  //           title: 'Some Technical Issue',
  //           // text: 'error',
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

  //   this.ManuScriptUploadForm.reset(); // Reset the form after upload
  // }
  
  showReviewerData(Emailid: any) {
    this.journalWebApiService.GetMenuScriptForReviewers(Emailid).subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.dataLoaded = true;
        // this.ReviewerData = dataX.item1;
        // // alert("ALL ReviewerData  Data" + JSON.stringify(this.ReviewerData))
        // // console.log("ALL ReviewerData  Data" + JSON.stringify(this.ReviewerData))
        // if (this.ReviewerData.length > 0) {
        //   this.ReviewerDataColumns = Object.keys(this.ReviewerData[0]);
        //   this.calculateTotalPagesReviewer();
        //   this.updatePaginatedDataReviewer();
        // }
        // this.dataShowing = true;
        // this.showEditorData(this.BookId);

        // this.loadReviewers(this.BookId);
        // this.GetJournalDetailsAbout(this.BookId);
        // this.showData();
        // this.getUserRolesforId();

      },
      error: (error: any) => {
        this.dataShowing = false;
        console.error('Error fetching data', error);
        this.LoginFalied();
      },
      complete: () => {
        this.dataShowing = true;
        // console.log('Data fetching complete');
      }
    });
  }
}