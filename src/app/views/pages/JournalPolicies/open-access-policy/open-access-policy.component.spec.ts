import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAccessPolicyComponent } from './open-access-policy.component';

describe('OpenAccessPolicyComponent', () => {
  let component: OpenAccessPolicyComponent;
  let fixture: ComponentFixture<OpenAccessPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenAccessPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenAccessPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
