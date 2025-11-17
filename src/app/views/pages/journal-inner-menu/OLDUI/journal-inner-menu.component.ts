import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';

@Component({
  selector: 'app-journal-inner-menu',
  templateUrl: './journal-inner-menu.component.html',
  standalone: false,styleUrls: ['./journal-inner-menu.component.scss']
})
export class JournalInnerMenuComponent implements OnInit {
  BookId: any;
  name: any;

  constructor(private journalWebApiService: LpujournalbookService, private route: ActivatedRoute, private router: Router) { }
  VisitUrl( Id: any, name : any, Sufix : any) {
    this.router.navigateByUrl( Id + '/'+ name +'/'+ Sufix);
    // this.router.navigate([Prefix, Id, name, Sufix]);
    // this.router.navigateByUrl('/Home/' + Id + '/' + bookDetails[0].bookTitle+"/About");
  }

  ngOnInit(): void {
    let BookId  = this.route.snapshot.params['BookId'];
    let name  = this.route.snapshot.params['name'];
   // this.route.queryParams.subscribe(params => {
     // const BookId = params['BookId'];
      // console.log("Value of Book Id = " + BookId)
      if (BookId != undefined && BookId != null) {
        this.BookId = BookId;
        this.name = name;
      } else {
       
        // swal.fire({
        //   icon: 'error',
        //   title: 'Oops...',
        //   text: 'Something went wrong!',
        //   confirmButtonText: 'Ok'
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     this.router.navigate(['JournalWeb']);
        //   }
        // });
      }
  //  })
  }

}
