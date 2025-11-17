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
  selector: 'app-register-page',
  templateUrl: './submitManuScript.component-old-logic.html',
  styleUrls: ['./submitManuScript.component.scss']
})
export class SubmitManuScriptComponent implements OnInit {
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
  scriptUploadForm!: FormGroup;     selectedFile: File | null = null;   fileError: string | null = null;  fromDate: any;  booksDataColumns: any;
  toDate: any;    pipe = new DatePipe('en-CA');   dataSource: any[] = [];  dataX: any;  booksData: any;  dataShowing: any = false;

  VisitUrl(Id: any, name: any, Sufix: any) {
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix);
  }
  isEditor: boolean= false;     isReviewer: boolean= false;   isAuthor: boolean= false;   isOther: boolean= false;
  isGuest: boolean= false; 
  UserRoles: any;
  ngOnInit(): void {
    let BookId = this.route.snapshot.params['Id'];
    let name = this.route.snapshot.params['name'];
    let loginStatus = this.checkUserLogin();
    if (BookId != undefined && BookId != null && loginStatus != false) {
      this.BookId = BookId;
      this.JournalId = BookId;
      this.JournalTitle = name;
      this.GetJournalDetailsAbout(this.BookId);
      this.showData();
      this.getUserRolesforId();
     
      this.showEditorData(this.userId);
    }
    else {
      // this.router.navigateByUrl( '/Login');
      this.router.navigateByUrl(BookId + '/' + name + '/' + 'ExternalLogin');
    }
    this.LoadForm();
  }
  LoadForm() {
    this.scriptUploadForm = this.fb.group({
      journalTitle: [this.JournalTitle],
      journalId: [this.JournalId],
      ManuScriptType: ['Select', Validators.required],
      SubmissionType: ['Select', Validators.required],
      SubItemType: ['Select' ],
      // description: ['', Validators.required],
      file: [null, Validators.required]
    });
  }
  UserRolesArray: any[] | undefined;
  getUserRolesforId() {
    const roleMapping: { [key: string]: string } = {
      '0': 'Editor',
      '1': 'Author',
      '2': 'Reviewer',
      '3': 'Guest',
      '4': 'Publisher'
    };
  
    this.journalWebApiService.GetUserRolesforUser(this.userId).subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.UserRolesData = response.item1[0];
        
        const roles = this.UserRolesData.userRole.split(',');
        this.UserRolesArray = roles.map((role: string | number) => ({
          value: role,
          label: roleMapping[role] || role
        }));
        
        // Set flags based on roles
        // this.isEditor = roles.includes('0');
        // this.isAuthor = roles.includes('1');
        // this.isReviewer = roles.includes('2');
        // this.isEditor=true;
        // this.isReviewer=true;
        // this.isAuthor=true
      } else {
        this.bookData = [];
      }
    });
  }
  
  // getUserRolesforId()
  // {
  //   this.journalWebApiService.GetUserRolesforUser(this.userId).subscribe((response) => {
  //     if (response.item1 && response.item1.length > 0) {
  //       this.UserRolesData = response.item1[0];
  //       // this.UserRoles = this.UserRolesData.userRole;
  //       // console.log(JSON.stringify(this.UserRolesData))
  //       //  alert(JSON.stringify(this.UserRoles))
  //     }
  //     else {
  //       this.bookData = [];
  //       // this.router.navigateByUrl('/');
  //     }
  //   });
    
  // }
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
        this.userRole = retrievedCookies.UserRole?.length > 0 ? retrievedCookies.UserRole : 'Guest';
        this.userId = retrievedCookies.EmailId;
        this.supervisorName = retrievedCookies.SupervisorName;
        this.departmentName = retrievedCookies.DepartmentName;
        this.candidateName = retrievedCookies.CandidateName;
        return true;
      } catch (error) {
        
        return false;
      }
    } else {
      return false;
    }

  }

  GetJournalDetailsAbout(JournalId: any): void {
    this.journalWebApiService.GetJournalDetailsforAboutPage(JournalId).subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.bookData = response.item1[0];
        // console.log(JSON.stringify(this.bookData))
        // alert(JSON.stringify(this.bookData))
        this.JournalDetails = this.bookData['journalDetails']
        this.EditorInChief = this.bookData?.editorName
        this.JournalSubTitle = this.bookData?.subTitle;
        //  alert(this.EditorInChief)
      }
      else {
        this.bookData = [];
        // this.router.navigateByUrl('/');
      }
    });
  }
 

  showData() {
    this.journalWebApiService.GetAllBooksDetails().subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.dataLoaded = true;
        this.booksData = dataX.item1;
        // alert(JSON.stringify(this.booksData))
        if (this.booksData.length > 0) {
          this.booksDataColumns = Object.keys(this.booksData[0]);
        }
        this.dataShowing = true;

      },
      error: (error: any) => {
        this.dataShowing = false;
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
      if (file.size > 25991576) {
        Swal.fire({
          title: 'File size exceeds 5MB. Please upload a smaller file.',
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
  uploadFile() {
    const reader = new FileReader();
    const fileName = 'merged-files.zip';

    if (!this.generatedFile) {
      Swal.fire({
        title: 'Error',
        text: 'No file generated. Please generate a ZIP or PDF before uploading.',
        icon: 'error'
      });
      return;
    }
    else{

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
    }
  
    
  
    // Initialize the variables as empty strings
    this.AllManuScriptType = "";
    this.AllSubItemTypes = "";
    this.AllSubmissionTypes = "";
  
    // Populate the variables with concatenated values
    this.cartItems.forEach(item => {
      this.AllManuScriptType += item.ManuScriptType + ',';
      this.AllSubItemTypes += item.SubItemType=='Select'? 'NA' :item.SubItemType + ',';
      this.AllSubmissionTypes += item.SubmissionType + ',';
    });
  
    // Remove the trailing comma (optional for cleaner data)
    this.AllManuScriptType = this.AllManuScriptType.replace(/,$/, '');
    this.AllSubItemTypes = this.AllSubItemTypes.replace(/,$/, '');
    this.AllSubmissionTypes = this.AllSubmissionTypes.replace(/,$/, '');
  
    // Create the FormData object
    const formData = new FormData();
    formData.append('JournalId', this.JournalId);
    formData.append('JournalTitle', this.JournalTitle);
    formData.append('ManuScriptType', this.AllManuScriptType);
    formData.append('SubmissionType', this.AllSubmissionTypes);
    formData.append('SubItemType', this.AllSubItemTypes);
    formData.append('UserId', this.userId);
    formData.append('EditorInchief', this.EditorInChief);
    formData.append('FileUrl', fileName);
    formData.append('File', this.FileData);
  
    // Call the API
    this.journalWebApiService.AddNewJournalMenuScriptData(formData).subscribe({
      next: (data) => {
        let result = data.item1[0]['msg'];
        let errorCode = data.item1[0]['returnId'];
  
        if (result === 'OK') {
          Swal.fire({
            title: 'Uploaded all Documents',
            text: data.item1[0]['msg'],
            icon: 'success',
          }).then(() => {
            this.VisitUrl(this.BookId, this.JournalTitle, 'MyManuScript');
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
//  For Editor  Logic

    displayedColumns: string[] = [
      // 'journalId',
      'journalTitle',
      'editorInChief',
      'menuScriptType',
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



    
  showEditorData(Emailid: any) {
    this.journalWebApiService.UserWiseAllMenuScript(Emailid).subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.dataLoaded = true;
        this.booksData = dataX.item1;
        // console.log("ALL Scripts Data" + JSON.stringify(this.booksData))
        // alert("ALL Scripts Data" + JSON.stringify(this.booksData))
        if (this.booksData.length > 0) {
          this.booksDataColumns = Object.keys(this.booksData[0]);
          this.calculateTotalPages();
          this.updatePaginatedData();
        }
        this.dataShowing = true;
        // setTimeout(() => {

        //   var wrapper1 = (<HTMLInputElement>document.getElementById('wrapper1'));
        //   var wrapper2 = (<HTMLInputElement>document.getElementById('wrapper2'));
        //   wrapper1.onscroll = function () {
        //     wrapper2.scrollLeft = wrapper1.scrollLeft;
        //   };
        //   wrapper2.onscroll = function () {
        //     wrapper1.scrollLeft = wrapper2.scrollLeft;
        //   };

        // }, 500);

      },
      error: (error: any) => {
        this.dataShowing = false;
        console.error('Error fetching data', error);
      },
      complete: () => {
        this.dataShowing = true;
        // console.log('Data fetching complete');
      }
    });
  }
  onSelectFileX(a: any) {
    let aa = a;
    window.open(aa, '_blank');
  }


  //  Editors login action Data grid start 

  columnHeaders: { [key: string]: string } = { 
    journalTitle: 'Journal Title', 
    editorInChief: 'Author Name', 
    menuScriptType: 'Manu Script Type', 
    submissionType: 'Submitted Script ', 
    fileUrl: 'File Download' ,
    journalId: 'Action' 
  }; // Custom header text journalTitle	editorInChief	ManuScriptType	submissionType


  currentPage: number = 1;
  pageSize: number = 10;
  paginatedData: any[] = [];
  totalPages: number = 1;

 

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.booksData.length / this.pageSize);
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.booksData.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }
  actionList: any[] = [{id:'0',name:'Editor'},{id:'1',name:'Author'},{id:'2',name:'Reviewer'},{id:'13',name:'Guest'},];
  selectedAction: string = '';

TakeActionAs() {
  if (this.selectedAction === 'Editor') {
    this.isEditor = true;  
    this.isGuest = this.isAuthor = false; 
    this.isReviewer = false;  
  }else if (this.selectedAction === 'Reviewer') {
    this.isReviewer = true;  
    this.isEditor = this.isGuest = this.isAuthor = false;   
  } else if (this.selectedAction === 'Author') {
    this.isAuthor = true;    
    this.isEditor =this.isGuest = this.isReviewer = false; 
  }
   else if (this.selectedAction === 'Guest') {
    this.isGuest = true;    
    this.isEditor =this.isReviewer = false; this.isAuthor = false; 
  }
}

  reviewerList: any[] = [
    { id: '1', name: 'Reviewer 1' },
    { id: '2', name: 'Reviewer 2' },
    { id: '3', name: 'Reviewer 3' }
  ]; // Dummy reviewers

  selectedJournalId: string | null = null;
  selectedReviewerId: string | null = null;

  loadReviewers() {
    // API call to fetch reviewer list
    // this.journalWebApiService.getReviewers().subscribe((reviewers) => {
    //   this.reviewerList = reviewers;
    // });
  }

  onTakeAction(journalId: string) {
    this.selectedJournalId = journalId;
    this.selectedReviewerId = null; // Reset reviewer selection
  }
  assignReviewer() {
    if (!this.selectedReviewerId) {
      alert('Please select a reviewer.');
      return;
    }

    alert(`Journal ID: ${this.selectedJournalId} assigned to Reviewer ID: ${this.selectedReviewerId}`);

    // Close modal after success
    let modal = bootstrap.Modal.getInstance(document.getElementById('assignReviewerModal'));
    modal.hide();
  }



  reviewForm = {
    recommendation: 'Minor Revisions',
    rating: 90,
    commentsToEditor: '',
    commentsToAuthor: '',
    transferAuthorization:'No',
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
      }
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
      Answers: ${this.reviewForm.questions.map(q => `${q.text}: ${q.answer}`).join('\n')}
    `);

    const formData = new FormData();

    // Append form data to the FormData object
    formData.append('journalId', this.JournalId );
    formData.append('emailId', this.userId);
    formData.append('reviewerTerm', this.reviewForm.recommendation);
    formData.append('overallRating', this.reviewForm.rating.toString());
    formData.append('transferResponse', this.reviewForm.transferAuthorization);
    formData.append('commentsforEditor', this.reviewForm.commentsToEditor);
    formData.append('commentsForAuthor', this.reviewForm.commentsToAuthor);
  
    formData.append('newSubjectRating', this.reviewForm.questions[0].answer);
    formData.append('newInformationRating', this.reviewForm.questions[1].answer);
    formData.append('newConclusionRating', this.reviewForm.questions[2].answer);
    formData.append('manuscriptRating', this.reviewForm.questions[3].answer);
    formData.append('manuscriptOrganisedRating', this.reviewForm.questions[4].answer);
    formData.append('manuscriptOtherInfoRating', this.reviewForm.questions[5].answer);
  
    // this.journalWebApiService.AddNewJournalMenuScriptData(formData).subscribe({
    //   next: (data) => {
    //     let result = data.item1[0]['msg'];
    //     let errorCode = data.item1[0]['returnId'];
  
    //     if (result === 'OK') {
    //       Swal.fire({
    //         title: 'Uploaded all Documents',
    //         text: data.item1[0]['msg'],
    //         icon: 'success',
    //       }).then(() => {
    //         this.VisitUrl(this.BookId, this.JournalTitle, 'MyManuScript');
    //       });
    //     } else {
    //       Swal.fire({
    //         title: 'Some Technical Issue',
    //         text: result,
    //         icon: 'error',
    //       }).then(() => {
    //         window.location.reload();
    //       });
    //     }
    //   },
    //   error: (err) => {
    //     Swal.fire({
    //       title: 'Error Occurred',
    //       text: 'Unable to complete the request. Please try again later.',
    //       icon: 'error',
    //     });
    //   }
    // });

    let modal = bootstrap.Modal.getInstance(document.getElementById('ReviewerModal'));
    modal.hide();  
  }
}

