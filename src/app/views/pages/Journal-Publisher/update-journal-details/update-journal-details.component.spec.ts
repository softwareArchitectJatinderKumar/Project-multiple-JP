import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateJournalDetailsComponent } from './update-journal-details.component';

describe('UpdateJournalDetailsComponent', () => {
  let component: UpdateJournalDetailsComponent;
  let fixture: ComponentFixture<UpdateJournalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateJournalDetailsComponent]
    });
    fixture = TestBed.createComponent(UpdateJournalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
