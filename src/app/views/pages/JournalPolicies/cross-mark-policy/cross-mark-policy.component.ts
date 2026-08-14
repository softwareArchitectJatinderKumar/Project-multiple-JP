import { StorageService } from 'src/app/_services/storage.service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cross-mark-policy',
  templateUrl: './cross-mark-policy.component.html',
  standalone: false,styleUrls: ['./cross-mark-policy.component.scss']
})
export class CrossMarkPolicyComponent implements OnInit {
  BookId: any; name: any;
  bookData: any;

  constructor(private route: ActivatedRoute, private router: Router, private cookieService: CookieService, private journalService: LpujournalbookService, private StoragesServices: StorageService) { }

  ngOnInit(): void {
    this.LoginStatus = this.checkUserLogin();

    let BookId  = this.route.snapshot.params['Id'];
    let name  = this.route.snapshot.params['name'];
      if (BookId != undefined && BookId != null) {
        this.BookId = BookId;
        this.name = name.replace(/-/g, ' ');
      } else {
       this.router.navigate(['/Home']);
      }
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
