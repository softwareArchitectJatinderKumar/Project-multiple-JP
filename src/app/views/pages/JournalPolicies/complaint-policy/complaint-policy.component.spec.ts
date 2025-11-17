import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintPolicyComponent } from './complaint-policy.component';

describe('ComplaintPolicyComponent', () => {
  let component: ComplaintPolicyComponent;
  let fixture: ComponentFixture<ComplaintPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
