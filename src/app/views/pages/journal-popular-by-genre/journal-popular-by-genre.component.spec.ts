import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalPopularByGenreComponent } from './journal-popular-by-genre.component';

describe('JournalPopularByGenreComponent', () => {
  let component: JournalPopularByGenreComponent;
  let fixture: ComponentFixture<JournalPopularByGenreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournalPopularByGenreComponent]
    });
    fixture = TestBed.createComponent(JournalPopularByGenreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
