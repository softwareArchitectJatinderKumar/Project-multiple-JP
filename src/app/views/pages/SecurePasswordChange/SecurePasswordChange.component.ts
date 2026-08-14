import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { AuthService } from 'src/app/_services/auth.service';

interface UserDetails {
  candidateName?: string;
  supervisorName?: string;
  mobileNumber?: string;
  organisation?: string;
  departmentName?: string;
  address?: string;
  emailId?: string;
  userRole?: number;
  department?: string;
}

interface ApiResponse {
  item1: UserDetails[];
}

@Component({
  selector: 'app-securePasswordChange',
  templateUrl: './SecurePasswordChange.component.html',
  styleUrls: ['./SecurePasswordChange.component.scss']
})
export class SecurePasswordChangeComponent implements OnInit {
  resetForm: FormGroup;
  isSubmitting = false;
  isVerifying = false;
  isVerified = false;
  userDetails: UserDetails | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  securityMessage = 'For security reasons, you must update your password before continuing.';
  // securityMessage = 'For security reasons, please verify your mobile number before updating your password.';
  userEmail: string = '';
   BookId: any; name: any; JournalTitle:any; JournalId: any;
  idProofType: string = '';
  idProofNumber: string = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private authSession: LoginSessionService,
    private lpuWebServices: LpujournalbookService,
    private route: ActivatedRoute,
    private journalWebApiService: LpujournalbookService,
     
     
  ) {
    this.resetForm = this.fb.group({
      emailId: [{ value: '', disabled: true }],
      mobileNumber: ['', [Validators.required]],
      newPassword: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: [{ value: '', disabled: true }, [Validators.required]]
    }, { validators: this.passwordMatchValidator.bind(this) });
  }

  ngOnInit(): void {
     var BookId = this.route.snapshot.params['Id'];
    var name = this.route.snapshot.params['name'];
    if (BookId != undefined && BookId != null) {
      this.BookId =this.JournalId= BookId;
      this.name = this.JournalTitle= name;
      this.JournalTitle = name.replace(/-/g, ' ');
    }
    this.loadUserDetails();

  }

  private loadUserDetails(): void {
    const cookieData = this.cookieService.get('authData');
    if (!cookieData) {

      swal.fire({
        title: 'Login Error ',
        text: 'Try Again',
        icon: 'error',
      }).then(() => {
        this.router.navigateByUrl(this.BookId + '/' + this.name + '/' + 'ExternalLogin');
      });

      // return;
    }

    const parsedData = JSON.parse(cookieData);
    this.userEmail = parsedData.EmailId;

    this.lpuWebServices.JournalGetUserDetails(this.userEmail).subscribe({
      next: (data: ApiResponse) => {
        this.userDetails = data.item1[0];
        this.resetForm.patchValue({
          emailId: this.userDetails.emailId || ''
        });
      },
      error: (error) => {
        console.error('Failed to load user details:', error);
        this.errorMessage = 'Unable to load user details. Please log in again.';
        this.router.navigate(['/Login']);
      }
    });
  }

  verifyIdentity(): void {
    if (!this.userDetails) {
      this.errorMessage = 'User details not loaded.';
      return;
    }

    const enteredMobile = this.resetForm.get('mobileNumber')?.value;
    if (!enteredMobile) {
      this.errorMessage = 'Please enter your registered mobile number.';
      return;
    }

    this.isVerifying = true;
    this.errorMessage = null;

    if (enteredMobile === this.userDetails.mobileNumber) {
      this.isVerified = true;
      this.isVerifying = false;
      this.successMessage = 'Mobile number verified successfully!';
      setTimeout(() => { this.successMessage = null; }, 3000);

      this.resetForm.get('newPassword')?.enable();
      this.resetForm.get('confirmNewPassword')?.enable();
      this.resetForm.get('mobileNumber')?.disable();
    } else {
      this.isVerifying = false;
      this.resetForm.get('mobileNumber')?.setErrors({ mismatch: true });
      this.errorMessage = 'Mobile number does not match our records.';
    }
  }

  onSubmit(): void {
    if (!this.isVerified || this.resetForm.invalid || this.isSubmitting) {
      this.errorMessage = 'Please verify your mobile and complete the form.';
      return;
    }

    this.isSubmitting = true;
    const { newPassword } = this.resetForm.getRawValue();
    const formData = new FormData();
    formData.append('UserId', this.userEmail);
    formData.append('Password', newPassword);

    this.lpuWebServices.JournalUpdatePasswordSecure(formData).subscribe({
      next: (data: any) => {
        const result = data.item1[0]['msg'];

        if (result === 'Success') {
                      swal.fire({
                        title: 'Details Updated Successfully!',
                        text: 'You will be logeed out ',
                        icon: 'success'
                      }).then(() => {
                        this.router.navigateByUrl(this.BookId + '/' + this.name + '/' + 'ExternalLogin');
                      });
                    } else if (result === 'Failed') {
                      swal.fire({
                        title: 'Unable to Update Details Try Again Later ',
                        icon: 'error'
                      });
                    } else {
                      swal.fire({
                        title: 'Something Went Wrong, Try again later',
                        icon: 'error'
                      });
                    }

        if (result === 'Success') {
          swal.fire({
            title: 'Password Updated Successfully!',
            text: 'You will be logged out shortly.',
            icon: 'success'
          }).then(() => this.router.navigateByUrl('Home'));
        } else {
          swal.fire({
            title: 'Update Failed',
            text: 'Please try again later.',
            icon: 'error'
          });
        }
      },
      error: () => {
        swal.fire('Error', 'Failed to update password.', 'error')
          ;
      }
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('newPassword')?.value;
    const confirmPass = control.get('confirmNewPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }

  get newPassword() { return this.resetForm.get('newPassword'); }
  get confirmNewPassword() { return this.resetForm.get('confirmNewPassword'); }
  get mobileNumber() { return this.resetForm.get('mobileNumber'); }
}

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// import { Router } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service'; 
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import swal from 'sweetalert2';
// import { LoginSessionService } from 'src/app/_services/login-session.service';
// ;
// import { AuthService } from 'src/app/_services/auth.service';

// interface UserDetails {
//   candidateName?: string;
//   supervisorName?: string;
//   mobileNumber?: string;
//   organisation?: string;
//   departmentName?: string;
//   idProofType?: string;
//   idProofNumber?: string;
//   address?: string;
//   emailId?: string;
//   userRole?: number;
//   department?: string;
//   // Add other fields as needed
// }

// interface ApiResponse {
//   item1: UserDetails[];
// }

// @Component({
//   selector: 'app-securePasswordChange',
//   templateUrl: './SecurePasswordChange.component.html',
//   styleUrls: ['./SecurePasswordChange.component.scss']
// })
// export class SecurePasswordChangeComponent implements OnInit {
//   resetForm: FormGroup;
//   isSubmitting = false;
//   isVerifying = false;
//   isVerified = false;
//   userDetails: UserDetails | null = null;
//   errorMessage: string | null = null;
//   successMessage: string | null = null;
//   securityMessage = 'For security reasons, you must update your password before continuing.';
//   UserEmail: any;
//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router,
//     private cookieService: CookieService,
//     private authSession: LoginSessionService, // For post-reset session
//     private lpuWebServices: LpujournalbookService
//   ) {
//     this.resetForm = this.fb.group({
//       // Identity Verification Section
//       mobileNumber: [{ value: '', disabled: true }, Validators.required],
//       idProofType: [{ value: '', disabled: true }, Validators.required],
//       idProofNumber: ['', [Validators.required]],

//       // Password Section (initially disabled)
//       newPassword: ['', [Validators.required, Validators.minLength(8)]],
//       confirmNewPassword: ['', [Validators.required]]
//     }, { validators: this.passwordMatchValidator });
//   }
//   togglePasswordVisibility(field: 'newPassword' | 'confirmNewPassword'): void {
//     const input = document.getElementById(field) as HTMLInputElement;
//     input.type = input.type === 'password' ? 'text' : 'password';
//   }

//   ngOnInit(): void {
//     this.loadUserDetails();
//   }

//   private loadUserDetails(): void {

//     const GetCookieData = this.cookieService.get('authData');
//     if (!GetCookieData) {
//       return;
//     }
//     const retrievedCookies = JSON.parse(GetCookieData);
//     this.UserEmail = retrievedCookies.EmailId;
//     this.lpuWebServices.JournalGetUserDetails(retrievedCookies.EmailId).subscribe({
//       next: (data: ApiResponse) => {
//         this.userDetails = data.item1[0]; // As per your snippet
//         // console.log('User  Details:', JSON.stringify(this.userDetails));

//         // Patch read-only fields
//         this.resetForm.patchValue({
//           mobileNumber: this.userDetails.mobileNumber || '',
//           idProofType: this.userDetails.idProofType || ''
//         });

//         // Disable password fields until verified
//         this.resetForm.get('newPassword')?.disable();
//         this.resetForm.get('confirmNewPassword')?.disable();
//       },
//       error: (error) => {
//         console.error('Failed to load user details:', error);
//         this.errorMessage = 'Failed to load user details. Please log in again.';
//         // Optional: alert(this.errorMessage);
//         this.router.navigate(['/Login']);
//       }
//     });
//   }

//   // Verify identity
//   verifyIdentity(): void {
//     if (!this.userDetails) {
//       this.errorMessage = 'User  details not loaded.';
//       return;
//     }

//     const enteredIdProofNumber = this.resetForm.get('idProofNumber')?.value;
//     if (!enteredIdProofNumber) {
//       this.errorMessage = 'Please enter your ID Proof Number.';
//       return;
//     }

//     this.isVerifying = true;
//     this.errorMessage = null;

//     // Client-side match (insecure for prod; replace with backend API)
//     if (enteredIdProofNumber === this.userDetails.idProofNumber) {
//       this.isVerified = true;
//       this.isVerifying = false;
//       this.successMessage = 'Identity verified successfully!';
//       // Clear after 3s
//       setTimeout(() => { this.successMessage = null; }, 3000);

//       // Enable password fields
//       this.resetForm.get('newPassword')?.enable();
//       this.resetForm.get('confirmNewPassword')?.enable();

//       // Disable idProofNumber after verification
//       this.resetForm.get('idProofNumber')?.disable();
//     } else {
//       this.isVerifying = false;
//       this.resetForm.get('idProofNumber')?.setErrors({ mismatch: true });
//       this.errorMessage = 'Invalid details. Please try again.';
//     }
//   }

//   onSubmit(): void {
//     if (!this.isVerified || this.resetForm.invalid || this.isSubmitting) {
//       this.errorMessage = 'Please verify identity and complete the form.';
//       return;
//     }

//     this.isSubmitting = true;
//     this.errorMessage = null;
//     const { newPassword } = this.resetForm.value;
//     const formData = new FormData();
//     formData.append('UserId', this.UserEmail);
//     formData.append('Password', newPassword);

//     this.lpuWebServices.JournalUpdatePasswordSecure(formData).subscribe({
//       next: (data: any) => {
//         const result = data.item1[0]['msg'];
//         if (result === 'Success') {
//           swal.fire({
//             title: 'Details Updated Successfully!',
//             text: 'You will be logeed out ',
//             icon: 'success'
//           }).then(() => {
//             this.router.navigateByUrl('cifWebPortal');
//             // this.router.navigate(['/cifWebPortal']);
//           });
//         } else if (result === 'Failed') {
//           swal.fire({
//             title: 'Unable to Update Details Try Again Later ',
//             icon: 'error'
//           }).then(() => {
//             window.location.reload();
//           });
//         } else {
//           swal.fire({
//             title: 'Something Went Wrong, Try again later',
//             icon: 'error'
//           }).then(() => {
//             window.location.reload();
//           });
//         }

//       },
//       error: (error: any) => {
//         swal.fire({
//           title: 'Error',
//           text: 'Failed to Update.',
//           icon: 'error'
//         }).then(() => {
//           window.location.reload();
//         });
//       },
//       complete: () => {
//       }
//     });

//   }

//   // Custom validator: Password match
//   passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
//     if (!this.isVerified) return null;
//     const newPassword = control.get('newPassword')?.value;
//     const confirmNewPassword = control.get('confirmNewPassword')?.value;
//     return newPassword === confirmNewPassword ? null : { mismatch: true };
//   }

//   // Getters for template
//   get idProofNumber() { return this.resetForm.get('idProofNumber'); }
//   get newPassword() { return this.resetForm.get('newPassword'); }
//   get confirmNewPassword() { return this.resetForm.get('confirmNewPassword'); }

//   // Clear messages
//   clearMessages(): void {
//     this.errorMessage = null;
//     this.successMessage = null;
//   }
// }
