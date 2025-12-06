import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { Component, OnInit, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  UntypedFormBuilder} from '@angular/forms';
import swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { CookieService } from 'ngx-cookie-service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './externalUser-login.component.html',
  styleUrls: ['./externalUser-login.component.scss'],
  standalone: false
})
export class ExternalUserLoginComponent implements OnInit {
  registrationNumber: any; EmployeeDetails: any[] = []; regdId: any; DriveDropDown: any; showNoDataFoundMessage: boolean | undefined;
  UserData: any; isLoginFailed: boolean | undefined; EmployeeName: any; EmployeeCode: any; Department: any;
  DepartmentName: any; loadingIndicator: boolean | undefined; CandidateName: any; UserId: any;
  Designation: any; EmailId: any; MobileNo: any; UserRole: any; SupervisorName: any; ProofNumber: any; ProofName: any;
  SecretKey: any; BookId: any; name: any; isForm1Submitted: boolean = false;
  JournalTitle: any; errorMessage: any;
  UserLoginForm!: FormGroup; formdata: FormGroup;
  Email: any;
  constructor(
    public formBuilder: UntypedFormBuilder,
    private AuthSession: LoginSessionService,
    private authService: AuthService,
    private storageService: StorageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private lpuWebServices: LpujournalbookService

  ) {
    this.formdata = this.fb.group({
      Email: ['', [Validators.required, Validators.email]], // Email validation
      Password: ['', [Validators.required, Validators.minLength(6)]] // Password validation
    });
  }

  ngOnInit(): void {
    this.errorMessage = '';
    this.cookieService.delete('authData');
    this.AuthSession.clearSession();
    this.storageService.clean();
    this.BookId = this.route.snapshot.params['Id'];
    this.name = this.route.snapshot.params['name'];

    this.JournalTitle = this.name.replace(/-/g, ' ');

    this.formdata.get('Email')?.valueChanges.subscribe(() => {
      this.formdata.get('Email')?.markAsTouched();
    });
    this.formdata.get('Password')?.valueChanges.subscribe(() => {
      this.formdata.get('Password')?.markAsTouched();
    });

    this.UserLoginForm = this.fb.group({
      Email: new FormControl('', [Validators.required, this.emailValidator]),
      Password: new FormControl('', [Validators.required, Validators.minLength(6),
      ]),
    });
  }


  emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(control.value) ? null : { invalidEmail: true };
  }
  get email() {
    return this.formdata.get('Email');
  }
  get passwordText() {
    return this.formdata.get('Password');
  }
  get password() {
    return this.formdata.get('Password');
  }

  CheckUserType(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    const UserRole = Array.from(selectElement.options).findIndex(
      (option) => option.value === selectedValue
    );
  }

  OnSubmit() {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    }
    if (this.formdata.valid) {
      var DataX = this.formdata.value;
      var uid = DataX.Email ?? '';
      var password = DataX.Password ?? '';
      var encodeduid = btoa(uid);
      var encodedPassword = btoa(password);
      var userRoleX: number | null = null;

      this.submitted = true;
      this.AuthoriseUserNewWay(uid, password);

    }
  }

  LoginFailed(_NewError: any) {
    this.isLoginFailed = true;
    swal.fire({
      title: 'Login Failed',
      text: 'Login details are Invalid!',
      icon: 'warning',
    });
  }

  submitted: boolean = false;

  VisitUrl(Id: any, name: any, Sufix: any) {
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix).then(() => {
      window.location.reload();
    });
  }

  // new logic for login with create token
  Message: any;

  AuthoriseUserNewWay(Id: any, Key: any): void {
    this.isLoading = true;
    const minLoadingTime = 1500;
    const startTime = Date.now();
    let loginError: string | null = null;

    const fd = new FormData();
    fd.append('Email', Id);
    fd.append('PasswordText', Key);
    fd.append('JournalId', this.BookId);

    this.lpuWebServices.AuthoriseUserDetails(fd)
      .pipe(
        finalize(() => {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(minLoadingTime - elapsed, 0);
          setTimeout(() => {
            this.isLoading = false;
            if (loginError) {
              this.handleLoginFailure(loginError);
            }
          }, remaining);
        })
      )
      .subscribe({
        next: (response) => {
          const userDetails = response?.item1;
          if (userDetails && userDetails.length > 0) {
            const user = userDetails[0];
            this.Email = user.email;
            this.Message = user.message;
            if (user.userId > 0) {
              this.CreateToken(this.Email, response);
            } else {
              loginError = 'Invalid User Details.';
            }
          } else {
            loginError = 'Invalid User Details.';
          }
        },
        error: (err) => {
          loginError = 'Unauthorised Access.';
        },
        complete: () => {
          this.formdata.reset();
        }
      });
  }


  private handleLoginFailure(message: string): void {
    this.showNoDataFoundMessage = true;
    this.errorMessage = message;
    swal.fire({
      title: this.errorMessage,
      text: 'Check if you have selected the same Journal!',
      icon: 'warning',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        this.AuthSession.addToSession(this.UserData);
        this.VisitUrl(this.BookId, this.name, 'ExternalLogin')
      }
    });
  }


  AccessToken: any;

  CreateToken(Id: any, response: any) {
    this.authService.LoginJournalAccessTemp(Id).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.SetUserData(response);
        // this.getUserRolesforId();
      },
      error: err => {
        this.loadingIndicator = false;
        this.showNoDataFoundMessage = false;
        this.isLoginFailed = false;
      }
    });
  }


  SetUserData(response: any) {
    this.loadingIndicator = true; // show loading at start
    const user = response.item1[0];

    this.UserData = response.item1;
    this.CandidateName = this.EmployeeName = response.item1[0].candidateName;
    this.AccessToken = response.item1[0].email;
    this.Department = response.item1[0].department;
    this.DepartmentName = response.item1[0].departmentName;
    this.Designation = response.item1[0].designation;
    this.EmailId = response.item1[0].emailId;
    this.MobileNo = response.item1[0].mobileNumber;
    this.UserRole = response.item1[0].userRole;
    this.SupervisorName = response.item1[0].supervisorName;
    this.ProofNumber = btoa(response.item1[0].idProofNumber);
    this.ProofName = response.item1[0].idProofType;
    this.SecretKey = btoa(response.item1[0].passwordText);

    this.showNoDataFoundMessage = false;
    this.isLoginFailed = false;

    const userCookiesData = {
      CandidateName: this.CandidateName,
      AccessToken: this.AccessToken,
      Department: this.Department,
      DepartmentName: this.DepartmentName,
      Designation: this.Designation,
      EmailId: this.EmailId,
      MobileNo: this.MobileNo,
      UserRole: this.UserRole,
      SupervisorName: this.SupervisorName,
      ProofNumber: this.ProofNumber,
      ProofName: this.ProofName,
    };

    this.cookieService.set('authData', JSON.stringify(userCookiesData));

 this.loadingIndicator = false;
    const passwordchanged = user['isPasswordUpdated']
    // alert(passwordchanged + " " + this.UserData.isPasswordUpdated)
    if (passwordchanged != true) {
      this.AuthSession.addToSession(this.UserData);
      this.VisitUrl(this.BookId, this.name, 'SecurityIssue')
      // this.router.navigateByUrl('/SecurityIssue').then(() => {
      //   window.location.reload();
      // });
    } else {
      // swal.fire({
      //   title: 'Login Successful',
      //   text: '..',
      //   icon: 'success',
      //   confirmButtonText: 'OK'
      // }).then((result) => {
      //   if (result.isConfirmed) {

          this.AuthSession.addToSession(this.UserData);
          this.VisitUrl(this.BookId, this.name, 'SubmitManuScript')
        // }
      // });
    }
  }

  // Function to redirect based on UserRole
  RedirectToDashboard() {
    const roles = this.UserRole ? this.UserRole.split(',') : [];

    if (roles.includes('0')) {
      this.router.navigate(['/EditorDashboard']);
    } else if (roles.includes('1')) {
      this.router.navigate(['/author-dashboard']);
    } else if (roles.includes('2')) {
      this.router.navigate(['/reviewer-dashboard']);
    } else if (roles.includes('3')) {
      this.router.navigate(['/PublisherDashboard']);
    } else {
      this.router.navigate(['/default-dashboard']); // Fallback if no matching role
    }
  }

  // new code for user roles 
  UserRolesData: any;
  UserRolesArray: { value: string; label: string; id: string }[] = [];
  editorRole: boolean = false;
  authorRole: boolean = false;
  reviewerRole: boolean = false;
  publisherRole: boolean = false;

  getUserRolesforId(): void {
    const roleMapping: Record<string, string> = {
      '0': 'Editor',
      '1': 'Author',
      '2': 'Reviewer',
      '3': 'Publisher'
    };

    this.lpuWebServices.GetUserRolesforUser(this.EmailId).subscribe({
      next: (response) => {
        if (response?.item1?.length > 0) {
          this.UserRolesData = response.item1[0];

          // Ensure userRole exists before processing
          const roles = this.UserRolesData?.userRole ? this.UserRolesData.userRole.split(',') : [];

          // Reset role variables
          this.editorRole = false;
          this.authorRole = false;
          this.reviewerRole = false;
          this.publisherRole = false;

          this.UserRolesArray = roles.map((role: any) => {
            const roleKey = String(role); // Ensure role is a string
            const label = roleMapping[roleKey] || roleKey; // Use mapped label or fallback to role itself

            // Set role variables based on user role
            if (roleKey === '0') this.editorRole = true;
            if (roleKey === '1') this.authorRole = true;
            if (roleKey === '2') this.reviewerRole = true;
            if (roleKey === '3') this.publisherRole = true;

            return {
              value: roleKey,
              label,
              id: label.replace(/\s+/g, '') // Safe to call replace() now
            };
          });
        } else {
          this.UserRolesArray = []; // Reset array if no roles found
        }
      },
      error: (err) => {
        console.error('Error fetching user roles:', err);
        this.UserRolesArray = []; // Reset array on error
        this.isLoginFailed = true;
      }
    });
  }
  showPassword: boolean = false;


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  // add logic on 30-May-25

  isLoading: boolean = false;

}