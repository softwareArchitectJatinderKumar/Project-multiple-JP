// import { Component, Input, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { ActivatedRoute } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';
// import { LoginSessionService } from 'src/app/_services/login-session.service';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import { StorageService } from 'src/app/_services/storage.service';
// import Swal from 'sweetalert2';
// @Component({
//   selector: 'app-EDEditorHeader',
//   templateUrl: './EDEditorHeader.component.html',
//   styleUrls: ['./EDEditorHeader.component.scss']
// })
// export class EDEditorHeaderComponent implements OnInit {
//   isDisabled: boolean = true;
//   BookId: any;
//   name: any;
//   @Input() selectedRole: string = '';
//   showSearchForm: boolean = false;
//   show: boolean = true;
//   isSearchOpen: boolean = false;
//   isNavbarCollapsed: boolean = true;

//   UserRole: any;
//   user_Email: any;
//   supervisorName: any;
//   departmentName: any;
//   candidateName: any;
//   LoginStatus: boolean = false;
//   JournalTitle: any;
//   userId: any;
//   userRoleText: any;

//   UserRolesData: any;
//   UserRolesArray: { value: string; label: string; id: string }[] = [];
//   editorRole: boolean = false;
//   authorRole: boolean = false;
//   reviewerRole: boolean = false;
//   publisherRole: boolean = false;

//   availableRoles = [
//     { value: '0', label: 'Editor Login' },
//     { value: '1', label: 'Author Login' },
//     { value: '2', label: 'Reviewer Login' },
//     { value: '3', label: 'Publisher Login' },
//   ];

//   selectedRoles: string[] = [];

//   constructor(
//     private journalWebApiService: LpujournalbookService,
//     private AuthSession: LoginSessionService,
//     private router: Router,
//     private route: ActivatedRoute,
//     private StoragesServices: StorageService,
//     private cookieService: CookieService
//   ) {}

//   ngOnInit(): void {
//     const BookId = this.route.snapshot.params['Id'];
//     const name = this.route.snapshot.params['name'];
//     this.BookId = BookId;
//     this.name = name;
//     // alert(this.selectedRole);
//     const GetCookieData = this.cookieService.get('authData');
//     const status = this.StoragesServices.isLoggedIn();

//     this.getUserRolesforId().then(() => {
//       if (BookId !== undefined && GetCookieData && status && this.userRoleText !== '') {
//         this.LoginStatus = true;
//       } else {
//         Swal.fire({
//           title: 'Some Technical Issue',
//           text: '',
//           icon: 'error',
//           confirmButtonText: 'OK'
//         });
//         this.Logout();
//       }
//     });
//   }

//   toggleNavbar(): void {
//     this.isNavbarCollapsed = !this.isNavbarCollapsed;
//   }

//   toggleSearchForm(): void {
//     this.showSearchForm = !this.showSearchForm;
//     this.show = !this.show;
//   }

//   goto(val: any): void {
//     this.router.navigateByUrl(val);
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

//   getUserRolesforId(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.journalWebApiService.GetUserRolesforUser(this.userId).subscribe({
//         next: (response) => {
//           if (response?.item1?.length > 0) {
//             this.UserRolesData = response.item1[0];
//             const roles = this.UserRolesData?.userRole?.split(',') ?? [];
//             this.UserRole = roles;
//             const sortedRoles = [...roles].sort().join(',');

//             if (this.selectedRole === '0' && sortedRoles.includes(this.selectedRole)) {
//               this.userRoleText = 'Editor';
//             } else if (this.selectedRole === '2' && sortedRoles.includes(this.selectedRole)) {
//               this.userRoleText = 'Reviewer';
//             } else if (this.selectedRole === '3' && sortedRoles.includes(this.selectedRole)) {
//               this.userRoleText = 'Publisher';
//             } else if (this.selectedRole === '1' && sortedRoles.includes(this.selectedRole)) {
//               this.userRoleText = 'User';
//             } else {
//               this.userRoleText = '';
//             }
//           } else {
//             this.userRoleText = '';
//           }
//           resolve();
//         },
//         error: (err) => {
//           console.error('Error fetching user roles:', err);
//           this.userRoleText = '';
//           resolve(); // Resolve even on error to proceed with login check
//         }
//       });
//     });
//   }

//   VisitUrl(Id: any, name: any, Sufix: any): void {
//     this.router.navigateByUrl(`${Id}/${name}/${Sufix}`).then(() => {
//       window.location.reload();
//     });
//   }

//   VisitUserPage(Menu: any, Id: any, Sufix: any): void {
//     this.router.navigateByUrl(`${Menu}/${Id}/${Sufix}`).then(() => {
//       window.location.reload();
//     });
//   }

//   VisitPage(Page: any): void {
//     this.router.navigateByUrl(Page).then(() => {
//       window.location.reload();
//     });
//   }
// }

import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { StorageService } from 'src/app/_services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-EDEditorHeader',
  templateUrl: './EDEditorHeader.component.html',
  styleUrls: ['./EDEditorHeader.component.scss'], standalone: false
})
export class EDEditorHeaderComponent implements OnInit {
  isDisabled: boolean = true;
  BookId: any;
  name: any;
  @Input() selectedRole: string = '';
  showSearchForm: boolean = false;
  show: boolean = true;
  isSearchOpen: boolean = false;
  isNavbarCollapsed: boolean = true;

  UserRole: any;
  user_Email: any;
  supervisorName: any;
  departmentName: any;
  candidateName: any;
  LoginStatus: boolean = false;
  JournalTitle: any;
  userId: any;
  // selectedRole: any;
  userRoleText: any;

  constructor(
    private journalWebApiService: LpujournalbookService,
    private AuthSession: LoginSessionService,
    private router: Router,
    private route: ActivatedRoute,
    private StoragesServices: StorageService,
    private cookieService: CookieService
  ) { }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  ngOnInit(): void {
    var BookId = this.route.snapshot.params['Id'];
    var name = this.route.snapshot.params['name'];
    this.LoginStatus = this.checkUserLogin();
    if (BookId != undefined && this.LoginStatus == true || this.selectedRole != '-1') {
      this.BookId = BookId;
      this.name = name;
      this.getUserRolesforId();
      this.GetAllIssues(BookId);
    }
    else {
      this.BookId = BookId;
      this.name = name;
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    });
  }
  JournalIssues: any[] = [];
  GetAllIssues(JournalId: any) {
    this.journalWebApiService.GetJournalIssues(JournalId).subscribe({
      next: (dataX: any) => {
        this.JournalIssues = dataX.item1 || [];
      },
      error: (error: any) => {
        console.error('Error fetching journal issues', error);
      }
    });
  }
  // ngOnInit(): void {
  //   this.BookId = this.route.snapshot.params['Id'];
  //   this.name = this.route.snapshot.params['name'];
  //   if (this.selectedRole != '-1') {
  //     this.LoginStatus = this.checkUserLogin();
  //     this.getUserRolesforId();
  //   }

  // }
  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  toggleSearchForm(): void {
    this.showSearchForm = !this.showSearchForm;
    this.show = !this.show;
  }

  goto(val: any): void {
    this.router.navigateByUrl(val);
    this. scrollToTop();
  }


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

  selectedRoles: string[] = []; userRole: any;


  checkUserLogin(): Boolean | any {
    const GetCookieData = this.cookieService.get('authData');
    var status = this.StoragesServices.isLoggedIn();
    if (GetCookieData && status == true) {
      try {
        const retrievedCookies = JSON.parse(GetCookieData);
        this.userRole = retrievedCookies.UserRole?.length > 0 ? retrievedCookies.UserRole : -1;
        this.userId = retrievedCookies.EmailId;
        this.selectedRole = retrievedCookies.SelectedRole;
        // let Token = retrievedCookies.AccessToken;
        this.supervisorName = retrievedCookies.SupervisorName;
        this.departmentName = retrievedCookies.DepartmentName;
        this.candidateName = retrievedCookies.CandidateName;
        return true;
      } catch (error) {
        console.log("error");
        return false;
      }
    } else {
      return false;
    }
  }

  getUserRolesforId(): void {
    this.journalWebApiService.GetUserRolesforUser (this.userId).subscribe({
      next: (response) => {
        const rolesData = response?.item1?.[0];
       
        if (!rolesData) {
          this.UserRole = [];
          this.userRoleText = '';
          return;
        }
  
        const roles = rolesData.userRole?.split(',') ?? [];
        this.UserRole = roles;
  
        const sortedRoles = [...roles].sort().join(',');
  
        

        const roleTextMap: Record<string, string> = {
          '0': 'Editor',
          '1': 'User',
          '2': 'Reviewer',
          '3': 'Publisher'
        };
  
        if (this.selectedRole && sortedRoles.includes(this.userRole)) {
          this.userRoleText = roleTextMap[this.selectedRole] ?? '';
        } else {
          this.userRoleText = '';
        }
      },
      error: (err) => {
        console.error('Error fetching user roles:', err);
        this.UserRole = [];
        this.userRoleText = '';
      }
    });
  }
  

  // getUserRolesforId(): void {
  //   this.journalWebApiService.GetUserRolesforUser(this.userId).subscribe({
  //     next: (response) => {
  //       if (response?.item1?.length > 0) {
  //         this.UserRolesData = response.item1[0];
  //         const roles = this.UserRolesData?.userRole?.split(',') ?? [];
  //         // if (this.selectedRole===undefined || this.selectedRole===null ) {
  //         //   this.Logout(); 
  //         //  }
  //         alert(roles+this.selectedRole)
  //         this.UserRole = roles;
  //         // Sort and join roles to compare easily
  //         const sortedRoles = [...roles].sort().join(',');

  //         if (this.selectedRole =='0' && sortedRoles.includes(this.userRole)) {
  //           this.userRoleText = 'Editor';
  //         }
  //          // Default fallback
  //          else if (this.selectedRole == '1' && sortedRoles.includes(this.userRole)) {
  //           this.userRoleText = 'User';
  //         }
  //         // Reviewer
  //         else if (this.selectedRole == '2' && sortedRoles.includes(this.userRole)) {
  //           this.userRoleText = 'Reviewer';
  //         }
  //         // Publisher
  //         else if (this.selectedRole == '3' && sortedRoles.includes(this.userRole)) {
  //           this.userRoleText = 'Publisher';
  //         }
         
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching user roles:', err);
  //       this.UserRole = [];
  //       this.userRoleText = '';
  //     }
  //   });
  // }


  VisitUrl(Id: any, name: any, Sufix: any): void {
    this.router.navigateByUrl(`${Id}/${name}/${Sufix}`).then(() => {
      window.location.reload();
    });
    this.scrollToTop();
  }
  VisitUserPage(Menu: any, Id: any, Sufix: any): void {
    this.router.navigateByUrl(`${Menu}/${Id}/${Sufix}`).then(() => {
      window.location.reload();
    });

    this.scrollToTop();
  }

  VisitPage(Page: any): void {
    this.router.navigateByUrl(Page).then(() => {
      window.location.reload();
    });
    this.scrollToTop();
  }

  Logout() {
    // Delete specific cookies
    this.cookieService.delete('authData');
    this.cookieService.delete('BookData');

    // Ensure all cookies are cleared
    this.cookieService.deleteAll();

    // Clear session and local storage
    sessionStorage.clear();
    localStorage.clear();

    // Ensure session-related services are cleared
    this.AuthSession.clearSession();
    this.StoragesServices.clean();

    // Reset user-related variables
    this.UserRole = null;
    this.user_Email = null;
    this.supervisorName = null;
    this.departmentName = null;
    this.candidateName = null;
    this.LoginStatus = false;

    this.router.navigateByUrl('Home').then(() => {
      setTimeout(() => {
        location.reload();
      }, 500);
    });
  }

} 