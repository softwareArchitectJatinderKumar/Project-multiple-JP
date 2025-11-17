import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';

@Component({
  selector: 'app-journalmenubar',
  templateUrl: './journalmenubar.component.html',
  standalone: false,styleUrls: ['./journalmenubar.component.scss']
})
export class JournalmenubarComponent implements OnInit {
  isDisabled: any = true;
  BookId: any; name: any;
  UserRole: any;
  user_Email: any;
  supervisorName: any;
  departmentName: any;
  candidateName: any;
  LoginStatus: boolean = false;
  constructor(
    private journalWebApiService: LpujournalbookService,
    private AuthSession: LoginSessionService,
    private router: Router, private route: ActivatedRoute,
    private cookieService: CookieService) { }

  showSearchForm: boolean = false; show: boolean = true; isSearchOpen: boolean = false;

  VisitUrl(Id: any, name: any, Sufix: any) {
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix).then(() => {
      window.location.reload();
    });
  }

  ngOnInit(): void {
    var BookId = this.route.snapshot.params['Id'];
    var name = this.route.snapshot.params['name'];
    if (BookId != undefined && BookId != null) {
      this.BookId = BookId;
      this.name = name;
    }
  }
  // checkUserLogin() {
  //   const GetCookieData = this.cookieService.get('authData');
  //   if (GetCookieData) {
  //     try {
  //       const retrievedCookies = JSON.parse(GetCookieData);
  //       this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
  //       this.user_Email = retrievedCookies.EmailId;
  //       this.supervisorName = retrievedCookies.SupervisorName?.length > 0 ? retrievedCookies.SupervisorName : 'N-A';
  //       this.departmentName = retrievedCookies.DepartmentName?.length > 0 ? retrievedCookies.DepartmentName : 'N-A';;
  //       this.candidateName = retrievedCookies.CandidateName;
  //       return true;
  //     } catch (error) {
  //       console.error("Error parsing cookies:", error);
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // }
  // Logout() {
  //   this.cookieService.delete('authData', '/');
  //   this.cookieService.delete('BookData', '/');
  //   this.cookieService.deleteAll('/');
  //   this.AuthSession.clearSession();

  //   this.UserRole = null;
  //   this.user_Email = null;
  //   this.supervisorName = null;
  //   this.departmentName = null;
  //   this.candidateName = null;
  //   this.LoginStatus = false;

  //   this.VisitUrl(this.BookId, this.name,'ExternalLogin');

  // }
  // Logout() {
  //   // Delete cookies properly
  //   this.cookieService.delete('authData');
  //   this.cookieService.delete('BookData');
  //   this.cookieService.deleteAll();
  
  //   // Clear session storage if used
  //   this.AuthSession.clearSession();
  //   sessionStorage.clear();
  //   localStorage.clear();
  
  //   // Reset user variables
  //   this.UserRole = null;
  //   this.user_Email = null;
  //   this.supervisorName = null;
  //   this.departmentName = null;
  //   this.candidateName = null;
  //   this.LoginStatus = false;
  
  //   // Navigate to login page instead of reloading
  //   this.router.navigate(['/ExternalLogin']).then(() => {
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 500);
  //   });
  // }
  

  toggleSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.show = !this.show;
  }


}
