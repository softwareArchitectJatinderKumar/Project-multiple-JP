import { Component } from '@angular/core';

@Component({
  selector: 'app-journalmenubar',
  templateUrl: './journalmenubar.component.html',
  standalone: false,styleUrls: ['./journalmenubar.component.scss']
})
export class JournalmenubarComponent {

  showSearchForm: boolean = false;
  show: boolean = true;
  isSearchOpen: boolean = false;

  toggleSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.show = !this.show;
  }


}
