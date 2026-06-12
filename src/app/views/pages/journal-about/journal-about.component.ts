
import { FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';

import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import Swal from 'sweetalert2';
import { MouDocumentsService } from 'src/app/_services/mou-documents.service';

 
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { DatePipe } from '@angular/common';

interface Book {
  id: number; bookId: string;  aboutBook: string;    bookPages: number;  totalCopies: number;  languages?: string;  ratingPoint?: string;
  publisher?: string;  publicationAddress?: string;  comments?: string;  issnNo?: string;  regNo?: string;  periodicity?: string;
  scope?: string;  charges?: string; openAccess?: string;  modeofAvailable?: string;  review?: string;  editorName?: string;  editorDesignation?: string;
  createdBy?: string;  editorCategory?: string;  imagePath?: string;
}
@Component({
  selector: 'app-journal-about',
  templateUrl: './journal-about.component.html',
  standalone: false,styleUrls: ['./journal-about.component.scss']
})
export class JournalAboutComponent implements OnInit {
  data: any[] =[];    BookId: any;  bookData: any;  JournalDetails: any;  detailsArray: any;
  name: any; JournalTitle: any;
  JournalIntroduction: any; 
  constructor(
    private journalWebApiService: LpujournalbookService, 
    private authService: AuthService,
    public formBuilder: UntypedFormBuilder,
    private fb: FormBuilder,
    private AuthSession: LoginSessionService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
  ) { }
  
  VisitUrl(Id: any, name: any, Sufix: any) {
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix);
  }
  ngOnInit(): void {
    let BookId  = this.route.snapshot.params['Id'];
    this.name =this.JournalTitle =  this.route.snapshot.params['name'];
   
   
      if (BookId != undefined && BookId != null) {
        this.BookId = this.route.snapshot.params['Id'];
        this.JournalTitle = this.name.replace(/-/g, ' ');
        this.GetJournalDetailsAbout(this.BookId);
        this.GetJournalEditorsDetailsByBookId(this.BookId);
      } 
  }
  imageLoadError: boolean = false;
  GetJournalDetailsAbout(JournalId: any): void {
    this.journalWebApiService.GetJournalDetailsforAboutPage(JournalId).subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.bookData = response.item1[0];

        this.JournalDetails = this.bookData['journalDetails']
        this.JournalIntroduction = this.bookData['scopeofJournal']
        this.extractDetails();
      }
      else {
        this.bookData = [];
           
        // Swal.fire({
        //   icon: 'error',
        //   title: 'Oops...',
        //   text: 'Something went wrong!',
        //   confirmButtonText: 'Ok'
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     this.router.navigateByUrl('/');
        //   }
        // });
        
      }
    });
  }
  extractDetails() {
    const items = this.JournalDetails.split('#').map((item: string) => item.trim());
  
    this.detailsArray = items.map((item: { split: (arg0: string) => { (): any; new(): any; map: { (arg0: (part: any) => any): [any, any]; new(): any; }; }; }) => {
      const [key, value] = item.split(':').map(part => part.trim());
  
      let formattedKey;
      if (key === 'ISSNNo') {
        formattedKey = 'ISSN No';
      } else {
        formattedKey = key.replace(/([A-Z0-9])/g, ' $1').trim();
      }
  
      return { key: formattedKey, value };
    });
  
  }
  AssociateEditor: any;
  AssistantEditor: any;
  ManagingEditor: any;
  AssistantEditors: any;
  EditorInChief: any;
  EditorialboardmembersNational: any;
  EditorialboardmembersReviews: any;
  EditorialboardmembersInterNational: any;
  editorData: any;
  filteredEditors: any;
  GetJournalEditorsDetailsByBookId(BookId: any): void {
    this.journalWebApiService.GetAllJournalEditorsDetails().subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.editorData = response.item1;        
      this.filteredEditors = this.editorData.filter((item: { journalId: any }) => item.journalId === BookId);
      this.GetDataforEditors();
      this.EditorialboardmembersNational = this.filteredEditors.filter((item: { editorType: string; }) => item.editorType.toLowerCase().includes('editorial board members national'));
      this.EditorialboardmembersInterNational = this.filteredEditors.filter((item: { editorType: string; }) => item.editorType.toLowerCase().includes('editorial board members international'));
      this.AssistantEditor = this.filteredEditors.filter((item: { editorType: string; }) => item.editorType.toLowerCase().includes('Assistant Editor'));
      }
      else {
        this.editorData =  this.EditorInChief = this.AssociateEditor =  this.ManagingEditor =this.EditorialboardmembersNational = this.EditorialboardmembersInterNational = this.EditorialboardmembersReviews =[];
      }

      if(this.editorData.length < 1 )
        {
          this.router.navigateByUrl('/');
        }
     
    });
  }
 
  ManagingEditorNames: any;
  GetDataforEditors()
  {
    this.EditorInChief = this.filteredEditors.filter((item: { editorType: string; }) => item.editorType.toLowerCase().includes('editor in chief')); //
    this.AssociateEditor = this.filteredEditors.filter((item: { editorType: string; }) => item.editorType.toLowerCase().includes('associate editors'));
    this.ManagingEditor = this.filteredEditors.filter((item: { editorType: string; }) => item.editorType.toLowerCase().includes('managing editor'));
 
    this.ManagingEditorNames = this.ManagingEditor.map(
      (editor: { editorName: any }, index: number) => {
        const color = index % 2 === 0 ? 'EditorColor1' : 'EditorColor2'; // Alternate colors
        return `<span style="color: ${color}">${editor.editorName}</span>`;
      }
    ).join('<br/>');
    
    this.AssistantEditors = this.filteredEditors.filter((item: { editorType: string; }) => item.editorType.toLowerCase().includes('assistant editor'));
  }
 
  

}
