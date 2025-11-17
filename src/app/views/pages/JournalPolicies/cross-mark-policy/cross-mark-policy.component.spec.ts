import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossMarkPolicyComponent } from './cross-mark-policy.component';

describe('CrossMarkPolicyComponent', () => {
  let component: CrossMarkPolicyComponent;
  let fixture: ComponentFixture<CrossMarkPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrossMarkPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrossMarkPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
