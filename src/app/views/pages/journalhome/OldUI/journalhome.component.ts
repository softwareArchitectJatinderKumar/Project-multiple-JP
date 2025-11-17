import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';

@Component({
  selector: 'app-journalhome',
  templateUrl: './journalhome.component.html',
  standalone: false,styleUrls: ['./journalhome.component.scss']
})
export class JournalhomeComponent {
  booksData: any; ServerConnection: any;

  constructor(private journalWebApiService: LpujournalbookService, private router: Router,) { }


  ngOnInit(): void {
    this.getBooksDetail();
  }

  getBooksDetail(): void {
    this.journalWebApiService.GetAllBooksDetails().subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.booksData = response.item1;
        this.ServerConnection = 1;
      }
      else {
        this.booksData = [];
        this.ServerConnection = 0;
      }
    });
    // if (this.ServerConnection == 0) {
    //   (<HTMLInputElement>document.getElementById('HomeComponent')).style.display = 'none';
    //   (<HTMLInputElement>document.getElementById('ServerError')).style.display = 'block';

    // }
    // else  if (this.ServerConnection ==1){
    //   (<HTMLInputElement>document.getElementById('HomeComponent')).style.display = 'block';
    //   (<HTMLInputElement>document.getElementById('ServerError')).style.display = 'none';

    // }

  }

}
