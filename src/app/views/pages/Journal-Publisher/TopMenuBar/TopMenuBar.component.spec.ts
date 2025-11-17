import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMenuBarComponent } from './TopMenuBar.component';

describe('TopMenuBarComponent', () => {
  let component: TopMenuBarComponent;
  let fixture: ComponentFixture<TopMenuBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopMenuBarComponent]
    });
    fixture = TestBed.createComponent(TopMenuBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
