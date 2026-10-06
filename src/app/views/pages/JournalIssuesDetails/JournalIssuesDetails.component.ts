import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { StorageService } from 'src/app/_services/storage.service';

export interface VolumeIssueGroup {
  volume: string;
  issueNumber: string;
  totalPublications: number;
  issues: any[][];
}

export interface YearGroup {
  year: string;
  volumeIssueGroups: VolumeIssueGroup[];
}

@Component({
  selector: 'app-JournalIssuesDetails',
  templateUrl: './JournalIssuesDetails.component.html',
  styleUrls: ['./JournalIssuesDetails.component.css'],
})
export class JournalIssuesDetailsComponent implements OnInit {
  BookId: string | undefined;
  journalTitle: string = '';
  issues: any[] = [];
  isLoading: boolean = true;
  serverUrl: string = 'https://files.lpu.in/umsweb/Journal/';

  groupedIssuesByYear: YearGroup[] = [];
  expandedTitles: Set<string> = new Set<string>();

  openYearIds: Set<string> = new Set<string>();
  openVolumeIssueIds: Set<string> = new Set<string>();

  constructor(
    private route: ActivatedRoute,
    private journalService: LpujournalbookService,
    private StoragesServices: StorageService,
    private cookieService: CookieService,
  ) {}

  ngOnInit(): void {
    var BookId = this.route.snapshot.params['Id'];
    var name = this.route.snapshot.params['name'];
    this.LoginStatus = this.checkUserLogin();
    if (
      (BookId != undefined && this.LoginStatus == true) ||
      this.selectedRole != '-1'
    ) {
      this.BookId = BookId;
      this.journalTitle =
        this.route.snapshot.params['name']?.replace(/-/g, ' ') || '';
      this.getUserRolesforId();
    } else {
      this.BookId = BookId;
      this.journalTitle =
        this.route.snapshot.params['name']?.replace(/-/g, ' ') || '';
    }
    this.loadIssues();
  }

  loadIssues() {
    this.isLoading = true;
    this.journalService.GetJournalIssues(this.BookId).subscribe({
      next: (response: any) => {
        console.log('Issues response:', response.item1);
        this.issues = response.item1 || [];
        this.groupIssuesByYear(this.issues);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading issues:', error);
        this.isLoading = false;
      },
    });
  }

  parseNumber(val: any): number {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    const str = String(val).trim();
    const num = Number(str);
    if (!isNaN(num)) return num;
    const matches = str.match(/\d+(\.\d+)?/);
    return matches ? parseFloat(matches[0]) : 0;
  }

  groupIssuesByYear(issues: any[]) {
    const yearMap: { [year: string]: any[] } = {};

    for (const issue of issues) {
      const year = issue.publishDate
        ? new Date(issue.publishDate).getFullYear().toString()
        : 'N/A';
      if (!yearMap[year]) {
        yearMap[year] = [];
      }
      yearMap[year].push(issue);
    }

    const sortedYears = Object.keys(yearMap).sort(
      (a, b) => Number(b) - Number(a)
    );

    this.openYearIds.clear();
    this.openVolumeIssueIds.clear();

    this.groupedIssuesByYear = sortedYears.map((year, yearIndex) => {
      const yearIssues = yearMap[year];
      const yearId = `year-${yearIndex}`;

      const viMap: {
        [key: string]: { volume: string; issueNumber: string; list: any[] };
      } = {};

      for (const issue of yearIssues) {
        const vol =
          issue.volume !== null &&
          issue.volume !== undefined &&
          String(issue.volume).trim() !== ''
            ? String(issue.volume).trim()
            : 'N/A';
        const issueNum =
          issue.issueNumber !== null &&
          issue.issueNumber !== undefined &&
          String(issue.issueNumber).trim() !== ''
            ? String(issue.issueNumber).trim()
            : 'N/A';

        const key = `${vol}___${issueNum}`;
        if (!viMap[key]) {
          viMap[key] = { volume: vol, issueNumber: issueNum, list: [] };
        }
        viMap[key].list.push(issue);
      }

      // Sort combinations: Volume descending, then Issue Number descending
      const sortedKeys = Object.keys(viMap).sort((keyA, keyB) => {
        const itemA = viMap[keyA];
        const itemB = viMap[keyB];

        const volA = this.parseNumber(itemA.volume);
        const volB = this.parseNumber(itemB.volume);
        if (volB !== volA) {
          return volB - volA;
        }

        const issueNumA = this.parseNumber(itemA.issueNumber);
        const issueNumB = this.parseNumber(itemB.issueNumber);
        if (issueNumB !== issueNumA) {
          return issueNumB - issueNumA;
        }

        return 0;
      });

      const volumeIssueGroups: VolumeIssueGroup[] = sortedKeys.map(
        (key, viIndex) => {
          const item = viMap[key];
          const viId = `vi-${yearIndex}-${viIndex}`;

          item.list.sort((a, b) => {
            const dateA = a.publishDate
              ? new Date(a.publishDate).getTime()
              : 0;
            const dateB = b.publishDate
              ? new Date(b.publishDate).getTime()
              : 0;
            return dateB - dateA;
          });

          if (yearIndex === 0 && viIndex === 0) {
            this.openVolumeIssueIds.add(viId);
          }

          return {
            volume: item.volume,
            issueNumber: item.issueNumber,
            totalPublications: item.list.length,
            issues: this.chunkArray(item.list, 2),
          };
        }
      );

      if (yearIndex === 0) {
        this.openYearIds.add(yearId);
      }

      return {
        year,
        volumeIssueGroups,
      };
    });
  }

  chunkArray(arr: any[], chunkSize: number): any[][] {
    const result: any[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }

  toggleYear(yearId: string): void {
    if (this.openYearIds.has(yearId)) {
      this.openYearIds.delete(yearId);
    } else {
      this.openYearIds.add(yearId);
    }
  }

  isYearOpen(yearId: string): boolean {
    return this.openYearIds.has(yearId);
  }

  toggleVolumeIssue(viId: string): void {
    if (this.openVolumeIssueIds.has(viId)) {
      this.openVolumeIssueIds.delete(viId);
    } else {
      this.openVolumeIssueIds.add(viId);
    }
  }

  isVolumeIssueOpen(viId: string): boolean {
    return this.openVolumeIssueIds.has(viId);
  }

  formatIssueTitle(title: string, expanded = false): string {
    if (!title) return '';
    const spacedTitle = title.trim().replace(/([a-z])([A-Z])/g, '$1 $2');
    const sentenceCaseTitle =
      spacedTitle.charAt(0).toUpperCase() + spacedTitle.slice(1).toLowerCase();
    const words = sentenceCaseTitle.split(/\s+/);
    return !expanded && words.length > 5
      ? words.slice(0, 5).join(' ') + '...'
      : sentenceCaseTitle;
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

  getUserRolesforId(): void {
    this.journalService.GetUserRolesforUser(this.userId).subscribe({
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
          '3': 'Publisher',
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
      },
    });
  }
}
