declare var bootstrap: any;
import { DatePipe } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { Validators } from '@angular/forms';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import Swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin } from 'rxjs'
@Component({
  selector: 'app-MyManuscript-Details',
  templateUrl: './MyManuscript-Details.component.html',
  standalone: false,styleUrls: ['./MyManuscript-Details.component.scss']
})
export class MyManuscriptDetailsComponent implements OnInit {
  fromDate: any;    booksDataColumns: any;  toDate: any;  pipe = new DatePipe('en-CA');
  dataSource: any[] = [];   dataX: any;   booksData: any;  dataShowing: any = false;
  userRole: any;    BookId: any;    JournalId: any;  JournalTitle: any=''; name: any;
  userId: any;    serverUrl: any;   supervisorName: any;    departmentName: any;
  candidateName: any;
    displayedColumns: string[] = [
    // 'journalId',
    'journalTitle',
    'editorInChief',
    'JournalsType',
    'submissionType',
    // 'fileUrl'
  ];
  displayedColumnsHeader: string[] = [
    // 'journalId',
    'Journal Title',
    'Editor In Chief',
    'Journals Type',
    'Submission Type',
    // 'Action'
  ];
    Journals: any;
  bookData: any;
  JournalDetails: any;
  EditorInChief: any;
  JournalSubTitle: any;
  detailsArray: any;
  user_Email: string ='';
  LoginStatus: boolean = false;
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private AuthSession: LoginSessionService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService,
    private journalWebApiService: LpujournalbookService  ,

    private StoragesServices: StorageService,
  ) {
    
  }

  dataLoaded: boolean = false;
  LoginFalied(){
    this.VisitUrl(this.BookId,this.name,'ExternalLogin');    
  }
  VisitUrl(Id: any, name: any, Sufix: any) {
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix);
  }

  ngOnInit(): void {
    this.serverUrl='https://files.lpu.in/umsweb/Journal/';
    let loginStatus = this.checkUserLogin();
      if (loginStatus != false ) {
      this.loadJournals();
    } else {
      this.Logout();
    }
  }

  
  journalListsData: any[] = [];
  loadJournals() { 
    this.journalWebApiService.GetAllBooksDetails().subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.journalListsData = dataX.item1;
        // console.info(JSON.stringify(this.journalListsData))
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
  currentJournalId: any;
currentJournalTitle: any;
  setJournalId() {
    // Find the journal object based on the selected ID
    let idx = this.journalListsData.find(
      journal => journal.id == this.JournalTitle
    );
    this.currentJournalId= idx.id;
    this.currentJournalTitle= idx.journalTitle;
    // alert(JSON.stringify(idx))
    this.showReviewerData(this.currentJournalId);
    this.loadReviewers(this.currentJournalId);
  }

  checkUserLogin(): Boolean | any {
    const GetCookieData = this.cookieService.get('authData');
    if (GetCookieData) {
      try {
        const retrievedCookies = JSON.parse(GetCookieData);
        this.userRole = retrievedCookies.UserRole?.length > 0 ? retrievedCookies.UserRole : -1;
        this.userId = retrievedCookies.EmailId;
        // let Token = retrievedCookies.AccessToken;
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

 


  ReviewerData: any;
  ReviewerDataColumns: any;
      
  ReviewerdisplayedColumns: string[] = [
    // ALL ReviewerData  Data[{userName":"Geetanjali Singh","uploadedOn":"09 Apr 2025"}]
    // 'journalId',	id,			journalTitle,	manuScript,	submissionType,	MenuScriptType,fileUrl,filePath,editorInChief,userId,emailId, userName			SubmissionType,		FileUrl,			EditorInchief	, CreatedBy , UserId as RequestedBy , UpdatedBy as AssignedBy
    'journalTitle',
    'editorInChief',
    'manuScript',
    'userName',
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
    // 'Submission Type',
    'Download File',
    'Action'
  ];
  
  ReviewercolumnHeaders: { [key: string]: string } = { 
    journalTitle: 'Journal Title', 
    editorInChief: 'Author Name', 
    manuScript: 'Manuscript Type', 
    userName: 'Requested By',
    fileUrl: 'Document' ,
    journalId: 'Action' 
  }; // Custom header text journalTitle	editorInChief	ManuScriptType	submissionType
  
  
  
    showReviewerData(Id: any) {
      // this.journalWebApiService.GetMenuScriptForReviewers(Emailid).subscribe({

        // this.journalWebApiService.GetMenuScriptForReviewers(Id).subscribe({
        this.journalWebApiService.GetAllMenuScriptForJournalId(Id).subscribe({
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
          // this.showEditorData(this.BookId);
          
          this.loadReviewers(this.BookId);
          // this.GetJournalDetailsAbout(this.BookId);
          this.showData();
  
        },
        error: (error: any) => {
          this.dataShowing = false;
          console.error('Error fetching data', error);
          // this.LoginFalied();
          this.Logout();
        },
        complete: () => {
          this.dataShowing = true;
          // console.log('Data fetching complete');
        }
      });
    }
  getUserRolesforId() {
    throw new Error('Method not implemented.');
  }
    onSelectFileX(a: any) {
      let aa = a;
      window.open('https://files.lpu.in/umsweb/Journal/'+aa, '_blank');
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
        // this.LoginFalied();
        this.Logout();
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
  
 
  reviewForm = {
    recommendation: 'Minor Revisions',
    rating: 0,
    commentsToEditor: '',
    commentsToAuthor: '',
    transferAuthorization:'No',
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
    formData.append('journalId', this.JournalId );
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
              approvalAction:'',
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



  actionList: any[] = [{id:'0',name:'Editor'},{id:'1',name:'Author'},{id:'2',name:'Reviewer'},{id:'13',name:'Guest'},];
  selectedAction: string = '';

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
        // this.LoginFalied();
        this.Logout();
      },
      complete: () => {
        this.dataShowing = true;
      }
    });
  }
  AssignedById: any; selectedReviewerId: any=''; selectedJournalId: any;
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
    formData.append('SubmittedBy',this.AssignedById);
    formData.append('RecordId',this.RecordId);
  
  
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


  reviewerList: any[] = [];
  // loadReviewers(id:any) {
  //   this.journalWebApiService.GetReviewerDetailsForEditors(this.userId).subscribe({
  //     next: (dataX: any) => {
  //       this.dataSource = dataX.item1;
  //       this.reviewerList = dataX.item1;

  //     },
  //     error: (error: any) => {
  //       this.dataShowing = false;
  //       console.error('Error fetching data', error);
  //       // this.LoginFalied();
  //       this.Logout();
  //     },
  //     complete: () => {
  //       this.dataShowing = true;
  //     }
  //   });
   
  // }
  loadReviewers(id: any) {
    this.journalWebApiService.GetReviewerDetailsForEditors(id).subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.reviewerList = dataX.item1;
      },
      error: (error: any) => {
        this.dataShowing = false;
        console.error('Error fetching data', error);
      },
      complete: () => {
        this.dataShowing = true;
      }
    });
  }

  Logout(): void {
    this.cookieService.delete('authData');
    this.cookieService.delete('BookData');
    this.cookieService.deleteAll();

    sessionStorage.clear();
    localStorage.clear();

    this.AuthSession.clearSession();
    this.StoragesServices.clean?.();

    this.userRole = '';
    this.user_Email = '';
    this.supervisorName = '';
    this.departmentName = '';
    this.candidateName = '';
    this.LoginStatus = false;

    this.router.navigateByUrl('Home').then(() => {
      setTimeout(() => {
        location.reload();
      }, 500);
    });
  }
}
