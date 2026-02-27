import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';

import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import Swal from 'sweetalert2';
import { MouDocumentsService } from 'src/app/_services/mou-documents.service';



@Component({
  selector: 'app-Eds-LoginPage',
  templateUrl: './Eds-LoginPage.component.html',
  styleUrls: ['./Eds-LoginPage.component.scss'],
  standalone: false
})
export class EdsLoginPageComponent implements OnInit {

  registrationNumber: any; BookId: any; name: any;
  EmployeeDetails: any[] = [];
  regdId: any;
  DriveDropDown: any;
  showNoDataFoundMessage: boolean | undefined;
  UserData: any;
  isLoginFailed: boolean | undefined;
  EmployeeName: any;
  EmployeeCode: any;
  Department: any;
  DepartmentName: any;
  loadingIndicator: boolean | undefined;
  CandidateName: any;
  UserId: any;
  Designation: any;
  EmailId: any;
  MobileNo: any;
  UserRole: string = "";  
  SupervisorName: any;
  ProofNumber: any;
  ProofName: any;
  SecretKey: any;

  JournalUserAccountForm!: FormGroup;
  isForm1Submitted: any;


  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    public formBuilder: UntypedFormBuilder,
    private fb: FormBuilder,
    private AuthSession: LoginSessionService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private mouDocumentsService: MouDocumentsService
  ) {}

  ngOnInit(): void {
    this.cookieService.delete('authData');
    this.AuthSession.clearSession();
    this.BookId  = this.route.snapshot.params['Id'];
    this.name  = this.route.snapshot.params['name'];    
    this.loadForm();
  }

  loadForm(){  
    this.formdata = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.minLength(5)]),
      password: new FormControl('', [Validators.required,Validators.minLength(5),]),
    });
  }

  formdata = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required,Validators.minLength(5),]),
  });

  get email() {
    return this.formdata.get('Email');
  }
  get passwordText() {
    return this.formdata.get('password');
  }

  submitted: boolean = false;
  OnSubmit() {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    }
    if (this.formdata.valid) {
      var BookId = this.route.snapshot.params['Id'];
      var name = this.route.snapshot.params['name'];
      if (BookId != undefined && BookId != null) {
        this.BookId = BookId;
        this.name = name;
      }

      var DataX = this.formdata.value;
      var uid = DataX.Email ?? '';
      var password = DataX.password ?? '';
      var encodeduid = btoa(uid);
      var encodedPassword = btoa(password);      
      this.getToken(encodeduid, encodedPassword);
    }
  }


  getToken(id: any, key: any) {
    this.cookieService.delete('authData');
    this.AuthSession.clearSession();
    this.authService.loginInternalUser(atob(id), atob(key)).subscribe({
      next: data => {
        this.storageService.saveUser(data.token);
        this.GetEmployeeDetails();
      },
      error: _err => {
        this.LoginFailed(_err);
      }
    });
  }
  LoginFailed(_NewError: any) {
    this.isLoginFailed = true;
    Swal.fire({
      title: 'Login Failed',
      text: 'Login details are Invalid!',
      icon: 'warning',
    })
  }
  GetEmployeeDetails() {
      this.mouDocumentsService.GetEmployeeDetails().subscribe({
        next: response => {
          if (response.item1.length > 0) {
            this.EmployeeDetails = response.item1;
            this.CandidateName = this.EmployeeName = response.item1[0].employeeName;
            this.UserId = this.EmployeeCode = response.item1[0].employeeCode;
            this.Department = response.item1[0].department;
            this.DepartmentName = response.item1[0].departmentName;
            this.Designation = response.item1[0].department;
            this.EmailId = response.item1[0].email;
            this.MobileNo = response.item1[0].contactNo;
            this.SupervisorName = response.item1[0].department;

            this.loadingIndicator = false;
            this.showNoDataFoundMessage = false;
            this.isLoginFailed = false;
            var DataX = this.formdata.value;
            var SecretKey = DataX.password ?? '';


            if(this.EmployeeCode !='31309')
          {
            this.isLoginFailed = true;
            Swal.fire({
              title: 'Not Authorised ',
              text: 'This Dashboard is only for Authorised Users ! ',
              icon: 'warning',
            });
          }
          else
          {

            const userCookiesData = {
              CandidateName: this.CandidateName,
              UserId: this.UserId,
              Department: this.Department,
              DepartmentName: this.DepartmentName,
              Designation: this.Designation,
              EmailId: this.EmailId,
              MobileNo: this.MobileNo,
              UserRole: this.UserRole,
              SupervisorName: this.SupervisorName,
              ProofNumber:this.MobileNo,
              ProofName: 'Mobile ',
              PasswordText: SecretKey,
            };
            this.cookieService.set('authData', JSON.stringify(userCookiesData));

          Swal.fire({
            text: 'Login details are Valid!',
            icon: 'success',
          })
          this.AuthSession.addToSession(this.EmployeeDetails);
          
          // Directly redirect to EdsEditorDashboard after successful authorization
          this.router.navigateByUrl('EdsEditorDashboard');
          
          } 
        }
        else {
            this.EmployeeDetails = [];
            this.showNoDataFoundMessage = true;
            this.isLoginFailed = true;
            this.loadForm();
          }
        },
        error: err => {
          this.LoginFailed(err);
          this.loadForm();
        }
      });

    this.formdata.reset();
  }
  VisitUrl( Id: any, name : any, Sufix : any) {
    this.router.navigateByUrl( Id + '/'+ name +'/'+ Sufix);
  }
   
}
