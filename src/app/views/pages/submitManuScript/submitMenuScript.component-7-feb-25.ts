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

// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatDialog } from '@angular/material/dialog';

// @Component({
//   selector: 'app-register-page',
//   templateUrl: './submitManuScript.component.html',
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

//   userId: any;  EditorInChief: any;  dataLoaded: boolean = false;  UserRolesData: any;   columns: any;

//   ActionType: any='Select';

//   @ViewChild(MatPaginator) paginator!: MatPaginator;

//   ngAfterViewInit() {
//     this.dataSourceMat.paginator = this.paginator;
//   }
//   dataSourceMat: any;

//   constructor(
//     private storageService: StorageService,
//     private authService: AuthService,
//     private AuthSession: LoginSessionService,
//     private fb: FormBuilder,
//     private router: Router,
    
//     private route: ActivatedRoute, private cookieService: CookieService,
//     private journalWebApiService: LpujournalbookService
//   ) {   }
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
//     let loginStatus = this.checkUserLogin(); //1 function
//     if (BookId != undefined && BookId != null && loginStatus != false) {
//       this.BookId = BookId;
//       this.JournalId = BookId;
//       this.JournalTitle = name;
//       this.getUserRolesforId(); // 2nd function
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
  
//   checkUserLogin() { // 1st function
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
//   UserRolesArray : any[] | undefined;


// //  2nd function
//   getUserRolesforId()
//   {
//     const roleMapping: { [key: string]: string } = {
//       '1': 'Author',
//       '2': 'Reviewer',
//       '3': 'Guest'
//     };
//     this.journalWebApiService.GetUserRolesforUser(this.userId).subscribe((response) => {
//       if (response.item1 && response.item1.length > 0) {
//         this.UserRolesData = response.item1[0];
//         this.UserRolesArray = this.UserRolesData.userRole.split(',').map((role: string | number) => ({
//           value: role,
//           label: roleMapping[role] || role   
//         }));
        
//       }
//       else {
//         this.bookData = [];
//       }
//     });
    
//   }

// // 3rd function 
    
// showEditorData(Emailid: any) {
//   this.journalWebApiService.UserWiseAllManuScript(Emailid).subscribe({
//     next: (dataX: any) => {
//       this.dataSource = dataX.item1;
//       this.dataLoaded = true;
//       this.booksData = dataX.item1;

//       this.dataSourceMat = new MatTableDataSource(this.booksData);

//       this.calculateTotalPages();
//   this.updatePagedData();
//       console.log("ALL Scripts Data" + JSON.stringify(this.booksData))
//       if (this.booksData.length > 0) {
//         this.booksDataColumns = Object.keys(this.booksData[0]);
//       }
//       this.dataShowing = true;
//       setTimeout(() => {

//         var wrapper1 = (<HTMLInputElement>document.getElementById('wrapper1'));
//         var wrapper2 = (<HTMLInputElement>document.getElementById('wrapper2'));
//         wrapper1.onscroll = function () {
//           wrapper2.scrollLeft = wrapper1.scrollLeft;
//         };
//         wrapper2.onscroll = function () {
//           wrapper1.scrollLeft = wrapper2.scrollLeft;
//         };

//       }, 500);

//     },
//     error: (error: any) => {
//       this.dataShowing = false;
//       console.error('Error fetching data', error);
//     },
//     complete: () => {
//       this.dataShowing = true;
//       console.log('Data fetching complete');
//     }
//   });
// }
// onSelectFileX(a: any) {
//   let aa = a;
//   window.open(aa, '_blank');
// }




// pageSize = 5;
// currentPage = 1;
// totalPages = 1;
// pagedData: any[] = [];

 

// calculateTotalPages() {
//   this.totalPages = Math.ceil(this.booksData.length / this.pageSize);
// }

// updatePagedData() {
//   const startIndex = (this.currentPage - 1) * this.pageSize;
//   const endIndex = startIndex + this.pageSize;
//   this.pagedData = this.booksData.slice(startIndex, endIndex);
// }

// previousPage() {
//   if (this.currentPage > 1) {
//     this.currentPage--;
//     this.updatePagedData();
//   }
// }

// nextPage() {
//   if (this.currentPage < this.totalPages) {
//     this.currentPage++;
//     this.updatePagedData();
//   }
// }

// goToPage(page: number) {
//   this.currentPage = page;
//   this.updatePagedData();
// }

// get totalPagesArray() {
//   return Array.from({ length: this.totalPages }, (_, i) => i + 1);
// }



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
//       'fileUrl',
//       'Action'
//     ];
//     displayedColumnsHeader: string[] = [
//       // 'journalId',
//       'Journal Title',
//       'Editor In Chief',
//       'ManuScript Type',
//       'Submission Type',
//       'Document',
//       'Action'
//     ];


//     onActionModal(dataRow:any){
      
//     }


 
// }

