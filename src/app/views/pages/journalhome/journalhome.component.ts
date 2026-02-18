import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-journalhome',
  templateUrl: './journalhome.component.html',
  styleUrls: ['./journalhome.component.scss'],standalone: false
})
export class JournalhomeComponent implements OnInit {

  booksData: any; ServerConnection: any; serverError: boolean = false;

  constructor(
    private journalWebApiService: LpujournalbookService,
    private storageService: StorageService,
    private authService: AuthService,
     private route: ActivatedRoute, private router: Router,) { }


  ngOnInit(): void {
    this.getBooksDetail();
    // let loginName = this.route.snapshot.params['loginName'];
    // if (loginName != '' && loginName != undefined) {
    //   this.getToken(loginName);
    // }
  }

  getToken(id: any) {
    this.authService.loginTemp(id).subscribe({
      next: data => {
        this.storageService.saveUser(data);
      },
      error: err => {
      }
    });
  }

getBooksDetail(): void {
    this.journalWebApiService.GetAllBooksDetails().subscribe({
      next: (response) => {
        if (response.item1 && response.item1.length > 0) {
          this.booksData = response.item1;
          this.ServerConnection = 1;
          this.serverError = false;
        }
        else {
          this.booksData = [];
          this.ServerConnection = 0;
          this.serverError = true;
        }
      },
      error: (error) => {
        console.error('Server error:', error);
        this.ServerConnection = 0;
        this.serverError = true;
      }
    });
  }

  retryConnection(): void {
    this.serverError = false;
    this.getBooksDetail();
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
