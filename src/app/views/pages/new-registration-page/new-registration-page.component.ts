import { AbstractControl, FormControl, FormGroup, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { CookieService } from 'ngx-cookie-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-new-registration-page',
  templateUrl: './new-registration-page.component.html',
  styleUrls: ['./new-registration-page.component.scss'],
  standalone: false
})
export class NewRegistrationPageComponent implements OnInit {
  emailId: any = ''; candidateName: any; supervisorName: any; mobileNumber: any; instituteName: any;
  departmentName: any; idProofType: any = 'select'; idProofNumber: any; address: any; password: any; confirmPassword: any;
  userRole: any = 'select';

  isForm1Submitted: boolean = false;
  IdProofFileName: string | null = null;
  IdProofFile: string | null = null;
  sessionData: any[] = [];
  JournalUserAccountForm!: FormGroup;
  BookId: any; JournalId: any;
  name: any; JournalTitle: any;

  constructor(
    private LpuWebService: LpujournalbookService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private authService: AuthService,
    private AuthSession: LoginSessionService,
    private cookieService: CookieService,
    private journalWebApiService: LpujournalbookService
  ) { }

  ngOnInit(): void {
    var BookId = this.route.snapshot.params['Id'];
    var name = this.route.snapshot.params['name'];
    if (BookId != undefined && BookId != null) {
      this.BookId = this.JournalId = BookId;
      this.name = this.JournalTitle = name;
      this.JournalTitle = name.replace(/-/g, ' ');
      this.GetJournalDetailsAbout(this.BookId);
    }
    this.LoadForm();
  }

  LoadForm() {

    this.JournalUserAccountForm = this.fb.group({
      CandidateName: ['', [Validators.required, this.nameValidator]],
      EmailId: ['', [Validators.required, Validators.email]],
      InstituteName: ['', Validators.required],
      DepartmentName: ['', Validators.required],
      Designation: ['', Validators.required],
      CountryCode: ['', Validators.required],
      MobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{6,10}$/)]],
      Address: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['', Validators.required],
      UserRole: [null, [this.validateUserRole]]

    }, { validator: this.passwordMatchValidator });
  }


  nameValidator(control: any) {
    const namePattern = /^(Dr\. )?[A-Za-z]+( [A-Za-z]+)*$/; // Allows "Dr." prefix and spaces
    return namePattern.test(control.value) ? null : { invalidName: true };
  }

  
  passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get('Password')?.value;
    const confirmPassword = formGroup.get('ConfirmPassword')?.value;
    if (password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  get form1() {
    return this.JournalUserAccountForm.controls;
  }

  availableRoles = [
    { value: '0', label: 'Editor Login' },
    { value: '1', label: 'Author Login' },
    { value: '2', label: 'Reviewer Login' },
    // { value: '3', label: 'Publisher Login' },
  ];

  selectedRoles: string[] = [];
  dropdownOpen = false;
 
  validateUserRole(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value || !Array.isArray(value) || value.length === 0 || value.includes('select')) {
      return { invalidRole: true };
    }
    return null;
  }

  toggleDropdown(event: Event) {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-box')) {
      this.dropdownOpen = false;
    }
  }

  addRole(event: Event, role: string) {
    if (!this.isSelected(role)) {
      this.selectedRoles.push(role);
      const control = this.JournalUserAccountForm.get('UserRole');
      control?.setValue(this.selectedRoles);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    }
    this.dropdownOpen = false;
    event.stopPropagation();
  }

  removeRole(event: Event, role: string) {
    this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    const control = this.JournalUserAccountForm.get('UserRole');
    control?.setValue(this.selectedRoles);
    control?.markAsTouched();
    control?.updateValueAndValidity();
    event.stopPropagation();
  }

  isSelected(role: string): boolean {
    return this.selectedRoles.includes(role);
  }

  getRoleLabel(role: string): string {
    const selectedRole = this.availableRoles.find(r => r.value === role);
    return selectedRole ? selectedRole.label : '';
  }

  OnReset(): void {
    this.JournalUserAccountForm.reset();
    this.isForm1Submitted = false;
  }

  VisitUrl(Id: any, name: any, Sufix: any) {
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix).then(() => {
      window.location.reload();
    });
  }
  isLoading: boolean = false;

  Onsubmit(): void {
    this.isLoading = true;
    const minLoadingTime = 2500; // 2.5 seconds
    const startTime = Date.now();
    this.isForm1Submitted = true;
    if (this.JournalUserAccountForm.invalid) {
      Object.keys(this.JournalUserAccountForm.controls).forEach((controlName) => {
        const control = this.JournalUserAccountForm.get(controlName);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    const formValue = this.JournalUserAccountForm.value;
    if (this.JournalUserAccountForm.valid) {
      const formData = new FormData();

      formData.append("JournalId", this.JournalId);
      formData.append("CandidateName", formValue.CandidateName);
      formData.append("InstituteName", formValue.InstituteName);
      formData.append("DepartmentName", formValue.DepartmentName);
      formData.append("Designation", formValue.Designation);
      formData.append("Address", formValue.Address);
      formData.append("MobileNumber", formValue.CountryCode + " " + formValue.MobileNumber);
      formData.append("UserEmail", formValue.EmailId);
      formData.append("PasswordText", formValue.Password);
      formData.append("AuthorEmailId", this.AuthorEmailId);

      // Append multiple selected roles
      formValue.UserRole.forEach((role: string) => {
        formData.append("UserType[]", role);
      });

      this.LpuWebService.AddJournalUserAccount(formData)
        .pipe(
          finalize(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(minLoadingTime - elapsed, 0);
            setTimeout(() => {
              this.isLoading = false;
            }, remaining);
          })
        )
        .subscribe({
          next: (data) => {
            let result = data.item1[0]['msg'];
            let errorCode = data.item1[0]['returnId'];

            if (result === 'Success') {
              Swal.fire({
                title: 'User Login Created Successfully',
                text: result,
                icon: 'success',
              }).then(() => {
                this.router.navigateByUrl(this.BookId + '/' + this.name + '/' + 'ExternalLogin');
              });
            } else if (result === 'Failed') {
              Swal.fire({ title: 'User Already Exists', icon: 'error' }).then(() => {
                window.location.reload();
              });
            } else {
              Swal.fire({ title: 'Some Technical Issue', text: result, icon: 'error' }).then(() => {
                window.location.reload();
              });
            }
          },
          error: () => {
            Swal.fire({
              title: 'Error Occurred',
              text: 'Unable to complete the request. Please try again later.',
              icon: 'error',
            });
          }
        });
    }

  }
  // Added on 14-5-25
  bookData: any; JournalDetails: any; detailsArray: any;
  EditorInChief: any;
  AuthorEmailId: any;
  JournalSubTitle: any;

  GetJournalDetailsAbout(JournalId: any): void {
    this.journalWebApiService.GetJournalDetailsforAboutPage(JournalId).subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.bookData = response.item1[0];
        // console.info('Bookdata '+JSON.stringify(this.bookData));
        this.JournalDetails = this.bookData['journalDetails']
        this.EditorInChief = this.bookData?.editorName;
        this.AuthorEmailId = this.bookData?.authorEmailId;
        this.JournalSubTitle = this.bookData?.subTitle;
      }
      else {
        this.bookData = [];
        this.LoginFalied();
      }
    });

  }

  LoginFalied() {
    Swal.fire({
      title: 'Error Occurred',
      text: 'Unable to complete the request. Please try again later.',
      icon: 'error',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        this.VisitUrl(this.BookId, this.name, 'ExternalLogin');
      }
    });
  }



  // added on 15-5-25

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

}
