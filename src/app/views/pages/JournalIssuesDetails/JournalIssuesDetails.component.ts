import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { StorageService } from 'src/app/_services/storage.service';
@Component({
  selector: 'app-JournalIssuesDetails',
  templateUrl: './JournalIssuesDetails.component.html',
  styleUrls: ['./JournalIssuesDetails.component.css']
})
export class JournalIssuesDetailsComponent implements OnInit {
  BookId: string | undefined;
  journalTitle: string = '';
  issues: any[] = [];
  isLoading: boolean = true;
  activeAccordionId: string | null = null;
 // serverUrl: string = 'https://files.lpu.in/umsweb/Journal/';
 serverUrl: string = 'https://files.lpu.in/umsweb/Journal/';
  groupedIssuesByYear: { year: string; issues: any[][] }[] = [];
  expandedTitles: Set<string> = new Set<string>();

  constructor(
    private route: ActivatedRoute,
    private journalService: LpujournalbookService,
      private AuthSession: LoginSessionService,
        private router: Router,        
        private StoragesServices: StorageService,
        private cookieService: CookieService
  ) {}

  ngOnInit(): void {
     var BookId = this.route.snapshot.params['Id'];
        var name = this.route.snapshot.params['name'];
        this.LoginStatus = this.checkUserLogin();
        if (BookId != undefined && this.LoginStatus == true || this.selectedRole != '-1') {
          this.BookId = BookId;
          this.journalTitle = this.route.snapshot.params['name']?.replace(/-/g, ' ') || '';          
          this.getUserRolesforId();          
        }
        else {
          this.BookId = BookId;
          this.journalTitle = this.route.snapshot.params['name']?.replace(/-/g, ' ') || '';
          
        }
        this.loadIssues();
    // this.BookId = this.route.snapshot.params['Id'];
    // this.journalTitle = this.route.snapshot.params['name']?.replace(/-/g, ' ') || '';

    // if (this.BookId) {
    //   this.loadIssues();
    //   this.getUserRolesforId();
    // }
  }

  loadIssues() {
    this.isLoading = true;
    this.journalService.GetJournalIssues(this.BookId).subscribe({
      next: (response: any) => {
        this.issues = response.item1 || [];
        if (this.issues.length > 0) {
          this.activeAccordionId = `year-0`;
        }
        this.groupIssuesByYear(this.issues);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading issues:', error);
        this.isLoading = false;
      }
    });
  }

  groupIssuesByYear(issues: any[]) {
    const grouped: { [key: string]: any[] } = {};

    for (const issue of issues) {
      const year = new Date(issue.publishDate).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(issue);
    }

    this.groupedIssuesByYear = Object.entries(grouped).map(([year, issues]) => ({
      year,
      issues: this.chunkArray(issues, 2)
    }));
  }

  chunkArray(arr: any[], chunkSize: number): any[][] {
    const result: any[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }

  toggleAccordion(itemId: string) {
    this.activeAccordionId = this.activeAccordionId === itemId ? null : itemId;
  }

  formatIssueTitle(title: string, expanded = false): string {
    if (!title) return '';
    const words = title.trim().split(/\s+/);
    return (!expanded && words.length > 5)
      ? words.slice(0, 5).join(' ') + '...'
      : title;
  }

  toggleTitle(key: string): void {
    if (this.expandedTitles.has(key)) {
      this.expandedTitles.delete(key);
    } else {
      this.expandedTitles.add(key);
    }
  }

  isTitleExpanded(key: string): boolean {
    return this.expandedTitles.has(key);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  }

  downloadIssue(fileUrl: string) {
    window.open(this.serverUrl + fileUrl, '_blank');
  }


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
  selectedRole:any;

  checkUserLogin(): Boolean | any {
    const GetCookieData = this.cookieService.get('authData');
    var status = this.StoragesServices.isLoggedIn();
    if (GetCookieData && status == true) {
      try {
        const retrievedCookies = JSON.parse(GetCookieData);
        this.userRole = retrievedCookies.UserRole?.length > 0 ? retrievedCookies.UserRole : -1;
        this.userId = retrievedCookies.EmailId;
        this.selectedRole = retrievedCookies.SelectedRole;
        // console.log(this.userRole+ "selected Role " + this.selectedRole)
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
    this.journalService.GetUserRolesforUser (this.userId).subscribe({
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
}

 