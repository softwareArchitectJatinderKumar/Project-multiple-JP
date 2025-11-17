import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
@Component({
  selector: 'app-journalconferences',
  templateUrl: './journalconferences.component.html',
  standalone: false,styleUrls: ['./journalconferences.component.scss']
})
export class JournalconferencesComponent {
  BookId: any;
  name: any;

  constructor(private journalWebApiService: LpujournalbookService, private route: ActivatedRoute, private router: Router) { }
  VisitUrl(Prefix: any, Id: any, name : any, Sufix : any) {
    this.router.navigateByUrl(Prefix + Id + '/'+ name +'/'+ Sufix);
  }
}
