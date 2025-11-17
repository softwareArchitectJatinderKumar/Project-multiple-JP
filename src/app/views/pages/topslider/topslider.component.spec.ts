import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopsliderComponent } from './topslider.component';

describe('TopsliderComponent', () => {
  let component: TopsliderComponent;
  let fixture: ComponentFixture<TopsliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopsliderComponent]
    });
    fixture = TestBed.createComponent(TopsliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
