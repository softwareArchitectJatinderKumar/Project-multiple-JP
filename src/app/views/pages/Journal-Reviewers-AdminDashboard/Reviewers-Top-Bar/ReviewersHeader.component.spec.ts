import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewersHeaderComponent } from './ReviewersHeader.component';

describe('ReviewersHeaderComponent', () => {
  let component: ReviewersHeaderComponent;
  let fixture: ComponentFixture<ReviewersHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewersHeaderComponent]
    });
    fixture = TestBed.createComponent(ReviewersHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
