import { Component, OnInit } from '@angular/core';
 
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
 
@Component({
  selector: 'app-plagriasm-policy',
  templateUrl: './plagriasm-policy.component.html',
  standalone: false,styleUrls: ['./plagriasm-policy.component.scss']
})
export class PlagriasmPolicyComponent implements OnInit {
  BookId: any; name: any;
  bookData: any;

  constructor(
    private journalWebApiService: LpujournalbookService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    let BookId  = this.route.snapshot.params['Id'];
    let name  = this.route.snapshot.params['name'];
      if (BookId != undefined && BookId != null) {
        this.BookId = BookId;       
        this.name = name;
        this.name = name.replace(/-/g, ' ');
      } else {       
        console.log("error Somthing went wrong");
       this.router.navigate(['/Home']);
      }
  }

}
