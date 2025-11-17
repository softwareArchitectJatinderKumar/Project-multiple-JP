import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalInnerMenuComponent } from './journal-inner-menu.component';

describe('JournalInnerMenuComponent', () => {
  let component: JournalInnerMenuComponent;
  let fixture: ComponentFixture<JournalInnerMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournalInnerMenuComponent]
    });
    fixture = TestBed.createComponent(JournalInnerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
