import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestConfilictPolicyComponent } from './interest-confilict-policy.component';

describe('InterestConfilictPolicyComponent', () => {
  let component: InterestConfilictPolicyComponent;
  let fixture: ComponentFixture<InterestConfilictPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestConfilictPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestConfilictPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
