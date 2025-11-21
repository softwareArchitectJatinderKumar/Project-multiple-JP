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
  // Removed unnecessary simple properties for form values, as they are managed by the FormGroup
  // emailId: any = ''; candidateName: any; supervisorName: any; mobileNumber: any; instituteName: any;
  // departmentName: any; idProofType: any = 'select'; idProofNumber: any; address: any; password: any; confirmPassword: any;
  // userRole: any = 'select';

  isForm1Submitted: boolean = false;
  IdProofFileName: string | null = null;
  IdProofFile: string | null = null;
  sessionData: any[] = [];
  JournalUserAccountForm!: FormGroup;
  BookId: any; JournalId: any;
  name: any; JournalTitle: any;
  isLoading: boolean = false; // Moved up for clarity

  // Properties from the bottom of the original file, moved up for better structure
  bookData: any; JournalDetails: any; detailsArray: any;
  EditorInChief: any;
  AuthorEmailId: any;
  JournalSubTitle: any;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  // End of moved properties

  availableRoles = [
    { value: '0', label: 'Editor Login' },
    { value: '1', label: 'Author Login' },
    { value: '2', label: 'Reviewer Login' },
    // { value: '3', label: 'Publisher Login' },
  ];

  selectedRoles: string[] = [];
  dropdownOpen = false;


  constructor(
    private LpuWebService: LpujournalbookService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute,
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
    // Initializing UserRole with an empty array [] to better represent its expected final value
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
      UserRole: [[] as string[], [this.validateUserRole]] // Initialize as empty array, apply custom validator

    }, { validator: this.passwordMatchValidator });
  }


  nameValidator(control: AbstractControl): { [key: string]: any } | null {
    const namePattern = /^(Dr\. )?[A-Za-z]+( [A-Za-z]+)*$/; // Allows "Dr." prefix and spaces
    // Ensure control.value is a string before calling test()
    if (typeof control.value !== 'string') return { invalidName: true };
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

  // Refactored Validator: Check for an array and an empty array
  validateUserRole(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    // Check if value is not an array, or if it's an array with zero length
    if (!Array.isArray(value) || value.length === 0) {
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
    if (!target.closest('.dropdown-box') && !target.closest('.dropdown-options')) { // Added dropdown-options check
      this.dropdownOpen = false;
    }
  }
addRole(event: Event, role: string) {
    event.stopPropagation(); 

    if (!this.isSelected(role)) {
      this.selectedRoles.push(role);
      const control = this.JournalUserAccountForm.get('UserRole');
      // CRITICAL: Ensure the control value is set and validity is checked immediately
      control?.setValue(this.selectedRoles);
      control?.markAsTouched();
      control?.updateValueAndValidity(); // This forces the form to re-evaluate
    }
    this.dropdownOpen = false;
  }

  removeRole(event: Event, role: string) {
    event.stopPropagation();

    this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    const control = this.JournalUserAccountForm.get('UserRole');
    // CRITICAL: Ensure the control value is set and validity is checked immediately
    control?.setValue(this.selectedRoles);
    control?.markAsTouched();
    control?.updateValueAndValidity(); // This forces the form to re-evaluate
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
    // Reset selected roles array and update the form control's value/validity
    this.selectedRoles = [];
    this.JournalUserAccountForm.get('UserRole')?.setValue([]);
    this.JournalUserAccountForm.get('UserRole')?.updateValueAndValidity();

    this.isForm1Submitted = false;
  }

  VisitUrl(Id: any, name: any, Sufix: any) {
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix).then(() => {
      window.location.reload();
    });
  }


  Onsubmit(): void {
    // Only set loading if the form is about to be processed
    this.isForm1Submitted = true;

    // Trigger validation and marking as touched for all controls
    if (this.JournalUserAccountForm.invalid) {
      Object.keys(this.JournalUserAccountForm.controls).forEach((controlName) => {
        const control = this.JournalUserAccountForm.get(controlName);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    // Set loading only after passing validation
    this.isLoading = true;
    const minLoadingTime = 2500; // 2.5 seconds
    const startTime = Date.now();

    const formValue = this.JournalUserAccountForm.value;

    const formData = new FormData();

    formData.append("JournalId", this.JournalId);
    formData.append("CandidateName", formValue.CandidateName);
    formData.append("InstituteName", formValue.InstituteName);
    formData.append("DepartmentName", formValue.DepartmentName);
    formData.append("Designation", formValue.Designation);
    formData.append("Address", formValue.Address);
    // Ensure both parts of the mobile number are used
    formData.append("MobileNumber", formValue.CountryCode + " " + formValue.MobileNumber);
    formData.append("UserEmail", formValue.EmailId);
    formData.append("PasswordText", formValue.Password);
    // Check if AuthorEmailId exists before appending (original code had it, so keeping the structure)
    if (this.AuthorEmailId) {
        formData.append("AuthorEmailId", this.AuthorEmailId);
    }

    // Append all selected roles
    if (Array.isArray(formValue.UserRole)) {
        formValue.UserRole.forEach((role: string) => {
            formData.append("UserType[]", role);
        });
    }

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
                // Consider a non-reload action for better UX, but keeping original logic
                window.location.reload();
              });
            } else {
              Swal.fire({ title: 'Some Technical Issue', text: result, icon: 'error' }).then(() => {
                // Consider a non-reload action for better UX, but keeping original logic
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

  GetJournalDetailsAbout(JournalId: any): void {
    this.journalWebApiService.GetJournalDetailsforAboutPage(JournalId).subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.bookData = response.item1[0];
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

}
// import { AbstractControl, FormControl, FormGroup, UntypedFormGroup, ValidatorFn } from '@angular/forms';
// import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AuthService } from 'src/app/_services/auth.service';
// import { StorageService } from 'src/app/_services/storage.service';
// import { Validators } from '@angular/forms';
// import Swal from 'sweetalert2';
// import { LoginSessionService } from 'src/app/_services/login-session.service';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import { CookieService } from 'ngx-cookie-service';
// import { finalize } from 'rxjs';

// @Component({
//   selector: 'app-new-registration-page',
//   templateUrl: './new-registration-page.component.html',
//   styleUrls: ['./new-registration-page.component.scss'],
//   standalone: false
// })
// export class NewRegistrationPageComponent implements OnInit {
//   emailId: any = ''; candidateName: any; supervisorName: any; mobileNumber: any; instituteName: any;
//   departmentName: any; idProofType: any = 'select'; idProofNumber: any; address: any; password: any; confirmPassword: any;
//   userRole: any = 'select';

//   isForm1Submitted: boolean = false;
//   IdProofFileName: string | null = null;
//   IdProofFile: string | null = null;
//   sessionData: any[] = [];
//   JournalUserAccountForm!: FormGroup;
//   BookId: any; JournalId: any;
//   name: any; JournalTitle: any;

//   constructor(
//     private LpuWebService: LpujournalbookService,
//     private fb: FormBuilder, private router: Router,
//     private route: ActivatedRoute,
//     private journalWebApiService: LpujournalbookService
//   ) { }

//   ngOnInit(): void {
//     var BookId = this.route.snapshot.params['Id'];
//     var name = this.route.snapshot.params['name'];
//     if (BookId != undefined && BookId != null) {
//       this.BookId = this.JournalId = BookId;
//       this.name = this.JournalTitle = name;
//       this.JournalTitle = name.replace(/-/g, ' ');
//       this.GetJournalDetailsAbout(this.BookId);
//     }
//     this.LoadForm();
//   }

//   LoadForm() {

//     this.JournalUserAccountForm = this.fb.group({
//       CandidateName: ['', [Validators.required, this.nameValidator]],
//       EmailId: ['', [Validators.required, Validators.email]],
//       InstituteName: ['', Validators.required],
//       DepartmentName: ['', Validators.required],
//       Designation: ['', Validators.required],
//       CountryCode: ['', Validators.required],
//       MobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{6,10}$/)]],
//       Address: ['', Validators.required],
//       Password: ['', [Validators.required, Validators.minLength(6)]],
//       ConfirmPassword: ['', Validators.required],
//       UserRole: [null, [this.validateUserRole]]

//     }, { validator: this.passwordMatchValidator });
//   }


//   nameValidator(control: any) {
//     const namePattern = /^(Dr\. )?[A-Za-z]+( [A-Za-z]+)*$/; // Allows "Dr." prefix and spaces
//     return namePattern.test(control.value) ? null : { invalidName: true };
//   }


//   passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
//     const password = formGroup.get('Password')?.value;
//     const confirmPassword = formGroup.get('ConfirmPassword')?.value;
//     if (password !== confirmPassword) {
//       return { mismatch: true };
//     }
//     return null;
//   }

//   get form1() {
//     return this.JournalUserAccountForm.controls;
//   }

//   availableRoles = [
//     { value: '0', label: 'Editor Login' },
//     { value: '1', label: 'Author Login' },
//     { value: '2', label: 'Reviewer Login' },
//     // { value: '3', label: 'Publisher Login' },
//   ];

//   selectedRoles: string[] = [];
//   dropdownOpen = false;

//   validateUserRole(control: AbstractControl): { [key: string]: any } | null {
//     const value = control.value;
//     if (!value || !Array.isArray(value) || value.length === 0 || value.includes('select')) {
//       return { invalidRole: true };
//     }
//     return null;
//   }

//   toggleDropdown(event: Event) {
//     this.dropdownOpen = !this.dropdownOpen;
//     event.stopPropagation();
//   }

//   @HostListener('document:click', ['$event'])
//   closeDropdown(event: Event) {
//     const target = event.target as HTMLElement;
//     if (!target.closest('.dropdown-box')) {
//       this.dropdownOpen = false;
//     }
//   }

//   addRole(event: Event, role: string) {
//     if (!this.isSelected(role)) {
//       this.selectedRoles.push(role);
//       const control = this.JournalUserAccountForm.get('UserRole');
//       control?.setValue(this.selectedRoles);
//       control?.markAsTouched();
//       control?.updateValueAndValidity();
//     }
//     this.dropdownOpen = false;
//     event.stopPropagation();
//   }

//   removeRole(event: Event, role: string) {
//     this.selectedRoles = this.selectedRoles.filter(r => r !== role);
//     const control = this.JournalUserAccountForm.get('UserRole');
//     control?.setValue(this.selectedRoles);
//     control?.markAsTouched();
//     control?.updateValueAndValidity();
//     event.stopPropagation();
//   }

//   isSelected(role: string): boolean {
//     return this.selectedRoles.includes(role);
//   }

//   getRoleLabel(role: string): string {
//     const selectedRole = this.availableRoles.find(r => r.value === role);
//     return selectedRole ? selectedRole.label : '';
//   }

//   OnReset(): void {
//     this.JournalUserAccountForm.reset();
//     this.isForm1Submitted = false;
//   }

//   VisitUrl(Id: any, name: any, Sufix: any) {
//     this.router.navigateByUrl(Id + '/' + name + '/' + Sufix).then(() => {
//       window.location.reload();
//     });
//   }
//   isLoading: boolean = false;

//   Onsubmit(): void {
//     this.isLoading = true;
//     const minLoadingTime = 2500; // 2.5 seconds
//     const startTime = Date.now();
//     this.isForm1Submitted = true;
//     if (this.JournalUserAccountForm.invalid) {
//       Object.keys(this.JournalUserAccountForm.controls).forEach((controlName) => {
//         const control = this.JournalUserAccountForm.get(controlName);
//         if (control) {
//           control.markAsTouched();
//         }
//       });
//       return;
//     }

//     const formValue = this.JournalUserAccountForm.value;
//     if (this.JournalUserAccountForm.valid) {
//       const formData = new FormData();

//       formData.append("JournalId", this.JournalId);
//       formData.append("CandidateName", formValue.CandidateName);
//       formData.append("InstituteName", formValue.InstituteName);
//       formData.append("DepartmentName", formValue.DepartmentName);
//       formData.append("Designation", formValue.Designation);
//       formData.append("Address", formValue.Address);
//       formData.append("MobileNumber", formValue.CountryCode + " " + formValue.MobileNumber);
//       formData.append("UserEmail", formValue.EmailId);
//       formData.append("PasswordText", formValue.Password);
//       formData.append("AuthorEmailId", this.AuthorEmailId);

//       formValue.UserRole.forEach((role: string) => {
//         formData.append("UserType[]", role);
//       });

//       this.LpuWebService.AddJournalUserAccount(formData)
//         .pipe(
//           finalize(() => {
//             const elapsed = Date.now() - startTime;
//             const remaining = Math.max(minLoadingTime - elapsed, 0);
//             setTimeout(() => {
//               this.isLoading = false;
//             }, remaining);
//           })
//         )
//         .subscribe({
//           next: (data) => {
//             let result = data.item1[0]['msg'];
//             let errorCode = data.item1[0]['returnId'];

//             if (result === 'Success') {
//               Swal.fire({
//                 title: 'User Login Created Successfully',
//                 text: result,
//                 icon: 'success',
//               }).then(() => {
//                 this.router.navigateByUrl(this.BookId + '/' + this.name + '/' + 'ExternalLogin');
//               });
//             } else if (result === 'Failed') {
//               Swal.fire({ title: 'User Already Exists', icon: 'error' }).then(() => {
//                 window.location.reload();
//               });
//             } else {
//               Swal.fire({ title: 'Some Technical Issue', text: result, icon: 'error' }).then(() => {
//                 window.location.reload();
//               });
//             }
//           },
//           error: () => {
//             Swal.fire({
//               title: 'Error Occurred',
//               text: 'Unable to complete the request. Please try again later.',
//               icon: 'error',
//             });
//           }
//         });
//     }

//   }
//   // Added on 14-5-25
//   bookData: any; JournalDetails: any; detailsArray: any;
//   EditorInChief: any;
//   AuthorEmailId: any;
//   JournalSubTitle: any;

//   GetJournalDetailsAbout(JournalId: any): void {
//     this.journalWebApiService.GetJournalDetailsforAboutPage(JournalId).subscribe((response) => {
//       if (response.item1 && response.item1.length > 0) {
//         this.bookData = response.item1[0];
//         // console.info('Bookdata '+JSON.stringify(this.bookData));
//         this.JournalDetails = this.bookData['journalDetails']
//         this.EditorInChief = this.bookData?.editorName;
//         this.AuthorEmailId = this.bookData?.authorEmailId;
//         this.JournalSubTitle = this.bookData?.subTitle;
//       }
//       else {
//         this.bookData = [];
//         this.LoginFalied();
//       }
//     });

//   }

//   LoginFalied() {
//     Swal.fire({
//       title: 'Error Occurred',
//       text: 'Unable to complete the request. Please try again later.',
//       icon: 'error',
//       confirmButtonText: 'OK'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.VisitUrl(this.BookId, this.name, 'ExternalLogin');
//       }
//     });
//   }



//   // added on 15-5-25

//   showPassword: boolean = false;
//   showConfirmPassword: boolean = false;

// }
