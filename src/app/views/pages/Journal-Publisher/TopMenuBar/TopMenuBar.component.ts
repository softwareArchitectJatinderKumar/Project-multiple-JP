import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/_services/auth.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-TopMenuBar',
  templateUrl: './TopMenuBar.component.html',
  standalone: false,styleUrls: ['./TopMenuBar.component.scss']
})

export class TopMenuBarComponent implements OnInit {
  isDisabled: any = true;
  BookId: any;
  name: any;
  UserRole: any;
  user_Email: any;
  supervisorName: any;
  departmentName: any;
  candidateName: any;
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
    private storageService: StorageService,
    private authService: AuthService,
    private fb: FormBuilder,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    const isLoggedIn = this.checkUserLogin();

    if (!isLoggedIn) {
      this.Logout();
    } else {
      this.LoginStatus = true;
    }
  }

  checkUserLogin(): boolean {
    const GetCookieData = this.cookieService.get('authData');
    const status = this.storageService.isLoggedIn();

    // console.log("Cookie Data:", GetCookieData, "Storage login status:", status);

    if (GetCookieData && status) {
      try {
        const retrievedCookies = JSON.parse(GetCookieData);
        this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
        this.user_Email = retrievedCookies.EmailId;
        this.supervisorName = retrievedCookies.SupervisorName?.length > 0 ? retrievedCookies.SupervisorName : 'N-A';
        this.departmentName = retrievedCookies.DepartmentName?.length > 0 ? retrievedCookies.DepartmentName : 'N-A';
        this.candidateName = retrievedCookies.CandidateName;
        return true;
      } catch (error) {
        console.error("Error parsing cookies:", error);
        return false;
      }
    } else {
      return false;
    }
  }

  Logout(): void {
    // Delete cookies and session
    this.cookieService.delete('authData');
    this.cookieService.delete('BookData');
    this.cookieService.deleteAll();

    this.AuthSession.clearSession();
    sessionStorage.clear();
    localStorage.clear();

    // Reset component variables
    this.UserRole = null;
    this.user_Email = null;
    this.supervisorName = null;
    this.departmentName = null;
    this.candidateName = null;
    this.LoginStatus = false;

    // Navigate to login or home
    this.router.navigate(['']).then(() => {
      setTimeout(() => {
        window.location.reload();
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


// export class TopMenuBarComponent implements OnInit {
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
//     private storageService: StorageService,
//     private authService: AuthService,
//     private fb: FormBuilder,
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
//   VisitUserPage(Menu:any,Id: any, Sufix: any) {
//     this.router.navigateByUrl(Menu+'/'+Id + '/' + Sufix).then(() => {
//       window.location.reload();
//     });
//   }
// VisitPage(Page:any)
// {
//   this.router.navigateByUrl(Page).then(() => {
//     window.location.reload();
//   });
// }
//   ngOnInit(): void {
//       this.LoginStatus = this.checkUserLogin();    
//   }
//   checkUserLogin() {

//     const GetCookieData = this.cookieService.get('authData');
//     var status=this.storageService.isLoggedIn();
//     console.log(JSON.stringify(GetCookieData) +' s'+status)
  
//     if (GetCookieData && status) {
//       try {
//         const retrievedCookies = JSON.parse(GetCookieData);
//         this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
//         this.user_Email = retrievedCookies.EmailId;
//         this.supervisorName = retrievedCookies.SupervisorName?.length > 0 ? retrievedCookies.SupervisorName : 'N-A';
//         this.departmentName = retrievedCookies.DepartmentName?.length > 0 ? retrievedCookies.DepartmentName : 'N-A';;
//         this.candidateName = retrievedCookies.CandidateName;
//         return true;
//       } catch (error) {
//         console.error("Error parsing cookies:", error);
//         return false;
//       }
//     } else {
//       return false;
//     }
//   }
 
//   Logout() {
//     // Delete cookies properly
//     this.cookieService.delete('authData');
//     this.cookieService.delete('BookData');
//     this.cookieService.deleteAll();
  
//     // Clear session storage if used
//     this.AuthSession.clearSession();
//     sessionStorage.clear();
//     localStorage.clear();
  
//     // Reset user variables
//     this.UserRole = null;
//     this.user_Email = null;
//     this.supervisorName = null;
//     this.departmentName = null;
//     this.candidateName = null;
//     this.LoginStatus = false;
  
//     // Navigate to login page instead of reloading
//     this.router.navigate(['']).then(() => {
//       setTimeout(() => {
//         window.location.reload();
//       }, 500);
//     });
//   }
  

//   toggleSearchForm() {
//     this.showSearchForm = !this.showSearchForm;
//     this.show = !this.show;
//   }


// }
