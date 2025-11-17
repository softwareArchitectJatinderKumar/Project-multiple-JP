import { CommonModule } from '@angular/common';
import swal from 'sweetalert2';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-update-journal-details',
  templateUrl: './update-journal-details.component.html',
  standalone: false,styleUrls: ['./update-journal-details.component.scss']
})
export class UpdateJournalDetailsComponent implements OnInit {

  AllJournalsDetails: any[] = [];
  TempAllJournalsDetails: any[] = []; headHtmlData: never[] = []; 
  isInputDisabled: boolean = true; JournalId: any; fileNamesX!: string; searchQueryx: any;
  booksData: any;
  Journals: any;
  Title: any;
  fileDataX: File | undefined;
  fileStatus: boolean | undefined;
  loadingIndicator: boolean | undefined;
  columns: never[] | undefined;
  isLoginFailed: boolean | undefined;
  fileName: any;

  isForm1Submitted: Boolean | undefined; isForm2Submitted: Boolean | undefined;
  form1: any;
  constructor(
    private LpujournalbookService: LpujournalbookService,
    private router: Router,
    private storageService: StorageService, private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder) { }
  ngOnInit(): void {
    this.getBooksDetail();
    this.isForm1Submitted = false;
    this.isForm2Submitted = false;
  }

  getBooksDetail(): void {
    this.LpujournalbookService.GetAllBooksDetails().subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.AllJournalsDetails = response.item1;
        this.TempAllJournalsDetails = this.AllJournalsDetails;
        // console.log(JSON.stringify(this.TempAllJournalsDetails))
        this.loadingIndicator = false;
        this.updatePaginatedData();
        // ["id","journalTitle","introduction","subTitle","volumne","scopeofJournal","publishDate","thrustArea","articleType","imageUrl"]
        this.loadingIndicator = false;
      }
      else {
        this.TempAllJournalsDetails = [];
      }
    });
  }


  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  paginatedJournals: any[] = [];



  // Update paginated data when data changes
  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedJournals = this.TempAllJournalsDetails.slice(startIndex, endIndex);
  }

  // Calculate total pages
  get totalPages(): number {
    return Math.ceil(this.TempAllJournalsDetails.length / this.itemsPerPage);
  }

  // Pagination controls
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  filterJournals(event: any) {
    const searchValue = event.target.value.toLowerCase();
    
    this.TempAllJournalsDetails = this.TempAllJournalsDetails.filter(journal => 
        journal.journalTitle.toLowerCase().includes(searchValue) ||
        journal.subTitle.toLowerCase().includes(searchValue)
    );

    this.currentPage = 1; // Reset to the first page after filtering
    this.paginatedJournals = this.getPaginatedData();
}

getPaginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.TempAllJournalsDetails.slice(startIndex, startIndex + this.itemsPerPage);
}


  searchx() {
    // alert(1)
    const query = this.searchQueryx.toLowerCase();
    this.TempAllJournalsDetails = this.AllJournalsDetails.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
    this.updatePaginatedData();
  }

  onDataChange() {
    this.updatePaginatedData();
  }

  onSelectFile(a: any) {
    let aa = a;
    window.open(aa.imageUrl, '_blank');
  }

  RecordId: any; selectedJournalId: any;
  selectedJournalTitle: any;
  onTakeAction(rowData: any) {
    this.selectedJournalId = rowData['id'];
    this.selectedJournalTitle = rowData['journalTitle'];
    this.RecordId = rowData['id'];
  }


  UpdateFileDocument(Id: any) {
    if (this.fileChosen[Id]) {
      const formData = new FormData();
      formData.append('JournalId', Id);
      formData.append('FilePath', this.fileName);
      formData.append('File', this.FileDataX);

      this.LpujournalbookService.UpdateJournalImageFile(formData).subscribe({
        next: (data: any) => {
          const result = data.item1[0]['msg'];
          if (result === 'ok') {
            swal.fire({
              title: 'Uploaded the Document',
              text: data.item1[0]['msg'],
              icon: 'success'
            }).then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 3500);  
            });
          } else if (result === 'Failed') {
            swal.fire({
              title: 'Failed to Upload',
              text: result,
              icon: 'error'
            });
          }
        },
        error: (error: any) => {
          swal.fire({
            title: 'Error',
            text: 'Internal Server error',
            icon: 'error'
          });
        },
        complete: () => {
          setTimeout(() => {
            window.location.reload();
          }, 3500); // delay of 1.5 seconds
        }
      });
    }
  }

  fileChosen: { [key: number]: boolean } = {};

  FileDataX: any;
  onFileXSelected(event: any, id: number): void {
    this.fileChosen[id] = event.target.files.length > 0;
    const reader = new FileReader();
    const target = event.target as HTMLInputElement;
    const file: File | null = (target.files as FileList)[0] || null;

    if (file && file.size > 3148576) {
      swal.fire({
        title: 'File size exceeds 3 MB. Please upload a smaller file.',
        text: 'Invalid File size',
        icon: 'warning'
      });
      target.value = '';
      return;
    }

    const fileNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (file && !fileNameRegex.test(file.name)) {
      const validFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

      const modifiedFile = new File([file], validFileName, { type: file.type });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(modifiedFile);
      target.files = dataTransfer.files;

      this.fileDataX = modifiedFile;
      this.fileStatus = true;

      reader.readAsDataURL(modifiedFile);
      reader.onload = () => {
        const ssss = reader.result as string;
        const ssssArray = ssss.split(',');
        this.FileDataX = ssssArray[1];
        this.fileName = validFileName;
      };
      return;
    }

    this.fileDataX = file;
    this.fileStatus = true;

    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const ssss = reader.result as string;
        const ssssArray = ssss.split(',');
        this.FileDataX = ssssArray[1];
        this.fileName = file.name;
      };
    }
  }
}
