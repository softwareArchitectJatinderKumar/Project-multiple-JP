import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import * as mammoth from 'mammoth';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { AbstractControl, FormControl, FormGroup, NgForm, UntypedFormGroup, ValidatorFn } from '@angular/forms';
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
  selector: 'app-submitManuScript-page',
  templateUrl: './submitManuScript.component.html',
  standalone: false,
  styleUrls: ['./submitManuScript.component.scss']
})
export class SubmitManuScriptComponent implements OnInit {
  @ViewChild('reviewerForm') reviewerForm: NgForm | undefined;

  emailId: any = ''; candidateName: any; supervisorName: any; mobileNumber: any; instituteName: any;
  departmentName: any; idProofType: any = 'select'; idProofNumber: any; address: any; password: any; confirmPassword: any;
  userRole: any = 'select';
  cifUserForm!: FormGroup; isForm1Submitted: boolean = false; IdProofFileName: string | null = null; IdProofFile: string | null = null;
  sessionData: any[] = []; BookId: any; data: any[] = []; bookData: any; JournalDetails: any; detailsArray: any;
  fileStatus: boolean = false; fileName: any; errorMessage: any; isLoginFailed: boolean = false; FileData: any; array: any[] = [];
  fileData: File | null = null; JournalId: any = ''; JournalTitle: any = ''; formBuilder: any; form1: any; Description: any;
  JournalSubTitle: any; selectedFiles: File[] = [];
  AuthorEmailId: any;

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
    this.scrollToTop();
  }

  LoadForm() {
    this.scriptUploadForm = this.fb.group({
      journalTitle: [this.JournalTitle],
      journalId: [this.JournalId],
      ManuScriptTitle: ['', Validators.required],
      ManuScriptType: ['Select', Validators.required],
      SubmissionType: ['Select', Validators.required],
      SubItemType: ['Select'],
      // description: ['', Validators.required],
      file: [null, Validators.required]
    });
  }
  UserRolesArray: { value: string; label: string; id: string }[] = [];

  LoginFalied() {
    this.VisitUrl(this.BookId, this.name, 'ExternalLogin');
  }
  submitted: boolean = false;
  get ManuScriptTitle() {
    return this.scriptUploadForm.get('ManuScriptTitle');
  }
  get ManuScriptType() {
    return this.scriptUploadForm.get('ManuScriptType');
  }
  get SubmissionType() {
    return this.scriptUploadForm.get('SubmissionType');
  }
  onSubmissionTypeChange(event: any) {
    this.submissionType = event.target.value;
    const subItemTypeControl = this.scriptUploadForm.get('SubItemType');
    if (this.submissionType === 'Manuscript') {
      subItemTypeControl?.setValidators([Validators.required]);
    } else {
      subItemTypeControl?.clearValidators();
    }
    subItemTypeControl?.updateValueAndValidity();
    this.submissionType = event.target.value;
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
    this.submitted = true;
    if (this.scriptUploadForm.invalid) {
      return;
    }
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
  // onSubmissionTypeChange(event: any): void {
  //   // Get the selected submission type
  //   this.submissionType = event.target.value;
  // }

  getFileName(filePath: string): string {
    // Extract the file name from the full file path
    return filePath.split('\\').pop()?.split('/').pop() || '';
  }

  // 30-Jan-25 changes
  AllManuScriptType: any;
  AllSubItemTypes: any;
  AllSubmissionTypes: any;
  selectedOption: string = 'zip';
  IsUploading: boolean = false;
  uploadFile() {
    this.IsUploading = true;

    const reader = new FileReader();
    const fileName = this.userId + 'Manuscript-Requests-Files.zip';//   'merged-files.zip';

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
    const startTime = new Date().getTime();
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
    formData.append('AuthorEmailId', this.AuthorEmailId);

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
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(1500 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.IsUploading = false;
        }, remainingDelay);
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
    'journalTitle',
    'editorInChief',
    // 'manuScript',
    // 'requestedBy',
    // 'assignedBy',
    'submissionType',
    'fileUrl',
    'journalId'
  ];

  ReviewerdisplayedColumnsHeader: string[] = [
    // 'journalId',
    'Journal Title',
    'Editor In Chief',
    // 'Manu Script',
    // 'Requested By',
    // 'Assigned By',
    'Submission Type',
    'Download File',
    'Action'
  ];

  ReviewercolumnHeaders: { [key: string]: string } = {
    journalTitle: 'Journal Title',
    editorInChief: 'Author Name',
    // manuScript: 'Manuscript Type', 
    // requestedBy: 'Requested By',
    // editorInChief: 'Assigned By',
    submissionType: 'Submitted Script ',
    fileUrl: 'Document',
    journalId: 'Action'
  };


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

  showEditorData(journalId: any) {
    this.journalWebApiService.GetAllMenuScriptForJournalId(journalId).subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.dataLoaded = true;
        this.EditorData = dataX.item1;
        // console.log(JSON.stringify(this.EditorData));
        if (this.EditorData.length > 0) {
          this.EditorDataColumns = Object.keys(this.EditorData[0]);
          this.calculateTotalPagesEditor();
          this.updatePaginatedDataEditor();

        }
        this.dataShowing = true;
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

  loadReviewers(id: any) {
    // API call to fetch reviewer list
    this.journalWebApiService.GetReviewerDetailsForEditors(this.userId).subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.reviewerList = dataX.item1;
       console.log("ALL Reviewerlist" + JSON.stringify(this.reviewerList))
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
  }

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
    recommendation: '',
    rating: 0,
    commentsToEditor: '',
    commentsToAuthor: '',
    transferAuthorization: '',
    approvalAction: '',

    questions: [
      {
        text: 'The subject addressed in this article is worthy of investigation',
        options: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
        answer: ''
      },
      {
        text: 'The information presented is new',
        options: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
        answer: ''
      },
      {
        text: 'The conclusions are supported by the data',
        options: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
        answer: ''
      },
      {
        text: 'The manuscript is appropriate for the journal',
        options: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
        answer: ''
      },
      {
        text: 'Organization of the manuscript is appropriate',
        options: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
        answer: ''
      },
      {
        text: 'Figures, tables, and supplementary data are appropriate',
        options: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
        answer: ''
      },

    ]
  };

  ManuscriptMasterId: any;
  onTakeAction2(rowData: any) {
    this.ManuscriptMasterId = rowData?.['id'];
    // alert(this.ManuscriptMasterId)
    // console.log('Taking action on journal:', JSON.stringify(rowData));
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
    formData.append('manuscriptMasterId', this.ManuscriptMasterId);

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

  resetSelectedReviewers() {
    this.selectedReviewerIds = [];
  }
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

  isReviewerFormValid(): boolean {
    if (this.reviewerType === 'internal') {
      return this.selectedReviewerIds.length > 0;
    } else if (this.reviewerType === 'external') {
      return this.isExternalReviewerValid();
    }
    return false;
  }

  isExternalReviewerValid(): boolean {
    const isNameValid = !!this.externalReviewer.name; // Convert to boolean
    const isEmailValid = !!this.externalReviewer.email; // Convert to boolean
    const isContactValid = /^[0-9]{10}$/.test(this.externalReviewer.contact); // Check if contact is a valid 10-digit number

    return isNameValid && isEmailValid && isContactValid; // Return true only if all conditions are met
  }

  assignReviewer() {
    const formData = new FormData();
    if (!this.isReviewerFormValid()) return;

    if (this.reviewerType === 'internal') {
      if (this.selectedReviewerIds.length === 0) {
        alert('Please select at least one internal reviewer.');
        return;
      }

      formData.append('JournalId', this.selectedJournalId);
      formData.append('MultipleAssignedTo', this.selectedReviewerIds.join(','));
      formData.append('SubmittedBy', this.AssignedById);
      formData.append('RecordId', this.RecordId);

      this.assignInternalReviewer(formData);
    } else if (this.reviewerType === 'external') {

      const reviewerFormData = new FormData();
      reviewerFormData.append('JournalTitle', this.JournalTitle);
      reviewerFormData.append('JournalId', this.selectedJournalId);
      reviewerFormData.append('AssignedTo', this.externalReviewer.email);
      reviewerFormData.append('RecordId', this.RecordId);
      reviewerFormData.append('CandidateName', this.externalReviewer.name);
      reviewerFormData.append('User Email', this.externalReviewer.email);
      reviewerFormData.append('MobileNumber', this.externalReviewer.contact);
      reviewerFormData.append('User Type', '2');
      reviewerFormData.append('PasswordText', this.externalReviewer.contact);
      reviewerFormData.append('SubmittedBy', this.AssignedById);
      reviewerFormData.append('AuthorEmailId', this.AuthorEmailId);

      this.assignExternalReviewer(reviewerFormData);
    }

    this.resetReviewerForm();

    const modalEl = document.getElementById('assignReviewerModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();
    }
  }


  getReviewerNameByEmail(email: string): string {
    const reviewer = this.reviewerList.find(r => r.emailId === email);
    return reviewer ? reviewer.candidateName: email;
  }


  assignInternalReviewer(data: any) {
    this.IsUploading = true;
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
        setTimeout(() => {
          this.IsUploading = false;
        }, 1500);
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

  assignExternalReviewer(data: any) {
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

  // ngAfterViewInit(): void {
  //   const modalEl = document.getElementById('assignReviewerModal');
  //   if (modalEl) {
  //     modalEl.addEventListener('hidden.bs.modal', () => {
  //       this.resetReviewerForm();
  //     });
  //   }
  // }

  //  Editors login action Data grid start 

  columnHeaders: { [key: string]: string } = {
    journalTitle: 'Journal Title',
    'uploadedOn': 'Uploaded on',
    editorInChief: 'Author Name',
    // manuScriptType: 'Manuscript Type', 
    submissionType: 'Submitted Script ',
    fileUrl: 'File Download',
    journalId: 'Action'
  };



  // 21-feb-25

  displayedEditorColumns: string[] = [
    // 'journalTitle',
    'uploadedOn',
    'manuScript',
    'manuscriptTitle',
    // 'editorInChief',
    'emailId',
    'userName',
    'submissionType',
    'fileUrl',
    // 'journalId'
  ];
  displayedEditorColumnHeaders: { [key: string]: string } = {
    // journalTitle: 'Journal',
    manuScript: 'Manuscript Type',
    manuScriptTitle: 'Manuscript Title',
    // editorInChief: 'Editor In Chief',
    emailId: 'Submitted by',
    userName: 'Correspondend Author',
    uploadedOn: 'Date of Submition',
    // submissionType: 'Submitted Script ',
    fileUrl: 'Document',
    reviewerAssigned: 'Action',
    journalId: 'Delete Action'
  };



  EditorData: any;
  EditorDataColumns: any;

  EditordisplayedColumns: string[] = [
    // 'journalTitle',
    'manuScript',
    'manuScriptTitle',
    // 'editorInChief',
    'emailId',
    'userName',
    'uploadedOn',
    // 'submissionType',
    'fileUrl',
    'reviewerAssigned',
    'journalId',
  ];

  EditordisplayedColumnsHeader: string[] = [
    'Journal Title',
    'Manuscript Type',
    'ManuscriptTitle',
    'Editor In Chief',
    'Submitted by',
    'Corresponding Author',
    'Date of Submition',
    // 'Submitted Script ',
    'Document',
    'Action',
    'Delete Action'
  ];


  currentPageReviewerRemarks: number = 1;
  pageSizeReviewerRemarks: number = 10;
  paginatedReviewerRemarks: any[] = [];
  totalPagesReviewerRemarks: number = 1;
  ReviewerRemarksData: any[] = [];
  ReviewerRemarksDataColumns: string[] = [];
  searchText: string = '';
  filteredReviewerRemarksData: any[] = [];

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


  // In your component TypeScript file
  getSelectedReviewers(): string {
    return this.selectedReviewerIds
      .map(email => this.getReviewerNameByEmail(email))
      .join(', ');
  }


  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });    
  }
  
// added on 31-July-25
 
  
  
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
       alert(JSON.stringify(data))
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

}

