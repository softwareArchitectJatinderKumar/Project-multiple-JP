import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
// import swal from 'sweetalert2';

@Component({
  selector: 'app-journal-details-tab',
  templateUrl: './journal-details-tab.component.html',
  styleUrls: ['./journal-details-tab.component.scss'],standalone: false
})
export class JournalDetailsTabComponent implements OnInit {
  @Input() items: any ;
  itemsArray: any[] = [];
  BookId: any;
  constructor(
    private route: ActivatedRoute, private router: Router

  ) { }
  tabs = [
    {
      id: 'Introduction',
      label: 'Introduction',
      contentKey: 'introduction',
      scrollId: 'journal-scroll'
    },
    {
      id: 'Scope-of-Journal',
      label: 'Scope of Journal',
      contentKey: 'scopeofJournal',
      scrollId: 'scope-scroll'
    },
    {
      id: 'Thrust-Areas',
      label: 'Thrust Areas',
      contentKey: 'thrustArea',
      scrollId: 'thrust-scroll'
    },
    {
      id: 'Article-Types',
      label: 'Article Types',
      contentKey: 'articleType',
      scrollId: 'article-scroll'
    }
  ];
  ngOnInit(): void {

    let BookId = this.route.snapshot.params['Id'];
    let name = this.route.snapshot.params['name'];

    // if (this.items && !Array.isArray(this.items)) {
    //   this.itemsArray = [this.items]; // Wrap it in an array
    //   console.log(this.itemsArray)
    // } else {
    //   this.itemsArray = this.items;
    // }
 
    if (BookId != undefined && BookId != null) {
      this.BookId = BookId;
      if (this.items && !Array.isArray(this.items)) {
        this.itemsArray = [this.items];  
      } else {
        this.itemsArray = this.items;
      }
    }
  }
 
}
