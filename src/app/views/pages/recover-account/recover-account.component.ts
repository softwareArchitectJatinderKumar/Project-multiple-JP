import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import swal from 'sweetalert2';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import Swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-recover-account',
  templateUrl: './recover-account.component.html',
  standalone: false,styleUrls: ['./recover-account.component.css']
})
export class RecoverAccountComponent implements OnInit {
  emailFormGroup: FormGroup;
  idProofFormGroup: FormGroup;
  resetPasswordFormGroup: FormGroup;
  BookId: any; name: any; JournalTitle:any; JournalId: any;
  idProofType: string = '';
  idProofNumber: string = '';
  errorMessage: string = '';
  userDetails: any = null; // User details fetched from API
  UserId: any;
  currentStep = 1;   
  userRole: any;
  userId: any;
  supervisorName: any;
  departmentName: any;
  candidateName: any;
  isLoginFailed: boolean =false;
  isLoading: boolean = false;
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private AuthSession: LoginSessionService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private journalWebApiService: LpujournalbookService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    // Step 1: Email form
    this.emailFormGroup = this.fb.group({
      email: new FormControl({ value: this.userId, disabled: true }, [Validators.required, Validators.email])
    });

    // Step 2: ID Proof form
    this.idProofFormGroup = this.fb.group({
      idProofNumber: ['', Validators.required]
    });

    // Step 3: Password reset form
    // this.resetPasswordFormGroup = this.fb.group({
    //   password: ['', [Validators.required, Validators.minLength(8)]],
    //   confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    // });


    this.resetPasswordFormGroup = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordsMatchValidator }
    );
  }


  passwordsMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  
  VisitUrl(Id: any, name: any, Sufix: any) {
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix).then(() => {
      window.location.reload();
    });;
  }
 

  ngOnInit() {
    var BookId = this.route.snapshot.params['Id'];
    var name = this.route.snapshot.params['name'];
    this.checkUserLogin();
    if (BookId != undefined && BookId != null) {
      this.BookId =this.JournalId= BookId;
      this.name = this.JournalTitle= name;
      this.JournalTitle = name.replace(/-/g, ' ');
    }
    this.currentStep = 1;   
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }
 
  // Step 1: Check user email
  checkEmail() {
   
    // alert( this.emailFormGroup.get('email')?.value)
    this.errorMessage ='';
    const email = this.emailFormGroup.get('email')?.value;
  
    if (!email) {
      swal.fire({
        title: 'Please enter a valid email address',
        icon: 'warning'
      });
      return;
    }
  
    this.journalWebApiService.JournalGetUserDetails(email).subscribe(
      (response: any) => {
        if (response?.item1?.length > 0) {
          const user = response.item1[0];
          this.userDetails = response.item1;
          this.idProofType = 'Mobile Number';
          this.idProofNumber = user.mobileNumber;
  
          if (this.idProofNumber?.length > 0) {
            
            this.nextStep(); // Proceed to Step 2
            this.currentStep=2;
          } else {
            this.showUserNotFound();
          }
        } else {
          this.showUserNotFound();  
        }
      },
      (error) => {
        console.error('API error:', error);
        this.showUserNotFound(); // Handle API error
      }
    );
  }
  
  checkUserLogin() {
   
    const GetCookieData = this.cookieService.get('authData');
    if (GetCookieData) {
      try {
        const retrievedCookies = JSON.parse(GetCookieData);
        this.userRole = retrievedCookies.UserRole?.length > 0 ? retrievedCookies.UserRole : -1;
        this.userId = retrievedCookies.EmailId;
        let Token = retrievedCookies.AccessToken;
        this.supervisorName = retrievedCookies.SupervisorName;
        this.departmentName = retrievedCookies.DepartmentName;
        this.candidateName = retrievedCookies.CandidateName;
        this.isLoginFailed = false;
      } catch (error) {
        console.log("error");
      }
    } else {
      this.isLoginFailed = true;
      this.LoginFalied();
    }

  }
  LoginFalied() {
    this.VisitUrl(this.BookId, this.name, 'ExternalLogin');
  }

  private showUserNotFound() {
    this.errorMessage = 'Password change for this Account is disabled ';
    swal.fire({
      title: this.errorMessage,
      icon: 'error'
    }).then(() => {
      // this.emailFormGroup.reset();
      this.currentStep = 1;
    });
  }
  
  // Step 2: Verify ID proof number
  verifyIdProof() {
    const enteredIdProofNumber = this.idProofFormGroup.get('idProofNumber')?.value;
    if (this.idProofNumber == enteredIdProofNumber) {
      // this.showStep3 = true; 
      this.nextStep();
      this.currentStep = 3;  
    } else {
      this.errorMessage = 'ID Proof number does not match';
    }
  }

  // Step 3: Reset password
  resetPassword() {
   

    const { password, confirmPassword } = this.resetPasswordFormGroup.value;
    if (password === confirmPassword) {
      // alert('Password reset successful!');
        this.UserId = this.emailFormGroup.get('email')?.value;
      const formData = new FormData();
        formData.append('UserId', this.UserId);
        formData.append('Password', password);
        this.isLoading=true;
        this.journalWebApiService.JournalUpdatePasswordDetails(formData).subscribe({
          next: (data: any) => {
            const result = data.item1[0]['msg'];
            this.isLoading = false;
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
              }).then(() => {
                window.location.reload();
              });
            } else {
              swal.fire({
                title: 'Something Went Wrong, Try again later',
                icon: 'error'
              }).then(() => {
                window.location.reload();
              });
            }
          },
          error: (error: any) => {
            swal.fire({
              title: 'Error',
              text: 'Failed to Update.',
              icon: 'error'
            }).then(() => {
              window.location.reload();
            });
          },
          complete: () => {
          }
        });
      // this.currentStep = 1; 
      // this.clearContents();
    } else {
      this.errorMessage = 'Passwords do not match';
    }
   
  }
  clearContents(){    
    this.idProofFormGroup.reset();
    this.emailFormGroup.reset();
    this.resetPasswordFormGroup.reset();
  }
}
