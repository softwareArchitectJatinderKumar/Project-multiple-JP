import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalfooterComponent } from './journalfooter.component';

describe('JournalfooterComponent', () => {
  let component: JournalfooterComponent;
  let fixture: ComponentFixture<JournalfooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournalfooterComponent]
    });
    fixture = TestBed.createComponent(JournalfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
