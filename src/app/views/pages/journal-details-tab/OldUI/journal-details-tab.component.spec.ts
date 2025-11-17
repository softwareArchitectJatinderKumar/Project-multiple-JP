import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalDetailsTabComponent } from './journal-details-tab.component';

describe('JournalDetailsTabComponent', () => {
  let component: JournalDetailsTabComponent;
  let fixture: ComponentFixture<JournalDetailsTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournalDetailsTabComponent]
    });
    fixture = TestBed.createComponent(JournalDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
