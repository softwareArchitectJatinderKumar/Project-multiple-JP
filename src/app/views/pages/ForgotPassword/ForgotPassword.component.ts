

import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';

import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import swal from 'sweetalert2';
import { MouDocumentsService } from 'src/app/_services/mou-documents.service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';



@Component({
  selector: 'app-ForgotPassword',
  templateUrl: './ForgotPassword.component.html',
  styleUrls: ['./ForgotPassword.component.scss'],standalone: false
})
export class ForgotPasswordComponent implements OnInit {

  emailFormGroup: FormGroup;
  BookId: any; name: any; JournalTitle:any; JournalId: any;
  idProofType: string = '';
  idProofNumber: string = '';
  errorMessage: string = '';
  userDetails: any = null; // User details fetched from API
  UserId: any;
  currentStep = 1;   
  formdata: any; consentFormGroup!: FormGroup;  verifiedEmail: any;
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
      email: ['', [Validators.required, Validators.email]]
    });

    // Step 2: Consent Form 
    this.consentFormGroup = this.fb.group({
      consent: [false, Validators.requiredTrue]
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
          this.verifiedEmail= email;
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
  
  private showUserNotFound() {
    this.errorMessage = 'No user found or account is locked';
    swal.fire({
      title: this.errorMessage,
      icon: 'error'
    }).then(() => {
      this.emailFormGroup.reset();
      this.currentStep = 1;
    });
  }
  
  verifyIdProof() {
     
  }
  resetPassword() {
    const newPassword = this.generateRandomPassword();
    this.EmailresetPassword(newPassword);
  }


  generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
    
  // // Step 3: Reset password

  EmailresetPassword(NewPassword: any) {
    this.isLoading = true;
    const minLoadingTime = 2500; // 2.5 seconds
    const startTime = Date.now();
  
    this.UserId = this.emailFormGroup.get('email')?.value;
    const formData = new FormData();
    formData.append('UserId', this.verifiedEmail); // Or use this.UserId
    formData.append('Password', NewPassword);
  
    this.journalWebApiService.JournalUpdatePasswordDetails(formData)
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
        next: (data: any) => {
          const result = data.item1[0]['msg'];
          if (result === 'Success') {
            swal.fire({
              title: 'Password is reset, Check Email!',
              text: '.',
              icon: 'success'
            }).then(() => {
              this.router.navigateByUrl(`${this.BookId}/${this.name}/ExternalLogin`);
            });
          } else {
            swal.fire({
              title: 'Unable to Update Details. Try Again Later.',
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
        }
      });
  }
  
  clearContents(){    
    this.emailFormGroup.reset();
    this.consentFormGroup.reset();
  }


  // add logic on 30-May-25

  isLoading: boolean= false;
}
