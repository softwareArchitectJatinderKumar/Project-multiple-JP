import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import Swal from 'sweetalert2';
import { AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-journal-form',
  templateUrl: './NewJournal.component.html',
  styleUrls: ['./NewJournal.component.scss']
})
export class JournalFormComponent implements OnInit {
  PropertiesData: any[] = [];   chunkedProperties: any[][] = [];
  properties: any[] = []; dynamicForm!: FormGroup;
  AllJournalsDetails:  any[] = []; TempAllJournalsDetails : any[]=[];  
   isInputDisabled:boolean = true;    JournalId: any; 
  fileNamesX: string='';       FileDataX: string='';  userId: any;
  searchQueryx: any; isLoginFailed: boolean= true;

  
  emailId: any = ''; candidateName: any; supervisorName: any; mobileNumber: any; instituteName: any;
  departmentName: any; idProofType: any = 'select'; idProofNumber: any; address: any; password: any; confirmPassword: any; 
  userRole: any = 'select';
 
checkUserLogin() {   
  const GetCookieData = this.cookieService.get('authData');
  alert(JSON.stringify(GetCookieData))
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
    this.LoginFailed('Login Error');

  }

}

LoadForm(): void {
  this.journalForm1 = this.fb.group({
    journalTitle: ['', Validators.required],
    subTitle: ['', Validators.required],
    Volume: ['', Validators.required],
    publishDate: ['', Validators.required],
    Introduction: ['', Validators.required],
    scopeofjournals: ['', Validators.required],
    thrustArea: ['', Validators.required],
    ArticleType: ['', Validators.required],
    file: ['', Validators.required]
  });

  this.journalForm2 = this.fb.group({
    ISSNNo: ['', Validators.required],
    RegNo: ['', Validators.required],
    Periodicity: ['', Validators.required],
    Language: ['', Validators.required],
    Scope: ['', Validators.required],
    ArticleProcessCharges: ['', Validators.required],
    OpenAccess: ['', Validators.required],
    Print: ['', Validators.required],
    Online: ['', Validators.required],
    ReviewProcess: ['', Validators.required]
  });

  this.editorForm = this.fb.group({
    EditorinChief: this.fb.array([])
  });
  this.addEditor();


}


getBooksDetail(): void {
  this.journalService.GetAllBooksDetails().subscribe((response) => {
    if (response.item1 && response.item1.length > 0) {
      this.AllJournalsDetails = response.item1;
      this.TempAllJournalsDetails = this.AllJournalsDetails;       
    }
    else {
      this.TempAllJournalsDetails = [];
    }
  });
}
GetJournalProperties(): void {
  this.journalService.GetJournalProperties().subscribe((response) => {
    if (response.item1.length > 0) {
      this.PropertiesData = response.item1;
      
      let vals =

        this.chunkProperties();
    } else {
      this.PropertiesData = [];
    }
    // console.log(" Properties " + JSON.stringify(this.PropertiesData))
  });
}

private chunkProperties(): void {
  for (let i = 0; i < this.PropertiesData.length; i += 3) {
    this.chunkedProperties.push(this.PropertiesData.slice(i, i + 3));
  }
}


private createFormControls(): void {
  this.properties.forEach(PropertiesData => {
    this.dynamicForm.addControl(PropertiesData.items, new FormControl(''));
  });
}

LoginFailed(_NewError: any) {
  this.isLoginFailed = true;
  Swal.fire({
    title: 'Login Failed',
    text: 'Login details are Invalid!',
    icon: 'warning',
  })
  const element = document.getElementById('NewJournalForm');
  if (element) {
    element.hidden = true;
  }
}
  step = 1;
  journalForm1!: FormGroup;
  journalForm2!: FormGroup;
  editorForm!: FormGroup;
  isForm1Submitted = false;
  isForm2Submitted = false;
  isEditorSubmitted = false;
  fileNames: any = '';
  fileDataX!: File;
  LoginStatus:any;

  editorTypes: string[] = ['Editor-in-Chief', 'Co-Editor', 'Associate Editor', 'Guest Editor'];

  stepTitles: string[] = [
    'Journal Basic Information',
    'Journal Basic Property Details',
    'Journal Editor Details'
  ];

  constructor(
    private fb: FormBuilder,
    private journalService: LpujournalbookService,
    private router: Router, private authService: AuthService,
    private storageService: StorageService, 
    private route: ActivatedRoute,private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    // this.journalForm1 = this.fb.group({
    //   journalTitle: ['', Validators.required],
    //   subTitle: ['', Validators.required],
    //   Volume: ['', Validators.required],
    //   publishDate: ['', Validators.required],
    //   Introduction: ['', Validators.required],
    //   scopeofjournals: ['', Validators.required],
    //   thrustArea: ['', Validators.required],
    //   ArticleType: ['', Validators.required],
    //   file: ['', Validators.required]
    // });

    // this.journalForm2 = this.fb.group({
    //   ISSNNo: ['', Validators.required],
    //   RegNo: ['', Validators.required],
    //   Periodicity: ['', Validators.required],
    //   Language: ['', Validators.required],
    //   Scope: ['', Validators.required],
    //   ArticleProcessCharges: ['', Validators.required],
    //   OpenAccess: ['', Validators.required],
    //   Print: ['', Validators.required],
    //   Online: ['', Validators.required],
    //   ReviewProcess: ['', Validators.required]
    // });

    // this.editorForm = this.fb.group({
    //   EditorinChief: this.fb.array([])
    // });
    // this.addEditor();

    this.LoginStatus = this.checkUserLogin();
    alert(this.isLoginFailed)
    if (!this.isLoginFailed) {
      this.LoadForm();
      this.GetJournalProperties();
      this.getBooksDetail();
      this.dynamicForm = this.fb.group({});
      this.createFormControls();
    }
    else
    {
      this.LoginFailed('Invalid Login Details');
    }
  }


  
  get form1() {
    return this.journalForm1.controls;
  }
  get form2() {
    return this.journalForm2.controls;
  }
  get editorArray() {
    return this.editorForm.get('EditorinChief') as FormArray;
  }

  addEditor() {
    this.editorArray.push(this.fb.group({
      EditorType: ['', Validators.required],
      EditorName: ['', Validators.required],
      Designation: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      EditorAddress: ['', Validators.required]
    }));
  }

  removeEditor(index: number) {
    this.editorArray.removeAt(index);
  }

  nextStep() {
    this.isForm1Submitted = true;
    if (this.journalForm1.valid) {
      this.step = 2;
    }
  }

  previousStep() {
    if (this.step > 1) this.step--;
  }

  nextStep2() {
    this.isForm2Submitted = true;
    if (this.journalForm2.valid) {
      this.step = 3;
    }
  }

  finishFunction() {
    this.isEditorSubmitted = true;
  
    if (this.journalForm1.valid && this.journalForm2.valid && this.editorForm.valid) {
      const formData = new FormData();
  
      // Step 1 form values
      formData.append('JournalTitle', this.journalForm1.value.journalTitle);
      formData.append('SubTitle', this.journalForm1.value.subTitle);
      formData.append('Volume', this.journalForm1.value.Volume);
      formData.append('PublishDate', this.journalForm1.value.publishDate);
      formData.append('Introduction', this.journalForm1.value.Introduction);
      formData.append('ScopeofJournal', this.journalForm1.value.scopeofjournals);
      formData.append('ThrustArea', this.journalForm1.value.thrustArea);
      formData.append('ArticleType', this.journalForm1.value.ArticleType);
      formData.append('File', this.fileDataX);  // must be of type File (from input type="file")
  
      // Step 2 details -> Converted into key-value pairs
      const journalDetailsArray = [
        { KeyName: 'ISSNNo', KeyValue: this.journalForm2.value.ISSNNo },
        { KeyName: 'RegNo', KeyValue: this.journalForm2.value.RegNo },
        { KeyName: 'Periodicity', KeyValue: this.journalForm2.value.Periodicity },
        { KeyName: 'Language', KeyValue: this.journalForm2.value.Language },
        { KeyName: 'Scope', KeyValue: this.journalForm2.value.Scope },
        { KeyName: 'ArticleProcessCharges', KeyValue: this.journalForm2.value.ArticleProcessCharges },
        { KeyName: 'OpenAccess', KeyValue: this.journalForm2.value.OpenAccess },
        { KeyName: 'Print', KeyValue: this.journalForm2.value.Print },
        { KeyName: 'Online', KeyValue: this.journalForm2.value.Online },
        { KeyName: 'ReviewProcess', KeyValue: this.journalForm2.value.ReviewProcess }
      ];
      formData.append('JournalMasterNewDetails', JSON.stringify(journalDetailsArray));
  
      // Step 3: Editors
      formData.append('JournalMasterNewEditors', JSON.stringify(this.editorForm.value.EditorinChief));
  
      // // Debug
      // console.log("Prepared FormData:");
      // formData.forEach((value, key) => {
      //   console.log(`${key}:`, value);
      // });
  
      // API Call
      this.journalService.addJournalData(formData).subscribe({
        next: () => Swal.fire('Success', 'Journal saved successfully', 'success'),
        error: () => Swal.fire('Error', 'Failed to save journal', 'error')
      });
    }
  }
  
  // finishFunction() {
  //   this.isEditorSubmitted = true;
  //   if (this.journalForm1.valid && this.journalForm2.valid && this.editorForm.valid) {
  //     const formData = new FormData();

  //     formData.append('journalTitle', this.journalForm1.value.journalTitle);
  //     formData.append('subTitle', this.journalForm1.value.subTitle);
  //     formData.append('Volume', this.journalForm1.value.Volume);
  //     formData.append('publishDate', this.journalForm1.value.publishDate);
  //     formData.append('Introduction', this.journalForm1.value.Introduction);
  //     formData.append('scopeofjournals', this.journalForm1.value.scopeofjournals);
  //     formData.append('thrustArea', this.journalForm1.value.thrustArea);
  //     formData.append('ArticleType', this.journalForm1.value.ArticleType);
  //     formData.append('file', this.fileDataX);

  //     formData.append('ISSNNo', this.journalForm2.value.ISSNNo);
  //     formData.append('RegNo', this.journalForm2.value.RegNo);
  //     formData.append('Periodicity', this.journalForm2.value.Periodicity);
  //     formData.append('Language', this.journalForm2.value.Language);
  //     formData.append('Scope', this.journalForm2.value.Scope);
  //     formData.append('ArticleProcessCharges', this.journalForm2.value.ArticleProcessCharges);
  //     formData.append('OpenAccess', this.journalForm2.value.OpenAccess);
  //     formData.append('Print', this.journalForm2.value.Print);
  //     formData.append('Online', this.journalForm2.value.Online);
  //     formData.append('ReviewProcess', this.journalForm2.value.ReviewProcess);

  //     formData.append('editors', JSON.stringify(this.editorForm.value.EditorinChief));
  //     console.log("Form Data")
  //     formData.forEach((value, key) => {
  //       console.log(key, value);
  //     });
  //     this.journalService.addJournalData(formData).subscribe({
  //       next: () => Swal.fire('Success', 'Journal saved successfully', 'success'),
  //       error: () => Swal.fire('Error', 'Failed to save journal', 'error')
  //     });
  //   }
  // }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.size <= 3148576 && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      const validFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      this.fileDataX = new File([file], validFileName, { type: file.type });
      this.fileNames = validFileName;
      this.journalForm1.patchValue({ file: validFileName });
    } else {
      Swal.fire('Invalid File', 'File should be png/jpg and less than 3MB', 'warning');
    }
  }


  isInvalid(groupOrControl: FormGroup | AbstractControl, controlName?: string): boolean {
    const control = this.getControl(groupOrControl, controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  
  getErrorMessage(groupOrControl: FormGroup | AbstractControl, controlName?: string): string {
    const control = this.getControl(groupOrControl, controlName);
  
    if (control?.errors) {
      if (control.errors['required']) {
        return 'This field is required.';
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address.';
      }
      if (control.errors['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} characters required.`;
      }
      if (control.errors['maxlength']) {
        return `Maximum ${control.errors['maxlength'].requiredLength} characters allowed.`;
      }
      // Add other error cases as needed
    }
  
    return '';
  }
  
  private getControl(groupOrControl: FormGroup | AbstractControl, controlName?: string): AbstractControl | null {
    if (groupOrControl instanceof FormGroup && controlName) {
      return groupOrControl.get(controlName);
    }
    return groupOrControl;
  }
  
}




//   step = 1;
//   validationForm1!: FormGroup;
//   validationForm2!: FormGroup;
//   editorForm!: FormGroup;
//   isForm1Submitted = false;

//   // Model bindings (optional)
//   JournalTitle = '';
//   SubTitle = '';
//   Volume = '';
//   PublishDate = '';
//   Introduction = '';
//   ScopeOfJournal = '';
//   ThrustArea = '';
//   ArticleType = '';
//   fileNames = '';
//   ISSNNo = '';
//   RegNo = '';
//   Periodicity = '';
//   Language = '';
//   Scope = '';
//   ArticleProcessCharges = '';
//   OpenAccess = '';
//   Print = '';
//   Online = '';
//   ReviewProcess = '';

//   constructor(private fb: FormBuilder) {}

//   ngOnInit(): void {
//     this.validationForm1 = this.fb.group({
//       journalTitle: ['', Validators.required],
//       subTitle: ['', Validators.required],
//       Volume: ['', Validators.required],
//       publishDate: ['', Validators.required],
//       Introduction: ['', Validators.required],
//       scopeofjournals: ['', Validators.required],
//       thrustArea: ['', Validators.required],
//       ArticleType: ['', Validators.required],
//       file: ['', Validators.required]
//     });

//     this.validationForm2 = this.fb.group({
//       ISSNNo: ['', Validators.required],
//       RegNo: ['', Validators.required],
//       Periodicity: ['', Validators.required],
//       Language: ['', Validators.required],
//       Scope: ['', Validators.required],
//       ArticleProcessCharges: ['', Validators.required],
//       OpenAccess: ['', Validators.required],
//       Print: ['', Validators.required],
//       Online: ['', Validators.required],
//       ReviewProcess: ['', Validators.required],
//     });

//     this.editorForm = this.fb.group({
//       EditorinChief: this.fb.array([this.createEditor()])
//     });
//   }

//   goToStep(stepNum: number): void {
//     this.step = stepNum;
//   }

//   form1Submit(): void {
//     this.isForm1Submitted = true;
//     if (this.validationForm1.valid) {
//       this.goToStep(2);
//     }
//   }

//   form2Submit(): void {
//     if (this.validationForm2.valid) {
//       this.goToStep(3);
//     }
//   }

//   onFileSelected(event: any): void {
//     const file = event.target.files[0];
//     if (file) {
//       this.fileNames = file.name;
//       this.validationForm1.patchValue({ file: file.name });
//     }
//   }

//   get EditorinChief(): FormArray {
//     return this.editorForm.get('EditorinChief') as FormArray;
//   }

//   createEditor(): FormGroup {
//     return this.fb.group({
//       EditorType: ['', Validators.required],
//       EditorName: ['', Validators.required],
//       Designation: ['', Validators.required],
//       Email: ['', [Validators.required, Validators.email]],
//       EditorAddress: ['', Validators.required]
//     });
//   }

//   addQuantity(): void {
//     this.EditorinChief.push(this.createEditor());
//   }

//   removeQuantity(index: number): void {
//     this.EditorinChief.removeAt(index);
//   }

//   onSubmitFinal(): void {
//     if (this.editorForm.valid) {
//       console.log('Editor Data:', this.editorForm.value);
//     }
//   }

//   finishFunction(): void {
//     // Final form submission or navigation
//     console.log('All forms submitted');
//     console.log('Form 1:', this.validationForm1.value);
//     console.log('Form 2:', this.validationForm2.value);
//     console.log('Editors:', this.editorForm.value);
//   }
// }

