import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import swal from 'sweetalert2';

@Component({
  selector: 'app-journal-editor-board',
  templateUrl: './journal-editor-board.component.html',
  standalone: false,styleUrls: ['./journal-editor-board.component.scss']
})
export class JournalEditorBoardComponent implements OnInit {
  BookId: any; name: any;
  editorData: any;
  EditorInChief: any;
  AssociateEditor: any;
  ManagingEditor: any;
  EditorialboardmembersNational: any;
  EditorialboardmembersReviews: any;
  EditorialboardmembersInterNational: any;
  LoadingData: boolean = false;
  filteredEditors: any;
  JournalTitle: any;
  constructor(
    private journalWebApiService: LpujournalbookService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // let name  = this.route.snapshot.params['name'];
    let BookId  = this.route.snapshot.params['Id'];
    let name  = this.route.snapshot.params['name'];
    //this.route.queryParams.subscribe(params => {
      // const BookId = params['BookId'];
      // const name = params['name'];
      // console.log("Value of Book Id = " + BookId)
      if (BookId != undefined && BookId != null) {
        this.BookId = BookId;
        this.name = name.replace(/-/g, ' ');
        this.GetJournalEditorsDetailsByBookId(BookId);
      } else {
       
        // swal.fire({
        //   icon: 'error',
        //   title: 'Oops...',
        //   text: 'Something went wrong!',
        //   confirmButtonColor: '#3085d6',
        //   confirmButtonText: 'Ok'
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     this.router.navigate(['/journalHome']);
        //   }
        // });
      }
   // })

    // this.route.queryParams.subscribe(params => {
    //   const BookId = params['BookId'];
    //   console.log("Value of Book Id = " + BookId)
    //   if (BookId && BookId.length >= 1) {
    //     this.GetJournalEditorsDetailsByBookId(BookId);
    //   } else {
    //     swal.fire({
    //       icon: 'error',
    //       title: 'Oops...',
    //       text: 'Something went wrong!',
    //       confirmButtonColor: '#3085d6',
    //       confirmButtonText: 'Ok'
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //         this.router.navigate(['/journalHome']);
    //       }
    //     });
    //   }
    // })
  }

  GetJournalEditorsDetailsByBookId(BookId: any): void {
    this.journalWebApiService.GetAllJournalEditorsDetails().subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.editorData = response.item1;        
      this.filteredEditors = this.editorData.filter((item: { journalId: any }) => item.journalId === BookId);
      this.GetDataforEditors();
      this.EditorialboardmembersNational = this.filteredEditors.filter((item: { editorType: string; }) => item.editorType.toLowerCase().includes('editorial board members national'));
      this.EditorialboardmembersInterNational = this.filteredEditors.filter((item: { editorType: string; }) => item.editorType.toLowerCase().includes('editorial board members international'));

      // console.log(JSON.stringify(this.filteredEditors))
      // console.log(JSON.stringify(this.EditorialboardmembersInterNational))
      }
      else {
        this.editorData =  this.EditorInChief = this.AssociateEditor =  this.ManagingEditor =this.EditorialboardmembersNational = this.EditorialboardmembersInterNational = this.EditorialboardmembersReviews =[];
      }

      if(this.editorData.length < 1 )
        {
          this.LoadingData= true;
          this.router.navigateByUrl('/');
        }
     
    });
  }
  GetDataforEditors() {
    const importantRoles = ["head", "dean", "associate dean", "associate professor", "assistant professor"];
  
    const getPriority = (designation: string) => {
      designation = designation.toLowerCase();
      for (let i = 0; i < importantRoles.length; i++) {
        if (designation.includes(importantRoles[i])) {
          return i + 1; // Assign priority based on order in array
        }
      }
      return importantRoles.length + 1; // Default priority for others
    };
  
    const prioritizeByDesignation = (editors: any[]) => 
      editors.sort((a, b) => getPriority(a.designation) - getPriority(b.designation));
  
    this.EditorInChief = this.filteredEditors.filter((item: { editorType: string }) => 
      item.editorType.toLowerCase().includes('editor in chief')
    );
  
    this.AssociateEditor = prioritizeByDesignation(
      this.filteredEditors.filter((item: { editorType: string }) => 
        item.editorType.toLowerCase().includes('associate editors')
      )
    );
  
    this.ManagingEditor = prioritizeByDesignation(
      this.filteredEditors.filter((item: { editorType: string }) => 
        item.editorType.toLowerCase().includes('managing editor')
      )
    );
  
    this.EditorialboardmembersReviews = prioritizeByDesignation(
      this.filteredEditors.filter((item: { editorType: string }) => 
        item.editorType.toLowerCase().includes('reviewers')
      )
    );
  
    // console.log("Editor-in-Chief:", JSON.stringify(this.EditorInChief));
    // console.log("Sorted Associate Editors:", JSON.stringify(this.AssociateEditor));
    // console.log("Sorted Managing Editors:", JSON.stringify(this.ManagingEditor));
    // console.log("Sorted Editorial Board Members:", JSON.stringify(this.EditorialboardmembersReviews));
  }
  
  
  
  // GetDataforEditors() {
  //   this.EditorInChief = this.filteredEditors.filter((item: { editorType: string; }) => item.editorType.toLowerCase().includes('editor in chief')); //
  //   //this.AssociateEditor = this.filteredEditors.filter((item: { editorType: string; }) => item.editorType.toLowerCase().includes('associate editors'));
  //   this.AssociateEditor = this.filteredEditors
  //     .filter((item: { editorType: string }) =>
  //       item.editorType.toLowerCase().includes('associate editors')
  //     )
  //     .sort((a: { designation: string }, b: { designation: string }) => {
  //       const importantRoles = ["head", "dean", "associate dean"];

  //       const getPriority = (designation: string) => {
  //         designation = designation.toLowerCase();
  //         if (designation.includes("head")) return 1;
  //         if (designation.includes("dean")) return 2;
  //         if (designation.includes("associate dean")) return 3;
  //         return 4; // Default priority for others
  //       };

  //       return getPriority(a.designation) - getPriority(b.designation);
  //     });

  //   this.ManagingEditor = this.filteredEditors.filter((item: { editorType: string; }) => item.editorType.toLowerCase().includes('managing editor'));

  //   // this.EditorialboardmembersReviews = this.filteredEditors.filter((item: { editorType: string; }) => item.editorType.toLowerCase().includes('reviewers '));
  // }
}
