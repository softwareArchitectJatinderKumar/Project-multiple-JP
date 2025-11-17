import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { StorageService } from 'src/app/_services/storage.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-journal-inner-menu',
  templateUrl: './journal-inner-menu.component.html',
  standalone: false, styleUrls: ['./journal-inner-menu.component.scss']
})
export class JournalInnerMenuComponent implements OnInit {
  isDisabled = true;
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
    private StoragesServices: StorageService,

    private router: Router, private route: ActivatedRoute,
    private cookieService: CookieService) { this.router.onSameUrlNavigation = 'ignore'; }

  VisitUrls(event: Event, Id: any, name: any, Sufix: any) {
    event.preventDefault();  // This is the key line to prevent blink
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix);
  }

  VisitUrl(Id: any, name: any, Sufix: any) {
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix);
  }
  navigateToIssues(event: MouseEvent, bookId: string, name: string): void {
    event.preventDefault(); // Prevent default anchor behavior
    this.router.navigate(['/your-route', { bookId, name, action: 'GetIssues' }]); // Adjust the route as needed
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  ngOnInit(): void {
    var BookId = this.route.snapshot.params['Id'];
    var name = this.route.snapshot.params['name'];
    this.GetAllIssues(BookId);
    this.LoginStatus = this.checkUserLogin();
    if (BookId != undefined && this.LoginStatus == true) {
      this.BookId = BookId;
      this.name = name;
    }
    else {
      this.BookId = BookId;
      this.name = name;
    }

  }
  checkUserLogin() {
    const GetCookieData = this.cookieService.get('authData');
    var status = this.StoragesServices.isLoggedIn();
    if (GetCookieData && status == true) {
      return true;
    } else {
      return false;
    }
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

}
