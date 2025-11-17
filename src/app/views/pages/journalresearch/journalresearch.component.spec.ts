import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalresearchComponent } from './journalresearch.component';

describe('JournalresearchComponent', () => {
  let component: JournalresearchComponent;
  let fixture: ComponentFixture<JournalresearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournalresearchComponent]
    });
    fixture = TestBed.createComponent(JournalresearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
