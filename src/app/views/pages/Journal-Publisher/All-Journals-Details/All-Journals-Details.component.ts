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
  selector: 'app-All-Journals-Details',
  templateUrl: './All-Journals-Details.component.html',
  standalone: false,styleUrls: ['./All-Journals-Details.component.scss']
})

export class AllJournalsDetailsComponent implements OnInit {
  searchQueryx: string = '';
  booksData: any[] = []; // Full data from API
  filteredJournals: any[] = []; // Filtered data after search
  paginatedJournals: any[] = []; // Data to display on current page
  Journals: any[]=[];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  serverUrl: string = '';
  BookId: any;
  JournalId: any;
  JournalTitle: any;
  userId: any;
  userRole: any;
  supervisorName: any;
  departmentName: any;
  candidateName: any;
  LoginStatus: boolean= false;
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private AuthSession: LoginSessionService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private journalWebApiService: LpujournalbookService
  ) {}

  ngOnInit(): void {
    this.serverUrl = 'https://files.lpu.in/umsweb/Journal/';
    const BookId = this.route.snapshot.params['Id'];
    const name = this.route.snapshot.params['name'];
    this.LoginStatus  = this.checkUserLogin();

    if (BookId) {
      this.BookId = BookId;
      this.JournalId = BookId;
      this.JournalTitle = name;
    }
    if(this.LoginStatus)
    this.getBooksDetail();
    else
    this.Logout();
  }
  Logout() {
    // Delete cookies properly
    this.cookieService.delete('authData');
    this.cookieService.delete('BookData');
    this.cookieService.deleteAll();
  
    // Clear session storage if used
    this.AuthSession.clearSession();
    sessionStorage.clear();
    localStorage.clear();
  
    // Reset user variables
    this.userRole = null;
    this.userId = null;
    this.supervisorName = null;
    this.departmentName = null;
    this.candidateName = null;
    this.LoginStatus = false;
  
    // Navigate to login page instead of reloading
    this.router.navigate(['']).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  }
  
  checkUserLogin() {
    const GetCookieData = this.cookieService.get('authData');
    if (GetCookieData) {
      try {
        const retrievedCookies = JSON.parse(GetCookieData);
        this.userRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Guest';
        this.userId = retrievedCookies.EmailId;
        this.supervisorName = retrievedCookies.SupervisorName;
        this.departmentName = retrievedCookies.DepartmentName;
        this.candidateName = retrievedCookies.CandidateName;
        return true;
      } catch (error) {
        console.error("Error parsing JSON from cookies:", error);
        return false;
      }
    } else {
      return false;
    }
  }

  getBooksDetail(): void {
    this.journalWebApiService.GetAllJournalEditorDetails().subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.booksData = response.item1;
        this.Journals= response.item1;
        this.filteredJournals = [...this.booksData];
        this.updatePaginatedData();
      } else {
        this.booksData = [];
        this.filteredJournals = [];
        this.paginatedJournals = [];
      }
    });
  }

  searchx() {
    const query = this.searchQueryx?.trim().toLowerCase() || '';
    this.currentPage = 1;

    if (!query) {
      this.filteredJournals = [...this.booksData];
    } else {
      this.filteredJournals = this.booksData.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(query)
        )
      );
    }

    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedJournals = this.filteredJournals.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredJournals.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  Reset() {
    this.searchQueryx = '';
    this.filteredJournals = [...this.booksData];
    this.currentPage = 1;
    this.updatePaginatedData();
  }
}

// export class AllJournalsDetailsComponent implements OnInit {
//   fromDate: any;    booksDataColumns: any;  toDate: any;  pipe = new DatePipe('en-CA');
//   dataSource: any[] = [];   dataX: any;   booksData: any;  dataShowing: any = false;
//   userRole: any;    BookId: any;    JournalId: any;  JournalTitle: any;
//   userId: any;    serverUrl: any;   supervisorName: any;    departmentName: any;
//   candidateName: any;
//     displayedColumns: string[] = [
//     // 'journalId',
//     'journalTitle',
//     'editorInChief',
//     'JournalsType',
//     'submissionType',
//     // 'fileUrl'
//   ];
//   displayedColumnsHeader: string[] = [
//     // 'journalId',
//     'Journal Title',
//     'Editor In Chief',
//     'Journals Type',
//     'Submission Type',
//     // 'Action'
//   ];
//     Journals: any;
//   constructor(
//     private storageService: StorageService,
//     private authService: AuthService,
//     private AuthSession: LoginSessionService,
//     private fb: FormBuilder,
//     private router: Router,
//     private route: ActivatedRoute, private cookieService: CookieService,
//     private journalWebApiService: LpujournalbookService  
//   ) {
    
//   }

//   dataLoaded: boolean = false;

//   ngOnInit(): void {
//     this.serverUrl='https://files.lpu.in/umsweb/Journal/';
//     let BookId  = this.route.snapshot.params['Id'];
//     let name  = this.route.snapshot.params['name'];
//     let loginStatus = this.checkUserLogin();
//     this.getBooksDetail();
//       if (BookId != undefined && BookId != null ) {
//         this.BookId = BookId;
//         this.JournalId= BookId;
//         this.JournalTitle = name;
//         this.getBooksDetail();
//       } 
//   }
 
//   checkUserLogin(){
//     const GetCookieData = this.cookieService.get('authData');
//     if (GetCookieData) {
//       try {
//         const retrievedCookies = JSON.parse(GetCookieData);
//         this.userRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Guest';
//         this.userId = retrievedCookies.EmailId;
//         this.supervisorName = retrievedCookies.SupervisorName;
//         this.departmentName = retrievedCookies.DepartmentName;
//         this.candidateName = retrievedCookies.CandidateName;
//         return true;
//       } catch (error) {
//         console.error("Error parsing JSON from cookies:", error);
//         return false;  
//       }
//     } else {
//       return false;
//     }
    
//   }


//   Reset() {
//     window.location.reload();
//   }
//   getBooksDetail(): void {
//     this.journalWebApiService.GetAllJournalEditorDetails().subscribe((response) => {
//       if (response.item1 && response.item1.length > 0) {
//         this.booksData = response.item1;
//         this.Journals = this.booksData;
//         // console.log(JSON.stringify(this.Journals))
//       }
//       else {
//         this.Journals = [];
//       }
//     });
//   }

//   isLoading: boolean[] = [];
//   loadingTimeout: any[] = []; // Store timeout references


//   // "id":62,"journalTitle":"International Journal of Recent Developments in Sciences",
//   // "introduction":"<p class=\"ql-align-justify\"><span style=\"color: black;\">The International Journal of Recent Developments in Sciences (IJRDS) is a peer-reviewed scientific publication, launched by the School of Chemical Engineering and Physical Sciences at Lovely Professional University, India.</span></p><p><span style=\"color: black;\">&nbsp;</span></p><p><span style=\"color: black;\">IJRDS serves as a forum for researchers worldwide to present their latest findings in the vast and ever-evolving field of science aims to publish on a quarterly basis.</span></p><p class=\"ql-align-justify\"><span style=\"color: black;\">. We welcome original contributions encompassing a broad spectrum of disciplines within the natural sciences, with a particular emphasis on recent advancements and their potential impact.</span></p><p class=\"ql-align-justify\"><br></p><p><br></p>",
//   // "subTitle":"IJRDS is peer reviewed quartely journal Igniting the Future of Science","volumne":null,
  
//   // ,"publishDate":"09/01/2025 00:00:00","thrustArea":"<ul>\r\n  <li><strong>Mathematics:</strong> New approaches to mathematics, uses in scientific modeling, and developments in computational mathematics.</li>\r\n  <li><strong>Physics:</strong> State-of-the-art study in condensed matter, materials science, and astrophysics as well as theoretical, computational, and experimental physics.</li>\r\n  <li><strong>Chemistry:</strong> Fundamental and applied research in organic, inorganic, analytical, and physical chemistry, with a focus on new discoveries and their potential applications.</li>\r\n  <li><strong>Chemical Engineering:</strong> Innovative research in process design, optimization, materials science, and reaction engineering, with an emphasis on sustainability and industrial relevance.</li>\r\n  <li><strong>Biosciences and Agriculture:</strong> Groundbreaking research in molecular biology, genetics, biotechnology, agriculture, and allied fields, addressing challenges in food security, health, and environmental sustainability.</li>\r\n</ul>","articleType":"<p class=\"ql-align-justify\"><span style=\"color: black;\">\r\nAnticipated content, by article type include original research, short reports orletters, review articles, case studies, methodologies or method. A brief outline of the article types is given below:</span></p><p class=\"ql-align-justify\"><span style=\"color: black;\">&nbsp;</span></p><p class=\"ql-align-justify\"> <strong style=\"color: black;\">a) Original Research </strong></p><p class=\"ql-align-justify\"><span style=\"color: black;\">&nbsp;The ideal length for an article is 12-15 typed pages, or about 5,000 words (including references, tables, and figures). References should be limited to approaches that have already been publicly reported. It is recommended that no more than fifty sources be cited (except for review articles or reports on microarray data). There has to be a detailed setup, materials, and procedures section in the article.</span></p><p class=\"ql-align-justify\"><span style=\"color: black;\">&nbsp;</span></p><p class=\"ql-align-justify\"> <strong style=\"color: black;\">b) Short Communications </strong></p><p class=\"ql-align-justify\"> <span style=\"color: black;\">Short communications should fit on four to eight pages of typewritten text, or no more than two drawings and 2,500 words.</span></p><p class=\"ql-align-justify\"> <span style=\"color: black;\">&nbsp;</span></p><p class=\"ql-align-justify\"> <strong style=\"color: black;\">c) Review articles </strong></p><p class=\"ql-align-justify\"> <span style=\"color: black;\">Concise and critical updates on a topic of current relevance can be provided in the form of review articles. Acceptable herbal drug monographs will address contemporary pharmacological and toxicological challenges and provide a perspective on potential future developments. </span></p><p class=\"ql-align-justify\"> <span style=\"color: black;\">Reviews of new technologies and developments in fields relevant to the journals focus can be found here as well.\r\n</span></p><p><br></p>","imageUrl":"https://files.lpu.in/umsweb/Journal/Journal_2050165252_17_2024_62_recent-develpement-sciences.jpeg"},
//   displayedJournalsColumns: string[] = [
//     'Id',
//     'journalTitle',
//     'subTitle',
//     'editorInChief',
//     'scopeofJournal',
//     'publishDate',
//     'imageUrl',
//     'articleType'
     
//   ];
//   displayedJournalsColumnHeaders: { [key: string]: string } = {
//     journalTitle: 'Journal Title',
//     Journals: 'Manu Script',
//     editorInChief: 'Author Name',
//     emailId: 'User Email',
//     userName: 'User Name',
//     submissionType: 'Submitted Script ',
//     fileUrl: 'File Download',
//     journalId: 'Action'
//   }; // Custom header text journalTitle	editorInChief	JournalsType	submissionType



//   JournalsData: any;
//   JournalsDataColumns: any;
//   //  Data[{"journalId":53,"journalTitle":"Bioengineering and Biosciences Reports","JournalsType":null,"submissionType":
//   // "Journals,Journals","fileUrl":"53_1482989762_24_2025_merged-files.zip","file":null,"editorInChief":"Dr. Neeta Raj Sharma","userId":null,"subItemType":null}
//   JournalsdisplayedColumns: string[] = [
//     'Id',
//     'journalTitle',
//     'subTitle',
//     'editorInChief',
//     'scopeofJournal',
//     'publishDate',
//     'imageUrl',
//     'articleType'
//   ];

//   JournalsdisplayedColumnsHeader: string[] = [
//     'Id',
//     'journal Title',
//     'sub Title',
//     'editor In Chief',
//     'scopeof Journal',
//     'publish Date',
//     'imageUrl',
//     'article Type'
//   ];

//   currentPage = 1;
//   itemsPerPage = 5;
//   searchQueryx: any;


//   searchx() {
//     // alert(1)
//     const query = this.searchQueryx.toLowerCase();
//     this.Journals = this.booksData.filter((item: { [s: string]: unknown; } | ArrayLike<unknown>) => {
//       return Object.values(item).some(val =>
//         String(val).toLowerCase().includes(query)
//       );
//     });
//     this.updatePaginatedData();
//   }


//   // Update paginated data when data changes
//   updatePaginatedData() {
//     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//     const endIndex = startIndex + this.itemsPerPage;
//     this.Journals = this.booksData.slice(startIndex, endIndex);
//   }

//   get totalPages(): number {
//     return Math.ceil(this.Journals.length / this.itemsPerPage);
//   }

//   get paginatedJournals() {
//     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//     return this.Journals.slice(startIndex, startIndex + this.itemsPerPage);
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//     }
//   }

//   prevPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//     }
//   }

// }
