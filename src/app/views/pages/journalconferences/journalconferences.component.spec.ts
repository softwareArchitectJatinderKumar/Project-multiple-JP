import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalconferencesComponent } from './journalconferences.component';

describe('JournalconferencesComponent', () => {
  let component: JournalconferencesComponent;
  let fixture: ComponentFixture<JournalconferencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournalconferencesComponent]
    });
    fixture = TestBed.createComponent(JournalconferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
