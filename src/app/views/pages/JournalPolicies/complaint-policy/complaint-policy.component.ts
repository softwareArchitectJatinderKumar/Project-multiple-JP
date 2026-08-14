import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
// import swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { StorageService } from 'src/app/_services/storage.service';
@Component({
  selector: 'app-complaint-policy',
  templateUrl: './complaint-policy.component.html',
  standalone: false,styleUrls: ['./complaint-policy.component.scss']
})
export class ComplaintPolicyComponent implements OnInit {
  BookId: any; name: any;
  bookData: any;


  constructor(
    private route: ActivatedRoute,
    private journalService: LpujournalbookService,
    private StoragesServices: StorageService,
    private cookieService: CookieService, private router: Router
  ) {}

  ngOnInit(): void {
    this.LoginStatus = this.checkUserLogin();

    let BookId  = this.route.snapshot.params['Id'];
    let name  = this.route.snapshot.params['name'];
    //this.route.queryParams.subscribe(params => {
      // const BookId = params['BookId'];
      // const name = params['name'];
      // console.log("Value of Book Id = " + BookId)
      if (BookId != undefined && BookId != null) {
        this.BookId = BookId;
        // this.name = name;
        this.name = name.replace(/-/g, ' ');
      } else {
      //  //console.log("error Somthing went wrong");
       this.router.navigate(['/Home']);

      }
   // })
  }

  UserRole: any;
  user_Email: any;
  supervisorName: any;
  departmentName: any;
  candidateName: any;
  LoginStatus: boolean = false;
  JournalTitle: any;
  userId: any;
  userRoleText: any;

  UserRolesData: any;
  UserRolesArray: { value: string; label: string; id: string }[] = [];
  editorRole: boolean = false;
  authorRole: boolean = false;
  reviewerRole: boolean = false;
  publisherRole: boolean = false;

  availableRoles = [
    { value: '0', label: 'Editor Login' },
    { value: '1', label: 'Author Login' },
    { value: '2', label: 'Reviewer Login' },
    { value: '3', label: 'Publisher Login' },
  ];

  selectedRoles: string[] = [];
  userRole: any;
  selectedRole: any;


  checkUserLogin(): Boolean | any {
    const GetCookieData = this.cookieService.get('authData');
    var status = this.StoragesServices.isLoggedIn();
    if (GetCookieData && status == true) {
      try {
        const retrievedCookies = JSON.parse(GetCookieData);
        this.userRole =
          retrievedCookies.UserRole?.length > 0
            ? retrievedCookies.UserRole
            : -1;
        this.userId = retrievedCookies.EmailId;
        this.selectedRole = retrievedCookies.SelectedRole;
        this.supervisorName = retrievedCookies.SupervisorName;
        this.departmentName = retrievedCookies.DepartmentName;
        this.candidateName = retrievedCookies.CandidateName;
        return true;
      } catch (error) {
        console.log('error');
        return false;
      }
    } else {
      return false;
    }
  }

}
