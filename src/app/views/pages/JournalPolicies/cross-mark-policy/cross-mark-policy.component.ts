import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
// import swal from 'sweetalert2';

@Component({
  selector: 'app-cross-mark-policy',
  templateUrl: './cross-mark-policy.component.html',
  standalone: false,styleUrls: ['./cross-mark-policy.component.scss']
})
export class CrossMarkPolicyComponent implements OnInit {
  BookId: any; name: any;
  bookData: any;

  constructor(
     private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    let BookId  = this.route.snapshot.params['Id'];
    let name  = this.route.snapshot.params['name'];
      // console.log("Value of Book Id = " + BookId)
      if (BookId != undefined && BookId != null) {
        this.BookId = BookId;
        // this.name = name;
        this.name = name.replace(/-/g, ' ');
      } else {
       
        console.log("error Somthing went wrong");
       this.router.navigate(['/Home']);
      }
   // })
  }

}
