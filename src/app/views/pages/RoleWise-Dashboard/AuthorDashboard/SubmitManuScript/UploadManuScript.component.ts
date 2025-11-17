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
  selector: 'app-UploadManuScript-page',
  templateUrl: './UploadManuScript.component.html',
  styleUrls: ['./UploadManuScript.component.scss'],standalone: false
})
export class UploadManuScriptComponent implements OnInit {
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
  scriptUploadForm!: FormGroup; selectedFile: File | null = null; fileError: string | null = null; fromDate: any; booksDataColumns: any;
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

      this.showReviewerData(this.userId);


    } else {

      this.VisitUrl(this.BookId, this.name, 'ExternalLogin');
    }

    this.LoadForm();
  }

  LoadForm() {
    this.scriptUploadForm = this.fb.group({
      journalTitle: [this.JournalTitle],
      journalId: [this.JournalId],
      ManuScriptType: ['Select', Validators.required],
      SubmissionType: ['Select', Validators.required],
      SubItemType: ['Select'],
      // description: ['', Validators.required],
      file: [null, Validators.required]
    });
  }
  UserRolesArray: { value: string; label: string; id: string }[] = [];

  getUserRolesforId(): void {
    const roleMapping: Record<string, string> = {
      '0': 'Editor',
      '1': 'Author/ Submit Manuscript',
      '2': 'Reviewer',
      '3': 'Publisher'
    };

    this.journalWebApiService.GetUserRolesforUser(this.userId).subscribe({
      next: (response) => {
        if (response?.item1?.length > 0) {
          this.UserRolesData = response.item1[0];

          let roles = this.UserRolesData?.userRole
            ? this.UserRolesData.userRole.split(',').map((r: string) => r.trim())
            : [];

          // Always include '1' (Author) if it's not already present
          if (!roles.includes('1')) {
            roles.push('1');
          }

          this.UserRolesArray = roles.map((role: string) => {
            const roleKey = role;
            const label = roleMapping[roleKey] || roleKey;

            return {
              value: roleKey,
              label,
              id: label.replace(/\s+/g, '')
            };
          });
        } else {
          // If no roles found, default to Author role
          this.UserRolesArray = [{
            value: '1',
            label: roleMapping['1'],
            id: roleMapping['1'].replace(/\s+/g, '')
          }];
        }
      },
      error: (err) => {
        console.error('Error fetching user roles:', err);

        // On error, default to Author role
        this.UserRolesArray = [{
          value: '1',
          label: roleMapping['1'],
          id: roleMapping['1'].replace(/\s+/g, '')
        }];
        this.LoginFalied();
      }
    });
  }

  // getUserRolesforId(): void {
  //   const roleMapping: Record<string, string> = {
  //     '0': 'Editor',
  //     '1': 'Author/ Submit Manuscript',
  //     '2': 'Reviewer',
  //     '3': 'Publisher'
  //   };

  //   this.journalWebApiService.GetUserRolesforUser(this.userId).subscribe({
  //     next: (response) => {
  //       if (response?.item1?.length > 0) {
  //         this.UserRolesData = response.item1[0];

  //         // Ensure userRole exists before splitting
  //         const roles = this.UserRolesData?.userRole ? this.UserRolesData.userRole.split(',') : [];

  //         this.UserRolesArray = roles.map((role: any) => {
  //           const roleKey = String(role); // Ensure role is a string
  //           const label = roleMapping[roleKey] || roleKey; // Use mapped label or fallback to role itself

  //           return {
  //             value: roleKey,
  //             label,
  //             id: label.replace(/\s+/g, '') // Safe to call replace() now
  //           };
  //         });
  //       } else {
  //         this.UserRolesArray = []; // Reset array if no roles found
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching user roles:', err);
  //       this.UserRolesArray = []; // Reset array on error
  //       this.LoginFalied();
  //     }
  //   });
  // }
  LoginFalied() {
    this.VisitUrl(this.BookId, this.name, 'ExternalLogin');
  }
  checkUserLogin() {
    // this.userRole = 'Editor in Chief';
    // this.userId = 'testcase.user3@gmail.com';
    // this.supervisorName = 'Test case';
    // this.departmentName = 'Test Department';
    // this.candidateName = 'Test User Kumar';
    // return true;
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

  GetJournalDetailsAbout(JournalId: any): void {
    this.journalWebApiService.GetJournalDetailsforAboutPage(JournalId).subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.bookData = response.item1[0];
        this.JournalDetails = this.bookData['journalDetails']
        this.EditorInChief = this.bookData?.editorName
        this.JournalSubTitle = this.bookData?.subTitle;
        this.extractDetails();
      }
      else {
        this.bookData = [];
        this.LoginFalied();
      }
    });
  }


  showData() {
    this.journalWebApiService.GetAllBooksDetails().subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.dataLoaded = true;
        this.booksData = dataX.item1;
        if (this.booksData.length > 0) {
          this.booksDataColumns = Object.keys(this.booksData[0]);
        }
        this.dataShowing = true;

      },
      error: (error: any) => {

        this.dataShowing = false;
        this.LoginFalied();
      },
      complete: () => {
        this.dataShowing = true;
      }
    });
  }

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


  onSubmit() {
    if (this.scriptUploadForm.valid) {
      this.cartItems.push(this.scriptUploadForm.value);  // Add to cart
      this.scriptUploadForm.reset();  // Reset the form after adding
      this.LoadForm();
      this.showAddToCartButton = false;  // Show the "Save All" button after adding
      // console.log(JSON.stringify(this.cartItems))
    }
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);  // Remove item from cart
  }
  resetForm() {
    this.scriptUploadForm.reset(); // Reset the form values
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
  // uploadFile() {
  //   const reader = new FileReader();
  //   const fileName = 'merged-files.zip';
  //     if (this.generatedFile) {
  //       if (this.generatedFile.size > 54991576) {
  //         Swal.fire({
  //           title: 'File size exceeds 50MB. Please upload a smaller file.',
  //           text: 'Invalid File size',
  //           icon: 'warning'
  //         });
  //         this.fileData = null;
  //         this.fileStatus = false;
  //         return;
  //       }

  //       reader.readAsDataURL(this.generatedFile);
  //       reader.onload = () => {
  //         const result = reader.result as string;
  //         const resultArray = result.split(',');
  //         this.FileData = resultArray[1];
  //         this.fileStatus = true;
  //       };
  //     } else {
  //       this.fileData = null;
  //       this.fileStatus = false;
  //     }
  //   // Initialize the variables as empty strings
  //   this.AllManuScriptType = "";        this.AllSubItemTypes = "";    this.AllSubmissionTypes = "";  
  //   // Populate the variables with concatenated values
  //   this.cartItems.forEach(item => {
  //     this.AllManuScriptType += item.ManuScriptType + ',';
  //     this.AllSubItemTypes += item.SubItemType=='Select'? 'NA' :item.SubItemType + ',';
  //     this.AllSubmissionTypes += item.SubmissionType + ',';
  //   });

  //   // Remove the trailing comma (optional for cleaner data)
  //   this.AllManuScriptType = this.AllManuScriptType.replace(/,$/, '');
  //   this.AllSubItemTypes = this.AllSubItemTypes.replace(/,$/, '');
  //   this.AllSubmissionTypes = this.AllSubmissionTypes.replace(/,$/, '');

  //   // Create the FormData object
  //   const formData = new FormData();
  //   formData.append('JournalId', this.JournalId);
  //   formData.append('JournalTitle', this.JournalTitle);
  //   formData.append('ManuScriptType', this.AllManuScriptType);
  //   formData.append('SubmissionType', this.AllSubmissionTypes);
  //   formData.append('SubItemType', this.AllSubItemTypes);
  //   formData.append('UserId', this.userId);
  //   formData.append('EditorInchief', this.EditorInChief);
  //   formData.append('FileUrl', fileName);
  //   formData.append('File', this.FileData);

  //   // Call the API
  //   this.journalWebApiService.AddNewJournalMenuScriptData(formData).subscribe({
  //     next: (data) => {
  //       let result = data.item1[0]['msg'];
  //       let errorCode = data.item1[0]['returnId'];

  //       if (result === 'OK') {
  //         Swal.fire({
  //           title: 'Manuscripts are Uploaded and Saved Successfully',
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
  //   this.scriptUploadForm.reset();  // Reset the form after adding
  // }




  uploadFile() {
    const reader = new FileReader();
    const fileName = 'merged-files.zip';

    if (this.generatedFile) {
      if (this.generatedFile.size > 54991576) {
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
      Swal.fire({
        title: 'Cart is Empty',
        text: 'Please add at least one manuscript before uploading.',
        icon: 'warning'
      });
      return;
    }

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
    // formData.append('File', this.generatedFile!, fileName);
    formData.append('Filex', this.generatedFile!, fileName);
    formData.append('File', this.FileData);

    //   Call the API for Email Sending
    this.journalWebApiService.AddNewJournalMenuScriptData(formData).subscribe({
      next: (data) => {
        let result = data.item1[0]['msg'];
        let errorCode = data.item1[0]['returnId'];

        if (result === 'OK') {
          //   Send email after successful upload
          // this.sendEmailNotification(this.userId);

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
            // text: 'error',
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

    this.scriptUploadForm.reset(); // Reset the form after upload
  }

  //   New function to send an email notification
  // sendEmailNotification(userId: string) {
  //   const emailPayload = {
  //     userId: userId,
  //     subject: 'Manuscript Upload Confirmation',
  //     body: 'Your manuscripts have been uploaded successfully.'
  //   };

  //   this.journalWebApiService.sendEmail(emailPayload).subscribe({
  //     next: () => console.log('Email sent successfully'),
  //     error: (err) => console.error('Error sending email', err)
  //   });
  // }


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
  //  For Reviewer  Logic

  displayedColumns: string[] = [
    // 'journalId',
    'journalTitle',
    'editorInChief',
    'manuScriptType',
    // 'submissionType',
    'fileUrl',
    'journalId'
  ];
  displayedColumnsHeader: string[] = [
    // 'journalId',
    'Journal Title',
    'Editor In Chief',
    'ManuScript Type',
    // 'Submission Type',
    'Download File',
    'Action'
  ];

  ReviewerData: any;
  ReviewerDataColumns: any;

  ReviewerdisplayedColumns: string[] = [
    // 'journalId',	id,			JournalId,			JournalTitle,			MenuScriptType,			SubmissionType,		FileUrl,			EditorInchief	, CreatedBy , UserId as RequestedBy , UpdatedBy as AssignedBy
    'journalTitle',
    'editorInChief',
    'manuScriptType',
    'requestedBy',
    // 'assignedBy',
    // 'submissionType',
    'fileUrl',
    'journalId'
  ];

  ReviewerdisplayedColumnsHeader: string[] = [
    // 'journalId',
    'Journal Title',
    'Editor In Chief',
    'Manu Script',
    'Requested By',
    // 'Assigned By',
    // 'Submission Type',
    'Download File',
    'Action'
  ];

  ReviewercolumnHeaders: { [key: string]: string } = {
    journalTitle: 'Journal Title',
    editorInChief: 'Author Name',
    manuScriptType: 'Manuscript Type',
    requestedBy: 'Requested By',
    // editorInChief: 'Assigned By',
    // submissionType: 'Submitted Script ', 
    fileUrl: 'Document',
    journalId: 'Action'
  }; // Custom header text journalTitle	editorInChief	ManuScriptType	submissionType



  showReviewerData(Emailid: any) {
    this.journalWebApiService.GetMenuScriptForReviewers(Emailid).subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.dataLoaded = true;
        this.ReviewerData = dataX.item1;
        // alert("ALL ReviewerData  Data" + JSON.stringify(this.ReviewerData))
        // console.log("ALL ReviewerData  Data" + JSON.stringify(this.ReviewerData))
        if (this.ReviewerData.length > 0) {
          this.ReviewerDataColumns = Object.keys(this.ReviewerData[0]);
          this.calculateTotalPagesReviewer();
          this.updatePaginatedDataReviewer();
        }
        this.dataShowing = true;
        this.showEditorData(this.BookId);

        this.loadReviewers(this.BookId);
        this.GetJournalDetailsAbout(this.BookId);
        this.showData();
        this.getUserRolesforId();

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
  onSelectFileX(a: any) {
    let aa = a;
    window.open('https://files.lpu.in/umsweb/Journal/' + aa, '_blank');
  }

  currentPageReviewer: number = 1;
  pageSizeReviewer: number = 10;
  paginatedReviewerData: any[] = [];
  totalPagesReviewer: number = 1;



  calculateTotalPagesReviewer() {
    this.totalPagesReviewer = Math.ceil(this.ReviewerData.length / this.pageSizeReviewer);
  }

  updatePaginatedDataReviewer() {
    const startIndex = (this.currentPageReviewer - 1) * this.pageSizeReviewer;
    this.paginatedReviewerData = this.ReviewerData.slice(startIndex, startIndex + this.pageSizeReviewer);
  }

  nextPageReviewer() {
    if (this.currentPageReviewer < this.totalPagesReviewer) {
      this.currentPageReviewer++;
      this.updatePaginatedDataReviewer();
    }
  }

  previousPageReviewer() {
    if (this.currentPageReviewer > 1) {
      this.currentPageReviewer--;
      this.updatePaginatedDataReviewer();
    }
  }

  // 25-feb-25


  reviewForm = {
    recommendation: 'Minor Revisions',
    rating: 0,
    commentsToEditor: '',
    commentsToAuthor: '',
    transferAuthorization: 'No',
    approvalAction: 'Select',
    questions: [
      {
        text: 'The subject addressed in this article is worthy of investigation',
        options: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
        answer: 'Agree'
      },
      {
        text: 'The information presented is new',
        options: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
        answer: 'Agree'
      },
      {
        text: 'The conclusions are supported by the data',
        options: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
        answer: 'Agree'
      },
      {
        text: 'The manuscript is appropriate for the journal',
        options: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
        answer: 'Agree'
      },
      {
        text: 'Organization of the manuscript is appropriate',
        options: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
        answer: 'Agree'
      },
      {
        text: 'Figures, tables, and supplementary data are appropriate',
        options: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
        answer: 'Agree'
      },

    ]
  };

  onTakeAction2(rowData: any) {
    console.log('Taking action on journal:', JSON.stringify(rowData));
  }

  submitReviewerForm() {
    alert(`
      Reviewer Recommendation: ${this.reviewForm.recommendation}
      Overall Rating: ${this.reviewForm.rating}
      Comments to Editor: ${this.reviewForm.commentsToEditor}
      Comments to Author: ${this.reviewForm.commentsToAuthor}
      Approval Action: ${this.reviewForm.approvalAction}
      Answers: ${this.reviewForm.questions.map(q => `${q.text}: ${q.answer}`).join('\n')}
    `);

    const formData = new FormData();

    // Append form data to the FormData object
    formData.append('journalId', this.JournalId);
    formData.append('emailId', this.userId);
    formData.append('reviewerTerm', this.reviewForm.recommendation);
    formData.append('overallRating', this.reviewForm.rating.toString());
    formData.append('transferResponse', this.reviewForm.transferAuthorization);
    formData.append('commentsforEditor', this.reviewForm.commentsToEditor);
    formData.append('commentsForAuthor', this.reviewForm.commentsToAuthor);
    formData.append('approvalAction', this.reviewForm.approvalAction);

    formData.append('newSubjectRating', this.reviewForm.questions[0].answer);
    formData.append('newInformationRating', this.reviewForm.questions[1].answer);
    formData.append('newConclusionRating', this.reviewForm.questions[2].answer);
    formData.append('manuscriptRating', this.reviewForm.questions[3].answer);
    formData.append('manuscriptOrganisedRating', this.reviewForm.questions[4].answer);
    formData.append('manuscriptOtherInfoRating', this.reviewForm.questions[5].answer);

    this.journalWebApiService.NewReviewersRemarks(formData).subscribe({
      next: (data) => {
        let result = data.item1[0]['returnData'];
        let errorCode = data.item1[0]['returnId'];

        if (result === 'success') {
          Swal.fire({
            title: 'Stored Remarks ',
            text: data.item1[0]['msg'],
            icon: 'success',
          }).then(() => {
            // this.VisitUrl(this.BookId, this.JournalTitle, 'About');
            this.reviewForm = {
              recommendation: '',
              rating: 0,
              commentsToEditor: '',
              commentsToAuthor: '',
              transferAuthorization: '',
              approvalAction: '',
              questions: this.reviewForm.questions.map(q => ({
                ...q,
                answer: '' // Reset answer to an empty string or default value
              }))
            };

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

    let modal = bootstrap.Modal.getInstance(document.getElementById('ReviewerModal'));
    modal.hide();
  }



  actionList: any[] = [{ id: '0', name: 'Editor' }, { id: '1', name: 'Author' }, { id: '2', name: 'Reviewer' }, { id: '13', name: 'Guest' },];
  selectedAction: string = '';

  TakeActionAs() {
    if (this.selectedAction == 'Editor') {
      this.isEditor = false; this.isGuest = this.isReviewer = false;
      this.isAuthor = true;
    } else if (this.selectedAction == 'Reviewer') {
      this.isReviewer = true;
      this.isEditor = false;
      this.isGuest = this.isAuthor = false;
    } else if (this.selectedAction == 'Author') {
      this.isAuthor = true;
      this.isGuest = this.isEditor = this.isReviewer = false;
    }
    else if (this.selectedAction == 'Publisher') {
      this.isAuthor = true;
      this.isGuest = this.isEditor = this.isReviewer = false;
    }
  }

  selectedJournalId: any;
  selectedReviewerId: string = '';
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
        this.LoginFalied();
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
  AssignedById: any;
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
    formData.append('SubmittedBy', this.AssignedById);
    formData.append('RecordId', this.RecordId);


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





  // 

  //  Editors login action Data grid start 

  columnHeaders: { [key: string]: string } = {
    journalTitle: 'Journal Title',
    'uploadedOn': 'Uploaded on',
    editorInChief: 'Author Name',
    // manuScriptType: 'Manuscript Type', 
    submissionType: 'Submitted Script ',
    fileUrl: 'File Download',
    journalId: 'Action'
  }; // Custom header text journalTitle	editorInChief	ManuScriptType	submissionType



  // 21-feb-25

  displayedEditorColumns: string[] = [
    // 'journalId',
    'journalTitle',
    'uploadedOn',
    'manuScript',
    'editorInChief',
    'emailId',
    'userName',
    'submissionType',
    'fileUrl',
    'journalId'
  ];
  displayedEditorColumnHeaders: { [key: string]: string } = {
    journalTitle: 'Journal Title',
    uploadedOn: 'Uploaded on',
    manuScript: 'Manu Script',
    editorInChief: 'Editor In Chief',
    emailId: 'Submitted User Email',
    userName: 'Correspond Author',
    submissionType: 'Submitted Script ',
    fileUrl: 'Document',
    journalId: 'Action'
  }; // Custom header text journalTitle	editorInChief	ManuScriptType	submissionType



  EditorData: any;
  EditorDataColumns: any;

  EditordisplayedColumns: string[] = [
    // 'journalTitle',
    'uploadedOn',
    'manuScript',
    'editorInChief',
    'emailId',
    'userName',
    'fileUrl',
    'journalId'
  ];

  EditordisplayedColumnsHeader: string[] = [
    // 'Journal Title',
    'Uploaded Date',
    'Manu Script',
    'Editor In Chief',
    'User Email Id',
    'User Name',
    'Download File',
    'Action'
  ];

  showEditorData(journalId: any) {
    this.journalWebApiService.GetAllMenuScriptForJournalId(journalId).subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.dataLoaded = true;
        this.EditorData = dataX.item1;
        // console.log("ALL Menuscript   Data" + JSON.stringify(this.EditorData))
        if (this.EditorData.length > 0) {
          this.EditorDataColumns = Object.keys(this.EditorData[0]);
          this.calculateTotalPagesEditor();
          this.updatePaginatedDataEditor();

        }
        this.dataShowing = true;
        this.getUserRolesforId();
      },
      error: (error: any) => {
        this.dataShowing = false;
        console.error('Error fetching data', error);
        this.LoginFalied();
      },
      complete: () => {
        this.dataShowing = true;
      }
    });
    this.GetallReviewsData(this.BookId);
  }

  currentPageReviewerRemarks: number = 1;
  pageSizeReviewerRemarks: number = 10;
  paginatedReviewerRemarks: any[] = [];
  totalPagesReviewerRemarks: number = 1;
  ReviewerRemarksData: any[] = [];
  ReviewerRemarksDataColumns: string[] = [];
  searchText: string = '';
  filteredReviewerRemarksData: any[] = []; // 👈 for storing filtered results


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
    this.totalPagesReviewerRemarks = Math.ceil(this.filteredReviewerRemarksData.length / this.pageSizeReviewerRemarks);
  }

  updatePaginatedDataReviewerRemarks() {
    const startIndex = (this.currentPageReviewerRemarks - 1) * this.pageSizeReviewerRemarks;
    this.paginatedReviewerRemarks = this.filteredReviewerRemarksData.slice(startIndex, startIndex + this.pageSizeReviewerRemarks);
  }

  applySearch() {
    const search = this.searchText.toLowerCase();

    this.filteredReviewerRemarksData = this.ReviewerRemarksData.filter(row =>
      Object.values(row).some(val =>
        val?.toString().toLowerCase().includes(search)
      )
    );

    this.currentPageReviewerRemarks = 1;
    this.calculateTotalPagesReviewerRemarks();
    this.updatePaginatedDataReviewerRemarks();
  }
  // calculateTotalPagesReviewerRemarks() {
  //   this.totalPagesReviewerRemarks = Math.ceil(this.ReviewerRemarksData.length / this.pageSizeReviewerRemarks);
  // }

  // updatePaginatedDataReviewerRemarks() {
  //   const startIndex = (this.currentPageReviewerRemarks - 1) * this.pageSizeReviewerRemarks;
  //   this.paginatedReviewerRemarks = this.ReviewerRemarksData.slice(startIndex, startIndex + this.pageSizeReviewerRemarks);
  // }

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
        // console.log("Fetched ReviewerRemarksData:", JSON.stringify(this.ReviewerRemarksData));
        this.filteredReviewerRemarksData = [...this.ReviewerRemarksData];
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

  DisapproveStatus(rowData: any) {
    // alert(rowData.manuscriptId)
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
    // alert(rowData.manuscriptId)
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


  // currentPageReviewerRemarks: number = 1;
  // pageSizeReviewerRemarks: number = 10;
  // paginatedReviewerRemarks: any[] = [];
  // totalPagesReviewerRemarks: number = 1;

  // displayedReviewerRemarksColumnHeaders: { [key: string]: string } = { 
  //   reviewerTerm:       'Term Reviewed', 
  //   overallRating:      'Overall Rating', 
  //   commentsForAuthor:  'Comments for Author', 
  //   commentsForEditor:  'Comments for Editor', 
  //   transferResponse:   'Transfer Response', 
  //   newSubjectRating:  'Subject Rating', 
  //   manuscriptRating:  'Manuscript Rating', 
  //   manuscriptOrganisedRating: 'Manuscript Organised Rating', 
  //   // userName: 'Submitted By', 
  //   // submissionType: 'Submitted Script ', 
  //   // fileUrl: 'Document' ,
  //   journalId: 'Action' 
  // }; // Custom header text journalTitle	editorInChief	ManuScriptType	submissionType

  //   ReviewerRemarksdisplayedColumns: string[] = [
  //     'Term Reviewed',
  //     'Overall Rating',
  //     'Comments for Author',
  //     'Comments for Editor',
  //     'Transfer Response',
  //     'Subject Rating',
  //     'Manuscript Rating',
  //     'journalId'
  //   ];



  // calculateTotalPagesReviewerRemarks() {
  //   this.totalPagesReviewerRemarks = Math.ceil(this.ReviewerRemarksData.length / this.pageSizeReviewerRemarks);
  // }

  // updatePaginatedDataReviewerRemarks() {
  //   const startIndex = (this.currentPageReviewerRemarks - 1) * this.pageSizeReviewerRemarks;
  //   this.paginatedReviewerRemarks = this.ReviewerRemarksData.slice(startIndex, startIndex + this.pageSizeReviewerRemarks);
  // }

  // nextPageReviewerRemarks() {
  //   if (this.currentPageReviewerRemarks < this.totalPagesReviewerRemarks) {
  //     this.currentPageReviewerRemarks++;
  //     this.updatePaginatedDataReviewerRemarks();
  //   }
  // }

  // previousPageReviewerRemarks() {
  //   if (this.currentPageReviewerRemarks > 1) {
  //     this.currentPageReviewerRemarks--;
  //     this.updatePaginatedDataReviewerRemarks();
  //   }
  // }

  // ReviewerRemarksData: any;
  // ReviewerRemarksDataColumns: any;

  // GetallReviewsData(journalId: any) {
  //   this.journalWebApiService.GetAllReviewersRemarkss(journalId).subscribe({
  //     next: (dataXY: any) => {
  //       this.dataSource = dataXY.item1;
  //       this.dataLoaded = true;
  //       this.ReviewerRemarksData = dataXY.item1;
  //       console.log("ALL ReviewerRemarksData   Data" + JSON.stringify(this.ReviewerRemarksData))
  //       if (this.ReviewerRemarksData.length > 0) {
  //         this.ReviewerRemarksDataColumns = Object.keys(this.ReviewerRemarksData[0]);
  //         this.calculateTotalPagesReviewerRemarks();
  //         this.updatePaginatedDataReviewerRemarks();
  //       }
  //       this.dataShowing = true;
  //       this.getUserRolesforId();
  //     },
  //     error: (error: any) => {
  //       this.dataShowing = false;
  //       console.error('Error fetching data', error);
  //       this.LoginFalied();
  //     },
  //     complete: () => {
  //       this.dataShowing = true;
  //     }
  //   });
  // }

  onSelectFileEditorX(a: any) {
    let aa = a;
    // alert(aa)
    window.open('https://files.lpu.in/umsweb/Journal/' + aa, '_blank');
  }

  currentPageEditor: number = 1;
  pageSizeEditor: number = 10;
  paginatedEditorData: any[] = [];
  totalPagesEditor: number = 1;



  calculateTotalPagesEditor() {
    this.totalPagesEditor = Math.ceil(this.EditorData.length / this.pageSizeEditor);
  }

  updatePaginatedDataEditor() {
    const startIndex = (this.currentPageEditor - 1) * this.pageSizeEditor;
    this.paginatedEditorData = this.EditorData.slice(startIndex, startIndex + this.pageSizeEditor);
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

  // Added on 24-feb-25

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


}

