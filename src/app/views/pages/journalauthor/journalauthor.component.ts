import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
@Component({
  selector: 'app-journalauthor',
  templateUrl: './journalauthor.component.html',
  standalone: false,styleUrls: ['./journalauthor.component.scss']
})
export class JournalauthorComponent {
  authorDetails: any;
  constructor( 
    private route: ActivatedRoute,
    private journalWebApiService: LpujournalbookService,
    private router: Router,) { }

  ngOnInit(): void {
    this.getAuthorDetails();
  }
  getAuthorDetails(): void {
    this.journalWebApiService.GetJournalAuthorDetails().subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        //  this.uploadedDocList = response.item1.filter((item: { stage: number; filePath: string; }) => item.stage === 7 && item.filePath !== null);
        // this.authorDetails = response.item1.filter((item: { id: number }, index: number) => {
        //   return index<4;
        // })
        this.authorDetails = response.item1
        // .sort((a: { BookId: number }, b: { BookId: number }) => b.BookId - a.BookId)
        .sort((a: { firstName: string }, b: { firstName: string }) => {
          // Convert both names to lowercase for case-insensitive comparison
          const nameA = a.firstName.toLowerCase();
          const nameB = b.firstName.toLowerCase();
          // Compare the names in descending order
          if (nameA < nameB) {
              return -1;
          }
          if (nameA > nameB) {
              return 1;
          }
          // Names are equal
          return 0;
      })
        .filter((item: { id: number }, index: number) => index < 4);
      }
      else {
        this.authorDetails = [];
      }
    });
  }
}