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
  selector: 'app-ViewAllManuscripts',
  templateUrl: './ViewAllManuscripts.component.html',
  styleUrls: ['./ViewAllManuscripts.component.scss'],standalone: false
})
export class ViewAllManuscripts implements OnInit {
  fromDate: any; booksDataColumns: any; toDate: any; pipe = new DatePipe('en-CA');
  dataSource: any[] = []; dataX: any; booksData: any; dataShowing: any = false;
  userRole: any; BookId: any; JournalId: any; JournalTitle: any;
  userId: any; serverUrl: any; supervisorName: any; departmentName: any;
  candidateName: any;
  Math: any;
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

  dataLoaded: boolean = false; name: any;
  isLoginFailed : boolean = false; LoginStatus: boolean = false;
  newJournalTitle: any;
  VisitUrl(Id: any, name: any, Sufix: any) {
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix);
  }
  
  ngOnInit(): void {
    const bookId: string | undefined = this.route.snapshot.params['Id'];
    const name: string = this.route.snapshot.params['name'];
  
    this.serverUrl = 'https://files.lpu.in/umsweb/Journal/';
    this.newJournalTitle = name.replace(/-/g, ' ');
  
    if (!this.storageService.isLoggedIn()) {
      this.VisitUrl(bookId, name, 'ExternalLogin');
      return;
    }
  
    this.LoginStatus = this.checkUserLogin();
  
    if (bookId && !this.isLoginFailed) {
      this.BookId = bookId;
      this.JournalId = bookId;
      this.JournalTitle = name.replace(/-/g, ' ');
    }
  
    this.showData(this.userId);
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


  Reset() {
    window.location.reload();

  }


  onSelectFileX(a: any) {
    let aa = a;
    window.open(aa, '_blank');
  }

  showData(Emailid: any) {
    this.journalWebApiService.UserWiseAllMenuScript(Emailid).subscribe({
      next: (dataX: any) => {
        this.dataSource = dataX.item1;
        this.dataLoaded = true;
        this.ManuscriptData = dataX.item1;
        if (this.ManuscriptData.length > 0) {
          this.ManuscriptDataColumns = Object.keys(this.ManuscriptData[0]);
          this.calculateTotalPagesManuscript();
          this.updatePaginatedDataManuscript();
        }
        this.dataShowing = true;

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
  onSelectFileManuscriptX(a: any) {
    let aa = a;
    // alert(aa)
    window.open('https://files.lpu.in/umsweb/Journal/' + aa, '_blank');
  }

  
  displayedManuscriptColumns: string[] = [
    // 'journalId',
    'journalTitle',
    'manuScript',
    'editorInChief',
    'emailId',
    'userName',
    'submissionType',
    'fileUrl',
    'journalId'
  ];
  displayedManuscriptColumnHeaders: { [key: string]: string } = {
    journalTitle: 'Journal Title',
    manuScript: 'Manu Script',
    editorInChief: 'Author Name',
    emailId: 'User Email',
    userName: 'User Name',
    submissionType: 'Submitted Script ',
    fileUrl: 'File Download',
    journalId: 'Action'
  }; // Custom header text journalTitle	editorInChief	ManuScriptType	submissionType



  ManuscriptData: any;
  ManuscriptDataColumns: any;
  //  Data[{"journalId":53,"journalTitle":"Bioengineering and Biosciences Reports","manuScriptType":null,"submissionType":
  // "Manuscript,Manuscript","fileUrl":"53_1482989762_24_2025_merged-files.zip","file":null,"editorInChief":"Dr. Neeta Raj Sharma","userId":null,"subItemType":null}
  ManuscriptdisplayedColumns: string[] = [
    'journalTitle',
    // 'manuScriptType',
    'submissionType',
    'editorInChief',
    'fileUrl',
    // 'journalId',
  ];

  ManuscriptdisplayedColumnsHeader: string[] = [
    'Journal Title',
    // 'Manu Script',
    'Submission ',
    'Editor In Chief',
    'View Document',
    // 'Action'
  ];

  currentPageManuscript: number = 1;
  pageSizeManuscript: number = 10;
  paginatedManuscriptData: any[] = [];
  totalPagesManuscript: number = 1;



  calculateTotalPagesManuscript() {
    this.totalPagesManuscript = Math.ceil(this.ManuscriptData.length / this.pageSizeManuscript);
  }

  updatePaginatedDataManuscript() {
    const startIndex = (this.currentPageManuscript - 1) * this.pageSizeManuscript;
    this.paginatedManuscriptData = this.ManuscriptData.slice(startIndex, startIndex + this.pageSizeManuscript);
  }

  nextPageManuscript() {
    if (this.currentPageManuscript < this.totalPagesManuscript) {
      this.currentPageManuscript++;
      this.updatePaginatedDataManuscript();
    }
  }

  previousPageManuscript() {
    if (this.currentPageManuscript > 1) {
      this.currentPageManuscript--;
      this.updatePaginatedDataManuscript();
    }
  }

}
