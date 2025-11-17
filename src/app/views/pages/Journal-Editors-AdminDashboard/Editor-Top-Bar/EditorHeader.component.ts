import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-EditorHeader',
  templateUrl: './EditorHeader.component.html',
  styleUrls: ['./EditorHeader.component.scss'],standalone: false
})
export class EditorHeaderComponent implements OnInit {
  isDisabled: boolean = true;
  BookId: any;
  name: any;
  UserRole: string = '';
  user_Email: string = '';
  supervisorName: string = '';
  departmentName: string = '';
  candidateName: string = '';
  LoginStatus: boolean = false;

  showSearchForm: boolean = false;
  show: boolean = true;
  isSearchOpen: boolean = false;
  isNavbarCollapsed: boolean = true;

  constructor(
    private journalWebApiService: LpujournalbookService,
    private AuthSession: LoginSessionService,
    private router: Router,
    private route: ActivatedRoute,
    private StoragesServices: StorageService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.LoginStatus = this.checkUserLogin();
    if (!this.LoginStatus) {
      this.Logout();
    }
  }

  checkUserLogin(): boolean {
    const GetCookieData = this.cookieService.get('authData');
    const status = this.StoragesServices.isLoggedIn();

    // console.log('Cookie:', GetCookieData, 'Session status:', status);

    if (GetCookieData && status) {
      try {
        const retrievedCookies = JSON.parse(GetCookieData);

        this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
        this.user_Email = retrievedCookies.EmailId || '';
        this.supervisorName = retrievedCookies.SupervisorName?.length > 0 ? retrievedCookies.SupervisorName : 'N-A';
        this.departmentName = retrievedCookies.DepartmentName?.length > 0 ? retrievedCookies.DepartmentName : 'N-A';
        this.candidateName = retrievedCookies.CandidateName || '';

        return true;
      } catch (err) {
        console.error('Invalid cookie data:', err);
        return false;
      }
    }

    return false;
  }

  Logout(): void {
    this.cookieService.delete('authData');
    this.cookieService.delete('BookData');
    this.cookieService.deleteAll();

    sessionStorage.clear();
    localStorage.clear();

    this.AuthSession.clearSession();
    this.StoragesServices.clean?.();

    this.UserRole = '';
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

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  toggleSearchForm(): void {
    this.showSearchForm = !this.showSearchForm;
    this.show = !this.show;
  }

  goto(val: any): void {
    this.router.navigateByUrl(val);
  }

  VisitUrl(Id: any, name: any, Sufix: any): void {
    this.router.navigateByUrl(`${Id}/${name}/${Sufix}`).then(() => {
      window.location.reload();
    });
  }

  VisitUserPage(Menu: any, Id: any, Sufix: any): void {
    this.router.navigateByUrl(`${Menu}/${Id}/${Sufix}`).then(() => {
      window.location.reload();
    });
  }

  VisitPage(Page: any): void {
    this.router.navigateByUrl(Page).then(() => {
      window.location.reload();
    });
  }
}
// export class EditorHeaderComponent implements OnInit {
//   isDisabled: any = true;
//   BookId: any; name: any;
//   UserRole: any;
//   user_Email: any;
//   supervisorName: any;
//   departmentName: any;
//   candidateName: any;
//   LoginStatus: boolean = false;
//   constructor(
//     private journalWebApiService: LpujournalbookService,
//     private AuthSession: LoginSessionService,
//     private router: Router, private route: ActivatedRoute,
//     private StoragesServices: StorageService,
//     private cookieService: CookieService) { }

//   showSearchForm: boolean = false; show: boolean = true; isSearchOpen: boolean = false;

//   isNavbarCollapsed: boolean = true;
//   toggleNavbar(): void {
//     this.isNavbarCollapsed = !this.isNavbarCollapsed;
//   }

//   goto(val: any) {
//     this.router.navigateByUrl(val);
//   }

//   VisitUrl(Id: any, name: any, Sufix: any) {
//     this.router.navigateByUrl(Id + '/' + name + '/' + Sufix).then(() => {
//       window.location.reload();
//     });
//   }
//   VisitUserPage(Menu: any, Id: any, Sufix: any) {
//     // alert(Menu+'/'+Id + '/' + Sufix)
//     this.router.navigateByUrl(Menu + '/' + Id + '/' + Sufix).then(() => {
//       window.location.reload();
//     });
//   }
// VisitPage(Page:any)
// {
//   this.router.navigateByUrl(Page).then(() => {
//     window.location.reload();
//   });
// }

// ngOnInit(): void {
  
//   this.LoginStatus=this.checkUserLogin();
//   if ( this.LoginStatus !== true ) {
//     this.Logout();
//   }
// }
// checkUserLogin() {
//   const GetCookieData = this.cookieService.get('authData');
//   var status=this.StoragesServices.isLoggedIn();
  
//   if (GetCookieData && status==true) {
//     const retrievedCookies = JSON.parse(GetCookieData);
//     this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
//     this.user_Email = retrievedCookies.EmailId;
//     this.supervisorName = retrievedCookies.SupervisorName?.length > 0 ? retrievedCookies.SupervisorName : 'N-A';
//     this.departmentName = retrievedCookies.DepartmentName?.length > 0 ? retrievedCookies.DepartmentName : 'N-A';;
//     this.candidateName = retrievedCookies.CandidateName;
//     return true;
//   } else {
//     return false;
//   }

// }
//   toggleSearchForm() {
//     this.showSearchForm = !this.showSearchForm;
//     this.show = !this.show;
//   }

//   Logout() {
//     this.cookieService.delete('authData');
//     this.cookieService.delete('BookData');
  
//     this.cookieService.deleteAll();
  
//     sessionStorage.clear();
//     localStorage.clear();
  
//     this.AuthSession.clearSession();
//     this.StoragesServices.clean();
  
//     this.UserRole = null;
//     this.user_Email = null;
//     this.supervisorName = null;
//     this.departmentName = null;
//     this.candidateName = null;
//     this.LoginStatus = false;
  
//     this.router.navigateByUrl('Home').then(() => {
//       setTimeout(() => {
//         location.reload();
//       }, 500);
//     });
//   }

// }
