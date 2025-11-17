import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalhomeComponent } from './journalhome.component';

describe('JournalhomeComponent', () => {
  let component: JournalhomeComponent;
  let fixture: ComponentFixture<JournalhomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournalhomeComponent]
    });
    fixture = TestBed.createComponent(JournalhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
