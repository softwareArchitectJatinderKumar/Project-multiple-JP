import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerReviewPolicyComponent } from './peer-review-policy.component';

describe('PeerReviewPolicyComponent', () => {
  let component: PeerReviewPolicyComponent;
  let fixture: ComponentFixture<PeerReviewPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerReviewPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeerReviewPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
