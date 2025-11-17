import { Component, OnInit } from '@angular/core';
// import { ColumnMode } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
// import swal from 'sweetalert2';

@Component({
  selector: 'app-corection-retraction-policy',
  templateUrl: './corection-retraction-policy.component.html',
  standalone: false,styleUrls: ['./corection-retraction-policy.component.scss']
})
export class CorectionRetractionPolicyComponent implements OnInit {
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
