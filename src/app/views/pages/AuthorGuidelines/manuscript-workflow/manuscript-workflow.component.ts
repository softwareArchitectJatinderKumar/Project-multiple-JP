import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
// import swal from 'sweetalert2';

@Component({
  selector: 'app-MenuScript-workflow',
  templateUrl: './manuscript-workflow.component.html',
  standalone: false,styleUrls: ['./manuScript-workflow.component.scss']
})
export class ManuScriptWorkflowComponent implements OnInit {
  BookId: any;
  bookData: any;
  name: any;

  constructor(
    private journalWebApiService: LpujournalbookService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    let BookId = this.route.snapshot.params['Id'];
    let name = this.route.snapshot.params['name'];
    // console.log("Value of Book Id = " + BookId)
    if (BookId != undefined && BookId != null) {
      this.BookId = BookId;
      // this.name = name;
      this.name = name.replace(/-/g, ' ');
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
