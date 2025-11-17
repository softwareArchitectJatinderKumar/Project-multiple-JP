// import { DatePipe } from '@angular/common';
// import * as XLSX from 'xlsx';  
// import * as mammoth from 'mammoth';  
// import * as JSZip from 'jszip';
// import { saveAs } from 'file-saver';
// import jsPDF from 'jspdf';
// import { AbstractControl, FormControl, FormGroup, UntypedFormGroup, ValidatorFn } from '@angular/forms';
// import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AuthService } from 'src/app/_services/auth.service';
// import { StorageService } from 'src/app/_services/storage.service';
// import { Validators } from '@angular/forms';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import Swal from 'sweetalert2';
// import { LoginSessionService } from 'src/app/_services/login-session.service';
// import { CookieService } from 'ngx-cookie-service';
// import { forkJoin } from 'rxjs';
// @Component({
//   selector: 'app-register-page',
//   templateUrl: './submitManuScript.component-4-feb-25.html',
//   styleUrls: ['./submitManuScript.component.scss']
// })
// export class SubmitManuScriptComponent implements OnInit {
//   emailId: any = ''; candidateName: any; supervisorName: any; mobileNumber: any; instituteName: any;
//   departmentName: any; idProofType: any = 'select'; idProofNumber: any; address: any; password: any; confirmPassword: any; userRole: any = 'select';
//   cifUserForm!: FormGroup; isForm1Submitted: boolean = false; IdProofFileName: string | null = null; IdProofFile: string | null = null;
//   sessionData: any[] = []; BookId: any; data: any[] = []; bookData: any; JournalDetails: any; detailsArray: any;
//   fileStatus: boolean = false; fileName: any; errorMessage: any; isLoginFailed: boolean = false; FileData: any; array: any[] = [];
//   fileData: File | null = null; JournalId: any = ''; JournalTitle: any = ''; formBuilder: any; form1: any; Description: any;
//   JournalSubTitle: any; selectedFiles: File[] = [];
//   ManuScriptTypes = [
//     { ManuScriptId: 1, ManuScriptType: 'Research Paper' },
//     { ManuScriptId: 2, ManuScriptType: 'Review Paper' },
//     { ManuScriptId: 3, ManuScriptType: 'Short Communication' },
//     { ManuScriptId: 4, ManuScriptType: 'Specialised' }
//   ];
//   SubmissionTypes = [
//     { SubmissionTypeId: 1, SubmissionType: 'Manuscript' },
//     { SubmissionTypeId: 2, SubmissionType: 'Revised' },
//   ];
//   SubItemType = [
//     { SubmissionTypeId: 1, SubItemType: 'Cover Letter' },
//     { SubmissionTypeId: 2, SubItemType: 'Title Page' },
//     { SubmissionTypeId: 3, SubItemType: 'Highlights' },
//     { SubmissionTypeId: 4, SubItemType: 'ManuScript File' },
//     { SubmissionTypeId: 5, SubItemType: 'Table' },
//     { SubmissionTypeId: 6, SubItemType: 'Figures' },
//     { SubmissionTypeId: 7, SubItemType: 'Supplimentry Material' },
//     { SubmissionTypeId: 8, SubItemType: 'Conflicts of Intense' },
//     { SubmissionTypeId: 9, SubItemType: 'Response to Reviewer' },
//   ];
//   cartItems: any[] = [];
//   showAddToCartButton: boolean = true;  

//   userId: any;
//   EditorInChief: any;
//   dataLoaded: boolean = false;
//   UserRolesData: any;


//   constructor(
//     private storageService: StorageService,
//     private authService: AuthService,
//     private AuthSession: LoginSessionService,
//     private fb: FormBuilder,
//     private router: Router,
//     private route: ActivatedRoute, private cookieService: CookieService,
//     private journalWebApiService: LpujournalbookService
//   ) {

//   }
//   scriptUploadForm!: FormGroup;     selectedFile: File | null = null;   fileError: string | null = null;  fromDate: any;  booksDataColumns: any;
//   toDate: any;    pipe = new DatePipe('en-CA');   dataSource: any[] = [];  dataX: any;  booksData: any;  dataShowing: any = false;

//   VisitUrl(Id: any, name: any, Sufix: any) {
//     this.router.navigateByUrl(Id + '/' + name + '/' + Sufix);
//   }
//   isEditor: boolean= false;     isReviewer: boolean= false;   isAuthor: boolean= false;   isOther: boolean= false;
//   UserRoles: any;
//   ngOnInit(): void {
//     let BookId = this.route.snapshot.params['Id'];
//     let name = this.route.snapshot.params['name'];
//     let loginStatus = this.checkUserLogin();
//     if (BookId != undefined && BookId != null && loginStatus != false) {
//       this.BookId = BookId;
//       this.JournalId = BookId;
//       this.JournalTitle = name;
//       this.GetJournalDetailsAbout(this.BookId);
//       this.showData();
//       this.getUserRolesforId();
     
//       this.showEditorData(this.userId);
//     }
//     else {
//       // this.router.navigateByUrl( '/Login');
//       this.router.navigateByUrl(BookId + '/' + name + '/' + 'ExternalLogin');
//     }
//     this.LoadForm();
//   }
//   LoadForm() {
//     this.scriptUploadForm = this.fb.group({
//       journalTitle: [this.JournalTitle],
//       journalId: [this.JournalId],
//       ManuScriptType: ['Select', Validators.required],
//       SubmissionType: ['Select', Validators.required],
//       SubItemType: ['Select' ],
//       // description: ['', Validators.required],
//       file: [null, Validators.required]
//     });
//   }
//   getUserRolesforId()
//   {
//     this.journalWebApiService.GetUserRolesforUser(this.userId).subscribe((response) => {
//       if (response.item1 && response.item1.length > 0) {
//         this.UserRolesData = response.item1[0];
//         // this.UserRoles = this.UserRolesData.userRole;
//         console.log(JSON.stringify(this.UserRolesData))
//         //  alert(JSON.stringify(this.UserRoles))
//       }
//       else {
//         this.bookData = [];
//         // this.router.navigateByUrl('/');
//       }
//     });
    
//   }
//   checkUserLogin() {
//     const GetCookieData = this.cookieService.get('authData');
//     if (GetCookieData) {
//       try {
//         const retrievedCookies = JSON.parse(GetCookieData);
//         this.userRole = retrievedCookies.UserRole?.length > 0 ? retrievedCookies.UserRole : 'Guest';
//         this.userId = retrievedCookies.EmailId;
//         this.supervisorName = retrievedCookies.SupervisorName;
//         this.departmentName = retrievedCookies.DepartmentName;
//         this.candidateName = retrievedCookies.CandidateName;
//         return true;
//       } catch (error) {
//         // console.error("Error parsing JSON from cookies:", error);
//         return false;
//       }
//     } else {
//       return false;
//     }

//   }

//   GetJournalDetailsAbout(JournalId: any): void {
//     this.journalWebApiService.GetJournalDetailsforAboutPage(JournalId).subscribe((response) => {
//       if (response.item1 && response.item1.length > 0) {
//         this.bookData = response.item1[0];
//         // console.log(JSON.stringify(this.bookData))
//         this.JournalDetails = this.bookData['journalDetails']
//         this.EditorInChief = this.bookData?.editorName
//         this.JournalSubTitle = this.bookData?.subTitle;
//         //  alert(this.EditorInChief)
//       }
//       else {
//         this.bookData = [];
//         // this.router.navigateByUrl('/');
//       }
//     });
//   }
 

//   showData() {
//     this.journalWebApiService.GetAllBooksDetails().subscribe({
//       next: (dataX: any) => {
//         this.dataSource = dataX.item1;
//         this.dataLoaded = true;
//         this.booksData = dataX.item1;
//         if (this.booksData.length > 0) {
//           this.booksDataColumns = Object.keys(this.booksData[0]);
//         }
//         this.dataShowing = true;

//       },
//       error: (error: any) => {
//         this.dataShowing = false;
//       },
//       complete: () => {
//         this.dataShowing = true;
//       }
//     });
//   }

//   onFileSelected(event: any): void {
//     const reader = new FileReader();
//     const target = event.target as HTMLInputElement;
//     const file: File | null = (target.files as FileList)[0] || null;
//     if (file) {
//       if (file.size > 25991576) {
//         Swal.fire({
//           title: 'File size exceeds 5MB. Please upload a smaller file.',
//           text: 'Invalid File size',
//           icon: 'warning'
//         });
//         target.value = '';
//         this.fileData = null;
//         this.fileStatus = false;
//         return;
//       }

//       const fileNameRegex = /^[a-zA-Z0-9._-]+$/;
//       if (!fileNameRegex.test(file.name)) {
//         const validFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
//         const modifiedFile = new File([file], validFileName, { type: file.type });
//         const dataTransfer = new DataTransfer();
//         dataTransfer.items.add(modifiedFile);
//         target.files = dataTransfer.files;
//         this.fileData = modifiedFile;
//         this.fileName = validFileName;
//       } else {
//         this.fileData = file;
//         this.fileName = file.name;
//       }

//       reader.readAsDataURL(this.fileData);
//       reader.onload = () => {
//         const result = reader.result as string;
//         const resultArray = result.split(',');
//         this.FileData = resultArray[1];
//         this.fileStatus = true;
//       };

//       this.selectedFiles.push(file);  
//     } else {
//       this.fileData = null;
//       this.fileStatus = false;
//     }
  
//   }


//   onSubmit() {
//     if (this.scriptUploadForm.valid) {
//       this.cartItems.push(this.scriptUploadForm.value);  // Add to cart
//       this.scriptUploadForm.reset();  // Reset the form after adding
//       this.showAddToCartButton = false;  // Show the "Save All" button after adding
//       // console.log(JSON.stringify(this.cartItems))
//     }
//   }

//   removeFromCart(index: number) {
//     this.cartItems.splice(index, 1);  // Remove item from cart
//   }
//   resetForm() {
//     this.scriptUploadForm.reset(); // Reset the form values
//     this.selectedFile = null; // Reset the selected file
//     this.fileError = null; // Clear any error message
//     this.FileData = null;
//   }


// // coded on 28-jan-25
//   submissionType: string = ''; // Default value
//   onSubmissionTypeChange(event: any): void {
//     // Get the selected submission type
//     this.submissionType = event.target.value;
//   }

//   getFileName(filePath: string): string {
//     // Extract the file name from the full file path
//     return filePath.split('\\').pop()?.split('/').pop() || '';  
//   }

//   // 30-Jan-25 changes
//   AllManuScriptType: any;
//   AllSubItemTypes: any;
//   AllSubmissionTypes: any;
//   selectedOption: string = 'zip';  
//   uploadFile() {
//     const reader = new FileReader();
//     const fileName = 'merged-files.zip';

//     if (!this.generatedFile) {
//       Swal.fire({
//         title: 'Error',
//         text: 'No file generated. Please generate a ZIP or PDF before uploading.',
//         icon: 'error'
//       });
//       return;
//     }
//     else{

//       if (this.generatedFile) {
//         if (this.generatedFile.size > 54991576) {
//           Swal.fire({
//             title: 'File size exceeds 50MB. Please upload a smaller file.',
//             text: 'Invalid File size',
//             icon: 'warning'
//           });
//           this.fileData = null;
//           this.fileStatus = false;
//           return;
//         }
  
//         reader.readAsDataURL(this.generatedFile);
//         reader.onload = () => {
//           const result = reader.result as string;
//           const resultArray = result.split(',');
//           this.FileData = resultArray[1];
//           this.fileStatus = true;
//         };
//       } else {
//         this.fileData = null;
//         this.fileStatus = false;
//       }
//     }
  
    
  
//     // Initialize the variables as empty strings
//     this.AllManuScriptType = "";
//     this.AllSubItemTypes = "";
//     this.AllSubmissionTypes = "";
  
//     // Populate the variables with concatenated values
//     this.cartItems.forEach(item => {
//       this.AllManuScriptType += item.ManuScriptType + ',';
//       this.AllSubItemTypes += item.SubItemType=='Select'? 'NA' :item.SubItemType + ',';
//       this.AllSubmissionTypes += item.SubmissionType + ',';
//     });
  
//     // Remove the trailing comma (optional for cleaner data)
//     this.AllManuScriptType = this.AllManuScriptType.replace(/,$/, '');
//     this.AllSubItemTypes = this.AllSubItemTypes.replace(/,$/, '');
//     this.AllSubmissionTypes = this.AllSubmissionTypes.replace(/,$/, '');
  
//     // Create the FormData object
//     const formData = new FormData();
//     formData.append('JournalId', this.JournalId);
//     formData.append('JournalTitle', this.JournalTitle);
//     formData.append('ManuScriptType', this.AllManuScriptType);
//     formData.append('SubmissionType', this.AllSubmissionTypes);
//     formData.append('SubItemType', this.AllSubItemTypes);
//     formData.append('UserId', this.userId);
//     formData.append('EditorInchief', this.EditorInChief);
//     formData.append('FileUrl', fileName);
//     formData.append('File', this.FileData);
  
//     // Call the API
//     this.journalWebApiService.AddNewJournalManuScriptData(formData).subscribe({
//       next: (data) => {
//         let result = data.item1[0]['msg'];
//         let errorCode = data.item1[0]['returnId'];
  
//         if (result === 'OK') {
//           Swal.fire({
//             title: 'Uploaded all Documents',
//             text: data.item1[0]['msg'],
//             icon: 'success',
//           }).then(() => {
//             this.VisitUrl(this.BookId, this.JournalTitle, 'MyManuScript');
//           });
//         } else {
//           Swal.fire({
//             title: 'Some Technical Issue',
//             text: result,
//             icon: 'error',
//           }).then(() => {
//             window.location.reload();
//           });
//         }
//       },
//       error: (err) => {
//         Swal.fire({
//           title: 'Error Occurred',
//           text: 'Unable to complete the request. Please try again later.',
//           icon: 'error',
//         });
//       }
//     });
//   }
   
//   generatedFile: Blob | null = null; // Store generated file data

//   generateZip() {
//     // if (this.selectedOption == 'zip') {
//       const zip = new JSZip();
      
//       this.selectedFiles.forEach(file => {
//         zip.file(file.name, file);
//       });
  
//       zip.generateAsync({ type: 'blob' }).then(content => {
//         this.generatedFile = content; // Store zip file in variable
//         saveAs(content, 'merged-files.zip');  
//       });
  
  
//     }
// //  For Editor  Logic

//     displayedColumns: string[] = [
//       // 'journalId',
//       'journalTitle',
//       'editorInChief',
//       'ManuScriptType',
//       'submissionType',
//       // 'fileUrl'
//     ];
//     displayedColumnsHeader: string[] = [
//       // 'journalId',
//       'Journal Title',
//       'Editor In Chief',
//       'ManuScript Type',
//       'Submission Type',
//       // 'Action'
//     ];



    
//   showEditorData(Emailid: any) {
//     this.journalWebApiService.UserWiseAllManuScript(Emailid).subscribe({
//       next: (dataX: any) => {
//         this.dataSource = dataX.item1;
//         this.dataLoaded = true;
//         this.booksData = dataX.item1;
//         // console.log("ALL Scripts Data" + JSON.stringify(this.booksData))
//         if (this.booksData.length > 0) {
//           this.booksDataColumns = Object.keys(this.booksData[0]);
//         }
//         this.dataShowing = true;
//         setTimeout(() => {

//           var wrapper1 = (<HTMLInputElement>document.getElementById('wrapper1'));
//           var wrapper2 = (<HTMLInputElement>document.getElementById('wrapper2'));
//           wrapper1.onscroll = function () {
//             wrapper2.scrollLeft = wrapper1.scrollLeft;
//           };
//           wrapper2.onscroll = function () {
//             wrapper1.scrollLeft = wrapper2.scrollLeft;
//           };

//         }, 500);

//       },
//       error: (error: any) => {
//         this.dataShowing = false;
//         console.error('Error fetching data', error);
//       },
//       complete: () => {
//         this.dataShowing = true;
//         console.log('Data fetching complete');
//       }
//     });
//   }
//   onSelectFileX(a: any) {
//     let aa = a;
//     window.open(aa, '_blank');
//   }
// }

