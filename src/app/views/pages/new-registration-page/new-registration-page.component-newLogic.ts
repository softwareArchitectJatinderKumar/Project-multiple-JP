import { AbstractControl, FormControl, FormGroup, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';

@Component({
  selector: 'app-new-registration-page',
  templateUrl: './new-registration-page.component-newLogic.html',
  styleUrls: ['./new-registration-page.component.scss']
})
export class NewRegistrationPageComponent implements OnInit {
  emailId: any = '';  candidateName: any; supervisorName: any;mobileNumber: any;     instituteName: any;
  departmentName: any;     idProofType: any ='select' ;idProofNumber: any; address: any;   password: any;  confirmPassword: any; 
  // userRole: any ='select';
  
  isForm1Submitted: boolean = false;
  IdProofFileName: string | null = null;
  IdProofFile: string | null = null;
  sessionData: any[] = [];
  JournalUserAccountForm!: FormGroup;
  BookId: any;
  name: any;

  constructor(
    private LpuWebService: LpujournalbookService,
    private fb: FormBuilder,    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    var BookId = this.route.snapshot.params['Id'];
    var name = this.route.snapshot.params['name'];
    if (BookId != undefined && BookId != null) {
      this.BookId = BookId;
      this.name = name;
    }
    this.JournalUserAccountForm = this.fb.group({
      CandidateName: ['', Validators.required],
      EmailId: ['', [Validators.required, Validators.email]],
      InstituteName: ['', Validators.required],
      DepartmentName: ['', Validators.required],
      Designation: ['', Validators.required],
      MobileNumber: ['', [Validators.required, Validators.pattern(/^[+]?[0-9]{1,3}?[-\s]?[0-9]{1,4}[-\s]?[0-9]{1,4}[-\s]?[0-9]{1,9}$/)]],
      Address: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['', Validators.required],
      UserRole: [[], Validators.required]  
    });

    document.addEventListener('click', () => {
      if (this.dropdownOpen) {
        this.dropdownOpen = false;
      }
    });
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
    { value: '1', label: 'Author' },
    { value: '2', label: 'Reviewer' },
    { value: '3', label: 'Other Users' },
  ];

  selectedRoles: string[] = [];
  dropdownOpen = false;

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();  // Prevent closing when clicking inside the dropdown
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Method to add a role to selectedRoles
  addRole(event: MouseEvent, roleValue: string) {
    event.stopPropagation(); // Prevent dropdown from closing prematurely
    if (!this.selectedRoles.includes(roleValue)) {
      this.selectedRoles.push(roleValue);
      this.dropdownOpen = false; // Close dropdown after selecting
    }
  }

  // Method to get the role label based on the value
  getRoleLabel(roleValue: string): string {
    const role = this.availableRoles.find(r => r.value === roleValue);
    return role ? role.label : '';
  }

  // Method to remove a selected role
  removeRole(event: MouseEvent, role: string) {
    event.stopPropagation();  // Prevent closing when clicking remove
    this.selectedRoles = this.selectedRoles.filter(selectedRole => selectedRole !== role);
  }

  // Method to check if the role is selected
  isSelected(roleValue: string): boolean {
    return this.selectedRoles.includes(roleValue);
  }
 

  Onsubmit(): void {
    debugger;
    this.isForm1Submitted = true;
    const formValue = this.JournalUserAccountForm.value;
    const formData = new FormData();
    formData.append("CandidateName", formValue.CandidateName);
    formData.append("InstituteName", formValue.InstituteName);
    formData.append("DepartmentName", formValue.DepartmentName);
    formData.append("Designation", formValue.Designation);
    formData.append("Address", formValue.Address);
    formData.append("MobileNumber", formValue.MobileNumber);
    formData.append("UserEmail", formValue.EmailId);
    formData.append("PasswordText", formValue.Password);
  
    // Append multiple selected roles
    formValue.UserRole.forEach((role: string) => {
      formData.append("UserType[]", role);
    });
  
    this.LpuWebService.AddJournalUserAccount(formData).subscribe({
      next: (data) => {
        let result = data.item1[0]['msg'];
        let errorCode = data.item1[0]['returnId'];
  
        if (result === 'Success') {
          Swal.fire({
            title: 'User Login Created Successfully',
            text: result,
            icon: 'success',
          }).then(() => {
            this.router.navigate(['/ExternalLogin']);
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

  OnReset(): void {
    this.JournalUserAccountForm.reset();
    this.isForm1Submitted = false;
  }

  VisitUrl(Id: any, name: any, Sufix: any) {
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix).then(() => {
      window.location.reload();
    });
  }
  
 
}
