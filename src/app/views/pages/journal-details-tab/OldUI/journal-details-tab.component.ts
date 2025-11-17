import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';

@Component({
  selector: 'app-journal-details-tab',
  templateUrl: './journal-details-tab.component.html',
  standalone: false,styleUrls: ['./journal-details-tab.component.scss']
})
export class JournalDetailsTabComponent implements OnInit {
  @Input() items: any[] = [];
  BookId: any;
  BooksTabsData: any;
  thrust: any;
  thrustAreas: any;
  articleTypes: any;
  JSON: any;
  constructor(
    private journalWebApiService: LpujournalbookService, private route: ActivatedRoute, private router: Router

  ) { }

  parseThrustAreas(thrustAreasString: string): string[] {
    try {
      // debugger;
      const thrustAreasArray = JSON.parse(thrustAreasString);
      return thrustAreasArray.map((area: string) => area.split(','));
    } catch (error) {
      console.error('Error parsing thrustAreas:', error);
      return [];
    }
  }
  
  ngOnInit(): void {

    let BookId = this.route.snapshot.params['BookId'];
    let name = this.route.snapshot.params['name'];

    // console.log("Value of Book Id = " + BookId)
    if (BookId != undefined && BookId != null) {
      this.BookId = BookId;
      this.GetTabsDetails(this.BookId);
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
  }

  //   this.route.queryParams.subscribe(params => {
  //
  //     const BookId = params['BookId'];
  //     console.log("Value of Book Id = " + BookId)
  //     if (BookId && BookId.length >= 1) {
  //       this.BookId = BookId;
  //     } else {
  //       swal.fire({
  //         icon: 'error',
  //         title: 'Oops...',
  //         text: 'Something went wrong!',
  //         confirmButtonColor: '#3085d6',
  //         confirmButtonText: 'Ok'
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           this.router.navigate(['JournalHome']);
  //         }
  //       });
  //     }
  //   })
  // }

  GetTabsDetails(BookId: any): void {
    this.journalWebApiService.GetBookTabsDetails(BookId).subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.BooksTabsData = response.item1;
        // this.thrustAreas = JSON.parse(this.BooksTabsData.thrustArea);
        // this.articleTypes = JSON.parse(this.BooksTabsData.articleType);
        // console.log(" Thrust " + JSON.stringify(this.thrustAreas))
        // console.log(" Articles " + JSON.stringify(this.articleTypes))
      }
      else {
        this.BooksTabsData = this.thrustAreas = this.articleTypes = [];
      }
      // console.log(" DATA String Books Tab" + JSON.stringify(this.BooksTabsData))
    });
  }
}
