import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';


@Component({
  selector: 'app-journalcarousel',
  templateUrl: './journalcarousel.component.html',
  standalone: false, styleUrls: ['./journalcarousel.component.scss']
})
export class JournalcarouselComponent {
  slides: any[] = [];
  data: any;
  booksData: any;
  background: any;
  serverUrl: any = 'https://files.lpu.in/umsweb/Journal/';
  navigateToUrl(Id: any) {
    let bookDetails = this.booksData.filter((x: { id: any }) => x.id === Id);

    if (bookDetails.length > 0) {
      var Journaltitle = bookDetails[0].journalTitle;

      const titleParts = Journaltitle.split('(');
      let a = titleParts[0].trim(); // Trim spaces before replacing

      a = a ? a.replace(/\s+/g, '-') : '';

   
      a = a.replace(/-$/, '');

      this.router.navigateByUrl(Id + '/' + a + '/About');
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }
  getWordCount(content: string): number {
    if (!content) {
      return 0;
    }
    return content.split(/\s+/).length;
  }
  getBackgroundColor(index: number): string {
    const colors = ['#D298BD', '#F4ACAC', '#95D2E5']; // Array of background colors
    return colors[index % colors.length];    // Rotate through the colors
  }
  constructor(private journalWebApiService: LpujournalbookService,
    private router: Router,) { this.imageLoadError = new Array(this.slides.length).fill(false); }

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
        "breakpoint": 1400,
        "settings": {
          "arrows": true,
          "infinite": true,
          "slidesToShow": 3,
          "slidesToScroll": 1
        }
      },
      {
        "breakpoint": 1024,
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
    });
  }

  isLoading: boolean[] = [];
  loadingTimeout: any[] = [];  
  fallbackImages: string[] = [
    
    'assets/journal/6.jpg',
    'assets/journal/5.jpg',
    'assets/journal/4.jpg',
    'assets/journal/3.jpg',
    'assets/journal/2.jpg',
    'assets/journal/1.jpg'
   
  ];

 
  loadSlides() {
    this.slides.forEach((slide, index) => {
      this.isLoading[index] = true;
      this.setupLoadingTimeout(index);  
    });
  }

  setupLoadingTimeout(index: number) {
    
    this.loadingTimeout[index] = setTimeout(() => {
      this.isLoading[index] = false; // Stop showing loading
      this.slides[index].imageUrl = this.fallbackImages[index % this.fallbackImages.length]; // Use fallback image
    }, 5000); // 5 seconds timeout
  }

  imageSrc(index: number): string {
    return this.slides[index]?.imageUrl || '';  
  }

  onImageLoad(index: number) {
    this.isLoading[index] = false;
    clearTimeout(this.loadingTimeout[index]);
  }

  onImageError(index: number) {
    this.isLoading[index] = false;
    clearTimeout(this.loadingTimeout[index]);
    this.slides[index].imageUrl = this.fallbackImages[index % this.fallbackImages.length]; // Use fallback image
  }
  imageLoadError: boolean[] = [];
  handleImageError(index: number) {
    this.imageLoadError[index] = true;
  }
  handleImageLoad(index: number) {
    this.imageLoadError[index] = false;
  }

  checkImageLoad(event: Event, index: number) {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement.naturalWidth === 0 || imgElement.naturalHeight === 0) {
      this.imageLoadError[index] = true;
    } else {
      this.imageLoadError[index] = false;
    }
  }
}
