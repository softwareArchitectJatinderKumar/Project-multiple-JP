import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-interest-confilict-policy',
  templateUrl: './interest-confilict-policy.component.html',
  standalone: false,styleUrls: ['./interest-confilict-policy.component.scss']
})
export class InterestConfilictPolicyComponent implements OnInit {
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
