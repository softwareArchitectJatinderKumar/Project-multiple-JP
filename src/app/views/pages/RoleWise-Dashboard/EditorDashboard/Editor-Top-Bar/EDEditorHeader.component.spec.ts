import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EDEditorHeaderComponent } from './EDEditorHeader.component';

describe('EditorHeaderComponent', () => {
  let component: EDEditorHeaderComponent;
  let fixture: ComponentFixture<EDEditorHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EDEditorHeaderComponent]
    });
    fixture = TestBed.createComponent(EDEditorHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
