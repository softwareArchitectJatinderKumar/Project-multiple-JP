import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorHeaderComponent } from './EditorHeader.component';

describe('EditorHeaderComponent', () => {
  let component: EditorHeaderComponent;
  let fixture: ComponentFixture<EditorHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorHeaderComponent]
    });
    fixture = TestBed.createComponent(EditorHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
