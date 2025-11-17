import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
 

@Component({
  selector: 'app-open-access-policy',
  templateUrl: './open-access-policy.component.html',
  standalone: false,styleUrls: ['./open-access-policy.component.scss']
})
export class OpenAccessPolicyComponent implements OnInit {
  BookId: any; name: any;
  bookData: any;

  constructor(
     private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    let BookId  = this.route.snapshot.params['Id'];
    let name  = this.route.snapshot.params['name'];
      if (BookId != undefined && BookId != null) {
        this.BookId = BookId;        
        // this.name = name;
        this.name = name.replace(/-/g, ' ');
      } else {       
        console.log("error Somthing went wrong");
       this.router.navigate(['/Home']);
      }
  }

}
