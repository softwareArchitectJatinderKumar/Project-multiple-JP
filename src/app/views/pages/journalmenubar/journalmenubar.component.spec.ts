import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalmenubarComponent } from './journalmenubar.component';

describe('JournalmenubarComponent', () => {
  let component: JournalmenubarComponent;
  let fixture: ComponentFixture<JournalmenubarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournalmenubarComponent]
    });
    fixture = TestBed.createComponent(JournalmenubarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
