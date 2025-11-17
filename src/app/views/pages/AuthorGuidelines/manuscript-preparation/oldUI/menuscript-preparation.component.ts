import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import swal from 'sweetalert2';

@Component({
  selector: 'app-ManuScript-preparation',
  templateUrl: './MenuScript-preparation.component.html',
  standalone: false,styleUrls: ['./MenuScript-preparation.component.scss']
})
export class ManuScriptPreparationComponent implements OnInit {
  BookId: any;
  bookData: any;
  name: any;

  constructor(
    private journalWebApiService: LpujournalbookService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    let BookId  = this.route.snapshot.params['BookId'];
    let name  = this.route.snapshot.params['name'];
      // console.log("Value of Book Id = " + BookId)
      if (BookId != undefined && BookId != null) {
        this.BookId = BookId;
        this.name= name;
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
  }

}
