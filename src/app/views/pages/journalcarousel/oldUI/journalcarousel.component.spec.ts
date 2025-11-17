import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalcarouselComponent } from './journalcarousel.component';

describe('JournalcarouselComponent', () => {
  let component: JournalcarouselComponent;
  let fixture: ComponentFixture<JournalcarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournalcarouselComponent]
    });
    fixture = TestBed.createComponent(JournalcarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
