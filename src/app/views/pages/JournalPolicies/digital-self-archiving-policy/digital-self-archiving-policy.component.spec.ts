import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSelfArchivingPolicyComponent } from './digital-self-archiving-policy.component';

describe('DigitalSelfArchivingPolicyComponent', () => {
  let component: DigitalSelfArchivingPolicyComponent;
  let fixture: ComponentFixture<DigitalSelfArchivingPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalSelfArchivingPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalSelfArchivingPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
