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
        // console.log('Issues response:', response.item1);
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

  // Dynamic lookup for known terms that contain vowels or custom casing (e.g., IoT, PhD)
  private specialTermsMap: { [key: string]: string } = {
    it: 'IT',
    mou: 'MOU',
    mb: 'MB',
    kb: 'KB',
    gb: 'GB',
    tb: 'TB',
    ai: 'AI',
    ml: 'ML',
    iot: 'IoT',
    ict: 'ICT',
    api: 'API',
    ui: 'UI',
    ux: 'UX',
    rfid: 'RFID',
    dna: 'DNA',
    rna: 'RNA',
    covid: 'COVID',
    ieee: 'IEEE',
    usa: 'USA',
    uk: 'UK',
    lpu: 'LPU',
    ugc: 'UGC',
    issn: 'ISSN',
    isbn: 'ISBN',
    pdf: 'PDF',
    phd: 'PhD',
    who: 'WHO',
    wto: 'WTO',
    iso: 'ISO',
    ipr: 'IPR',
  };

  /**
   * Allows registering new special terms dynamically at runtime (e.g. from an API or configuration).
   */
  registerSpecialTerms(terms: string[] | { [key: string]: string }): void {
    if (Array.isArray(terms)) {
      for (const term of terms) {
        if (term && term.trim()) {
          this.specialTermsMap[term.trim().toLowerCase()] = term.trim();
        }
      }
    } else if (terms && typeof terms === 'object') {
      Object.assign(this.specialTermsMap, terms);
    }
  }

  /**
   * Dynamically extracts and preserves acronyms (e.g. CRISPR, LLM, MOU, IT)
   * and mixed-case words (e.g. IoT, WiFi, PhD) from the author's original input,
   * so future keywords entered in uppercase/mixed-case are never lost.
   */
  private extractOriginalPreservedWords(rawTitle: string): Map<string, string> {
    const preserved = new Map<string, string>();
    if (!rawTitle) return preserved;

    const trimmed = rawTitle.trim();
    // If the entire title was entered in ALL CAPS (shouting), do not preserve every word as uppercase
    const isEntireTitleUpperCase = trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed);
    if (isEntireTitleUpperCase) {
      return preserved;
    }

    const tokens = trimmed.match(/[a-zA-Z0-9]+(?:[-/][a-zA-Z0-9]+)*/g) || [];
    for (const token of tokens) {
      const uppercaseCount = (token.match(/[A-Z]/g) || []).length;
      // 2 or more uppercase characters in a token (e.g. IT, MOU, MB, KB, IEEE, CRISPR, LLM)
      const isAcronym = uppercaseCount >= 2 && token.length >= 2;
      // Mixed-case with internal capital letter (e.g. IoT, WiFi, PhD, mRNA)
      const hasInternalCapital = /^[a-z]+[A-Z]/.test(token) || /^[A-Z][a-z]+[A-Z]/.test(token);

      if (isAcronym || hasInternalCapital) {
        preserved.set(token.toLowerCase(), token);
      }
    }

    return preserved;
  }

  /**
   * Dynamically determines if a 2-letter token is an acronym (e.g., IT, AI, ML, UI, UX, IP, OS)
   * by excluding standard English 2-letter lowercase words/prepositions/pronouns.
   */
  private isTwoLetterAcronym(word: string): boolean {
    const lower = word.toLowerCase();
    if (!/^[a-z]{2}$/.test(lower)) return false;

    // Common English 2-letter words (excluding 'it' which should be capitalized as IT in journal context)
    const englishTwoLetterWords = new Set([
      'in', 'on', 'at', 'to', 'of', 'is', 'as', 'an', 'or', 'by',
      'if', 'so', 'no', 'up', 'do', 'go', 'he', 'we', 'me', 'us',
      'my', 'be', 'am'
    ]);

    return !englishTwoLetterWords.has(lower);
  }

  /**
   * Dynamically identifies consonant-only abbreviations (e.g., NLP, SVM, CNN, PCR, RFID, GPS)
   * while excluding common English words with no standard vowels (e.g., by, my, why, fly).
   */
  private isVowellessAcronym(word: string): boolean {
    const lower = word.toLowerCase();
    if (!/^[a-z]{2,5}$/.test(lower)) return false;

    const commonVowellessWords = new Set([
      'by', 'my', 'why', 'try', 'fly', 'dry', 'cry', 'sky', 'shy', 'sly', 'gym', 'lynx', 'myth'
    ]);
    if (commonVowellessWords.has(lower)) return false;

    // If word contains no vowels (a, e, i, o, u, y), it is an acronym
    return !/[aeiouy]/.test(lower);
  }

  /**
   * Dynamic formatting engine using heuristics, regex patterns, and context preservation.
   */
  applyDynamicFormatting(title: string, preserved: Map<string, string>): string {
    if (!title) return '';

    // 1. Dynamic unit pattern with numbers (e.g., 64mb -> 64 MB, 128 kb -> 128 KB, 5ghz -> 5 GHz)
    let result = title.replace(
      /\b(\d+(?:\.\d+)?)\s*(kb|mb|gb|tb|pb|hz|khz|mhz|ghz|bps|kbps|mbps|gbps|kw|mw|gw|kv|ma|cm|mm|nm|km|kg|mg)\b/gi,
      (_match, num, unit) => {
        const u = unit.toLowerCase();
        if (['khz', 'mhz', 'ghz'].includes(u)) {
          return `${num} ${u.charAt(0).toLowerCase()}Hz`;
        }
        if (['kbps', 'mbps', 'gbps'].includes(u)) {
          return `${num} ${u.charAt(0).toUpperCase()}bps`;
        }
        return `${num} ${unit.toUpperCase()}`;
      }
    );

    // 2. Dynamic alphanumeric / compound standards (COVID-19, 5G, 3D, 4K, B2B, IPv6, R&D)
    result = result.replace(
      /\b(covid-19|r&d|b2b|b2c|p2p|ipv4|ipv6|mp3|mp4|2d|3d|4d|4k|8k|5g|4g|3g)\b/gi,
      (match) => {
        const lower = match.toLowerCase();
        if (lower === 'covid-19') return 'COVID-19';
        if (lower === 'r&d') return 'R&D';
        if (lower === 'ipv4') return 'IPv4';
        if (lower === 'ipv6') return 'IPv6';
        return match.toUpperCase();
      }
    );

    // 3. Dynamic Roman numerals (II, III, IV, VI, VII, VIII, IX, etc.)
    result = result.replace(/\b(ii|iii|iv|vi|vii|viii|ix|xi|xii)\b/gi, (match) => match.toUpperCase());

    // 4. Token-by-token dynamic evaluation
    result = result.replace(/\b[a-zA-Z0-9]+\b/g, (match) => {
      const lower = match.toLowerCase();

      // Check if original author input intentionally formatted this keyword (e.g. CRISPR, LLM, MOU, IT)
      if (preserved.has(lower)) {
        return preserved.get(lower)!;
      }

      // Check registered / standard terms dictionary
      if (this.specialTermsMap[lower]) {
        return this.specialTermsMap[lower];
      }

      // Dynamic rule: 2-letter tokens not in common English words list (e.g. IT, AI, ML, UI, UX, OS)
      if (this.isTwoLetterAcronym(match)) {
        return match.toUpperCase();
      }

      // Dynamic rule: Vowel-less consonant tokens (e.g. NLP, SVM, CNN, PCR, RFID)
      if (this.isVowellessAcronym(match)) {
        return match.toUpperCase();
      }

      return match;
    });

    return result;
  }

  formatIssueTitle(title: string, expanded = false): string {
    if (!title) return '';

    // Step 1: Dynamically extract and preserve acronyms/mixed-case from original title
    const preservedOriginal = this.extractOriginalPreservedWords(title);

    // Step 2: Separate glued camelCase if any (e.g. 'smartCampus' -> 'smart Campus')
    const spacedTitle = title.trim().replace(/([a-z])([A-Z])/g, '$1 $2');

    // Step 3: Base sentence casing (first alphabetical character uppercase, rest lowercase)
    let sentenceCaseTitle = spacedTitle.toLowerCase();
    sentenceCaseTitle = sentenceCaseTitle.replace(/[a-z]/i, (char) => char.toUpperCase());

    // Step 4: Apply dynamic heuristics, units, and restore preserved acronyms
    const formattedTitle = this.applyDynamicFormatting(sentenceCaseTitle, preservedOriginal);

    // Step 5: Truncate to 5 words if not expanded
    const words = formattedTitle.split(/\s+/);
    return !expanded && words.length > 5
      ? words.slice(0, 5).join(' ') + '...'
      : formattedTitle;
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
