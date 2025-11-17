import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
// import swal from 'sweetalert2';

@Component({
  selector: 'app-digital-self-archiving-policy',
  templateUrl: './digital-self-archiving-policy.component.html',
  standalone: false,styleUrls: ['./digital-self-archiving-policy.component.scss']
})
export class DigitalSelfArchivingPolicyComponent implements OnInit {
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
