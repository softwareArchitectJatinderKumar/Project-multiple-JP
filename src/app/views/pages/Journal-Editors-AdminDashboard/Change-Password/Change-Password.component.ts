import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import swal from 'sweetalert2';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import Swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-Change-Password',
  templateUrl: './Change-Password.component.html',
  standalone: false,styleUrls: ['./Change-Password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
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


  isDisabled: any = true;
  
  UserRole: any;
  user_Email: any;
  supervisorName: any;
  departmentName: any;
  candidateName: any;
  LoginStatus: boolean = false;

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
    this.emailFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.idProofFormGroup = this.fb.group({
      idProofNumber: ['', Validators.required]
    });

    this.resetPasswordFormGroup = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  VisitUrl(Id: any, name: any, Sufix: any) {
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix).then(() => {
      window.location.reload();
    });;
  }


  ngOnInit() {
    var BookId = this.route.snapshot.params['Id'];
    var name = this.route.snapshot.params['name'];
    if (BookId != undefined && BookId != null) {
      this.BookId =this.JournalId= BookId;
      this.name = this.JournalTitle= name;
      this.JournalTitle = name.replace(/-/g, ' ');
    }
    this.LoginStatus = this.checkUserLogin();
    if( this.user_Email.length>4)
    {
        this.checkEmail();        
    }
    else{
        this.LoginStatus=false
    }
  }

  checkUserLogin() {
    const GetCookieData = this.cookieService.get('authData');
    if (GetCookieData) {
      try {
        const retrievedCookies = JSON.parse(GetCookieData);
        this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
        this.user_Email = retrievedCookies.EmailId;
        this.supervisorName = retrievedCookies.SupervisorName?.length > 0 ? retrievedCookies.SupervisorName : 'N-A';
        this.departmentName = retrievedCookies.DepartmentName?.length > 0 ? retrievedCookies.DepartmentName : 'N-A';;
        this.candidateName = retrievedCookies.CandidateName;
        return true;
      } catch (error) {
        console.error("Error parsing cookies:", error);
        return false;
      }
    } else {
      return false;
    }
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
    const email = this.user_Email;
      this.journalWebApiService.JournalGetUserDetails(email).subscribe(
      (response: any) => {
        if (response.item1 && response.item1.length > 0 ) {
          this.userDetails = response.item1;
          this.idProofType = 'Mobile Number';
          this.idProofNumber = this.userDetails[0].mobileNumber;
          this.nextStep();  
          this.currentStep=1;
        } else {
          this.errorMessage = 'No user found or account is locked';
        }
      },
      (error) => {
        this.errorMessage = 'An error occurred while fetching the user details';
      }
    );
  }

  // Step 1: Verify ID proof number
  verifyIdProof() {
    const enteredIdProofNumber = this.idProofFormGroup.get('idProofNumber')?.value;
    if (this.idProofNumber == enteredIdProofNumber) {
      // this.showStep3 = true; 
      this.nextStep();
      this.currentStep = 2;  
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
        // formData.forEach((value, key) => {
        //   console.log(`${key}: ${value}`);
        // });
        this.journalWebApiService.JournalUpdatePasswordDetails(formData).subscribe({
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
