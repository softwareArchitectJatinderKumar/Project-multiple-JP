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
  selector: 'app-Publisher-Dashboard',
  templateUrl: './Publisher-Dashboard.component.html',
  standalone: false,styleUrls: ['./Publisher-Dashboard.component.scss']
})
export class PublisherDashboardComponent implements OnInit {
  fromDate: any;    booksDataColumns: any;  toDate: any;  pipe = new DatePipe('en-CA');
  dataSource: any[] = [];   dataX: any;   booksData: any;  dataShowing: any = false;
  userRole: any;    BookId: any;    JournalId: any;  JournalTitle: any;
  userId: any;    serverUrl: any;   supervisorName: any;    departmentName: any;
  candidateName: any;
  
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

  dataLoaded: boolean = false;

  ngOnInit(): void {
    this.serverUrl='https://files.lpu.in/umsweb/Journal/';
    let loginStatus = this.checkUserLogin();
    if (!loginStatus) {
      Swal.fire({
        title: 'LoginFailed',
        text: '.',
        icon: 'error',
      }).then(() => {
        this.router.navigateByUrl('');
      });
    } 
  }
 
  checkUserLogin(){
    const GetCookieData = this.cookieService.get('authData');
    var status=this.storageService.isLoggedIn();
    if (GetCookieData && status) {
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

}
