import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';

@Component({
  selector: 'app-journalcarousel',
  templateUrl: './journalcarousel.component.html',
  standalone: false,styleUrls: ['./journalcarousel.component.scss']
})
export class JournalcarouselComponent {
  slides: any;
  data: any;
  booksData: any;
  background: any;
  navigateToUrl(Id: any) {
    // this.router.navigateByUrl(url);
    // this.router.navigate(['JournalAbout'], { queryParams: { BookId: Id } });
    let bookDetails = this.booksData.filter((x: { bookId: any; }) => x.bookId === Id);
    this.router.navigateByUrl( Id + '/' + bookDetails[0].bookTitle+"/About");
    // this.router.navigate(['JournalInnerMenu'], { queryParams: { BookId: Id } });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }


  constructor(private journalWebApiService: LpujournalbookService,
    private router: Router,) { }

  ngOnInit(): void {
    this.getBooksDetail();
  }

  slideConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "autoplay": false,
    "autoplaySpeed": 1000,
    "pauseOnHover": true,
    "infinite": true,
    "responsive": [
      {
        "breakpoint": 992,
        "settings": {
          "arrows": true,
          "infinite": true,
          "slidesToShow": 2,
          "slidesToScroll": 1
        }
      },
      {
        "breakpoint": 768,
        "settings": {
          "arrows": true,
          "infinite": true,
          "slidesToShow": 1,
          "slidesToScroll": 1
        }
      },
      {
        "breakpoint": 576,
        "settings": {
          "arrows": true,
          "infinite": true,
          "slidesToShow": 1,
          "slidesToScroll": 1
        }
      }
    ],
    // "prevArrow": '<div class="custom-prev-arrow"></div>', //<img class="prev" src="assets/images/icon/left-arrow.svg">',
    // "nextArrow": '<div class="custom-prev-arrow"></div>' //<img class="next" src="assets/images/icon/right-arrow.svg">'
  };
  slickCarousel: any;

  getBooksDetail(): void {
    this.journalWebApiService.GetAllBooksDetails().subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.booksData = response.item1;
        this.slides = this.booksData;
      }
      else {
        this.slides = [];
      }
      // console.log("Books Details " + JSON.stringify(this.slides));
    });
  }


}
