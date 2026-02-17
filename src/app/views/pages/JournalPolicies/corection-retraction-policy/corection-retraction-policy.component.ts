import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

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
      if (BookId != undefined && BookId != null) {
        this.BookId = BookId;
        this.name = name.replace(/-/g, ' ');
      } else {
        this.router.navigate(['/Home']);
      }
  }

}
