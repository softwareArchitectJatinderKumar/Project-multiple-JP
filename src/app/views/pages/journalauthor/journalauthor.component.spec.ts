import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalauthorComponent } from './journalauthor.component';

describe('JournalauthorComponent', () => {
  let component: JournalauthorComponent;
  let fixture: ComponentFixture<JournalauthorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournalauthorComponent]
    });
    fixture = TestBed.createComponent(JournalauthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
