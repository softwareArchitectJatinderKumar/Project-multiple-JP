import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
// import swal from 'sweetalert2';

@Component({
  selector: 'app-complaint-policy',
  templateUrl: './complaint-policy.component.html',
  standalone: false,styleUrls: ['./complaint-policy.component.scss']
})
export class ComplaintPolicyComponent implements OnInit {
  BookId: any; name: any;
  bookData: any;

  constructor(
     private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    let BookId  = this.route.snapshot.params['Id'];
    let name  = this.route.snapshot.params['name'];
    //this.route.queryParams.subscribe(params => {
      // const BookId = params['BookId'];
      // const name = params['name'];
      // console.log("Value of Book Id = " + BookId)
      if (BookId != undefined && BookId != null) {
        this.BookId = BookId;
        // this.name = name;
        this.name = name.replace(/-/g, ' ');
      } else {
       console.log("error Somthing went wrong");
       this.router.navigate(['/Home']);
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

}
