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
  selector: 'app-All-User-Details',
  templateUrl: './All-User-Details.component.html',
  standalone: false,
  styleUrls: ['./All-User-Details.component.scss']
})
export class AllUserDetailsComponent implements OnInit {
  fromDate: any; UserDataColumns: any; toDate: any; pipe = new DatePipe('en-CA');
  dataSource: any[] = []; dataX: any; UserData: any; dataShowing: any = false;
  userRole: any; BookId: any; JournalId: any; JournalTitle: any; Role: string = '';
  userId: any; serverUrl: any; supervisorName: any; departmentName: any;
  candidateName: any;
  MenuBar: any;
  Users: any;
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
    this.serverUrl = 'https://files.lpu.in/umsweb/Journal/';
    let Role = this.route.snapshot.params['Role'];
    this.MenuBar = this.route.snapshot.params['Menu'];
    // let name  = this.route.snapshot.params['name'];
    // alert(name+"in Page ")
    let loginStatus = this.checkUserLogin();
   
    this.getUsersDetails(Role);
    if (Role != undefined && loginStatus ) {
      this.Role = Role;
      this.JournalTitle = name;
      this.getUsersDetails(Role);
    }
  }

  checkUserLogin() {
    var authToken = this.storageService.getUser();
    if(authToken == 'Token Expired')
    {
      return false;
    }
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
  getUsersDetails(Role: any): void {
    this.journalWebApiService.GetAllJournalUserDetails(Role).subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.UserData = response.item1;
        this.Users = this.UserData;
        // console.log(JSON.stringify(this.Users))
      }
      else {
        this.Users = [];
      }
    });
  }

  isLoading: boolean[] = [];
  loadingTimeout: any[] = []; // Store timeout references

  currentPage = 1;
  itemsPerPage = 15;

  get totalPages(): number {
    return Math.ceil(this.Users.length / this.itemsPerPage);
  }

  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.Users.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }


  // Define the user role mappings
  userRoleMap: { [key: number]: string } = {
    0: 'Editors',
    1: 'Authors',
    2: 'Reviewers',
    3: 'Publishers',
    4: 'Managing Editors',
    99: 'Users'
  };

  getUserRoleText(userRoles: number | number[] | null | undefined): string {
    if (userRoles === null || userRoles === undefined) return 'N/A'; // Ensure 0 is not treated as falsy

    if (typeof userRoles === 'number') {
      userRoles = [userRoles]; // Convert single number to array
    }

    return userRoles
      .map(role => this.userRoleMap[role] || `Unknown (${role})`)
      .join(', ');
  }

Reason: any;

  DisapproveStatus(rowData: any) {
    Swal.fire({
      title: "Reason for Disapproval",
      // text: "Disapproval reason",
      input: 'text',
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        this.Reason = result.value;
        const formData = new FormData();
        formData.append('UserEmailId', rowData.emailId);
        formData.append('DisapprovalReason', this.Reason);
        formData.append('Action', 'Disapprove');
        this.handleStatusChange(formData, 'Disapprove');
      } else {
        this.showCancelledSwal();
      }
    });
  }


  

  ChangeApproveStatus(rowData: any) {
    alert(rowData.emailId)
    const formData = new FormData();
    formData.append('UserEmailId', rowData.emailId);
    formData.append('DisapprovalReason', 'Approved ');
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
    this.journalWebApiService.ApproveEditor(formData).subscribe((data: any) => {
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


}
